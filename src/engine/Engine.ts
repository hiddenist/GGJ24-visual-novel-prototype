import { getChapterAssets } from "../assets/getChapterAssets";
import { Chapter, Character, Place, SaveData, Scene, Dialog, DialogPath, Option, ConditionalWithId, MessageDisplay, OptionDisplay } from "../types";

// Chapter 
//  => Scene 
//  => Dialog
//  => Message
//  => Option

export class Engine<
    PlaceId extends string = string,
    CharacterId extends string = string,
> {
    private saveData: SaveData = {
        choices: {},
        seenMessages: [],
        selectedOptions: [],
        userProfile: {
            name: "Player"
        },
        history: [],
    };
    private chapters: Chapter<PlaceId, CharacterId>[];
    private isWaitingForResponse = false;

    private subscriptions: { [Event in DialogEventType]: DialogEventCallback<Event>[] } = {
        startScene: [],
        startChapter: [],
        displayMessage: [],
    }

    constructor(
        chapters: Chapter<PlaceId, CharacterId>[],
        public readonly places: Record<PlaceId, Place>,
        public readonly characters: Record<CharacterId, Character>,
    ) {
        this.chapters = chapters;
    }

    public subscribe<Event extends DialogEventType>(event: Event, callback: DialogEventCallback<Event>) {
        this.subscriptions[event].push(callback);
    }

    public unsubscribe<Event extends DialogEventType>(event: Event, callback: DialogEventCallback<Event>) {
        const index = this.subscriptions[event].indexOf(callback);
        if (index !== -1) this.subscriptions[event].splice(index, 1);
    }

    private emit<T extends DialogEventType>(event: T, data: DialogEventMap[T]) {
        this.subscriptions[event].forEach(callback => callback(data, this));
    }

    public setPlayerName(name: string) {
        this.saveData.userProfile.name = name;
    }

    public get currentChapter() {
        const chapter = this.chapters[0];
        return chapter;
    }

    public get currentScene() {
        const scene = this.currentChapter.scenes[0];
        return scene;
    }

    public get currentDialog() {
        const dialog = this.currentScene.script[0];
        if (typeof dialog === "string") {
            return {
                message: dialog,
            }
        }
        return dialog;
    }

    private getDialogPath(): DialogPath | null{
        if (!this.currentChapter || !this.currentScene || !this.currentDialog) return null;
        return `${this.currentChapter.id}.${this.currentScene.id}.${this.currentDialog.id}`;
    }

    public selectOption(option: OptionDisplay) {
        this.logOptionSelected(option);
        this.logHistory(option.displayText, this.saveData.userProfile.name);
        this.isWaitingForResponse = false;

        this.getNextDialog(option.skipToDialogId ?? this.currentDialog.nextDialogId);
        this.startDialog();
    }

    public next() {
        console.log("next", { isWaitingForResponse: this.isWaitingForResponse })
        if (this.isWaitingForResponse) {
            return;
        }
        this.getNextDialog();
        this.startDialog();
    }

    private getNextChapter(chapterId?: Chapter["id"]) {
        if (chapterId && !this.chapters.find(chapter => chapter.id === chapterId)) {
            throw new Error(`Chapter with id ${chapterId} does not exist.`);
        }
        do {
            this.chapters.shift();
            if (!this.currentChapter) {
                console.error("No more chapters.");
                return;
            }
        } while (!this.isConditionMet(this.currentChapter, chapterId));
    }
    
    private getNextScene(sceneId?: Scene["id"]) {
        if (sceneId && !this.currentChapter.scenes.find(scene => scene.id === sceneId)) {
            throw new Error(`Scene with id ${sceneId} does not exist in this chapter.`);
        }
        do {
            this.currentChapter.scenes.shift();
            if (!this.currentScene) {
                this.getNextChapter();
                this.startChapter();
                return;
            }
        } while (!this.isConditionMet(this.currentScene, sceneId));
    }

    private getNextDialog(dialogId?: Dialog["id"]) {
        if (dialogId && !this.currentScene.script.find(dialog => typeof dialog === "object" && dialog.id === dialogId)) {
            throw new Error(`Dialog with id ${dialogId} does not exist in this scene.`);
        }
        do {
            this.currentScene.script.shift();
            if (!this.currentDialog) {
                this.getNextScene();
                this.startScene();
                return;
            }
        } while (!this.isConditionMet(this.currentDialog, dialogId));
    }

    public startChapter() {
        const chapter = this.currentChapter;
        this.emit(DialogEventType.StartChapter, { chapter, assets: getChapterAssets(chapter, this.places) });
    }

    public startScene() {
        this.emit(DialogEventType.StartScene, { scene: this.currentScene, place: this.places[this.currentScene.placeId] });
    }

    public startDialog() {
        this.showMessage(this.currentDialog);
    }

    private showMessage(dialog: Dialog<CharacterId>) {
        const characterId = dialog.character?.characterId;
        const character = characterId && this.characters[characterId];
        const message: MessageDisplay = {
            displayText: this.handleTextReplacements(dialog.message),
            speaker: character?.name,
            foregroundImage: dialog.character?.imageKey && character?.images[dialog.character.imageKey],
            options: dialog.choice?.map(option => ({
                ...option,
                displayText: this.handleTextReplacements(option.message ?? option.value.toString()),
            })),
        }
        this.emit(DialogEventType.DisplayMessage, { dialog, message });
        if (dialog.choice?.length) {
            this.isWaitingForResponse = true;
        } else {
            console.log("no options", dialog);
        }
        this.logMessageSeen();
        this.logHistory(message.displayText, message.speaker);
    }

    private handleTextReplacements(text: string) {
        const result = text.replace(/{(profile|choice).([\w.-]+)}/g,  (_, section: "profile" | "choice", key) => {
            switch (section) {
                case "profile":
                    return this.saveData.userProfile[key as keyof SaveData["userProfile"]] ?? "???";
                case "choice":
                    console.log(this.saveData.choices);
                    return this.saveData.choices[key as keyof SaveData["choices"]]?.toString() ?? "???";
            }
        });
        return result;
    }

    private logMessageSeen() {
        const path = this.getDialogPath();
        if (path) {
            this.saveData.seenMessages.push(path);
        }
    }

    private logOptionSelected(option: Option) {
        if (option.id) {
            const path = this.getDialogPath();
            if (!path) throw new Error("Dialog path is not available.");
            this.saveData.selectedOptions.push(`${path}.${option.id}`);
            this.saveData.choices[path] = option.value;
        }
    }

    private logHistory(message: string, characterName?: string) {
        this.saveData.history.push({ message, date: new Date(), characterName });
    }

    private isConditionMet(conditional: ConditionalWithId | string, matchesId?: string) {
        if (typeof conditional === "string") {
            return matchesId == null;
        }
        if (matchesId != null && conditional.id !== matchesId) return false;

        const condition = conditional.condition;

        if (!condition) return true;

        switch (condition.type) {
            case "seenMessage":
                return this.saveData.seenMessages.includes(condition.message);
            case "selectedOption":
                return this.saveData.selectedOptions.includes(condition.option);
            case "notSelectedOption":
                return !this.saveData.selectedOptions.includes(condition.option);
            case "notSeenMessage":
                return !this.saveData.seenMessages.includes(condition.message);
        }
    }
}

export enum DialogEventType {
    StartChapter = "startChapter",
    StartScene = "startScene",
    DisplayMessage = "displayMessage",
}

export interface Asset {
    type: "image" | "audio"
    src: string
}

export interface DialogEventMap {
    [DialogEventType.StartChapter]: { chapter: Chapter, assets: Asset[] }
    [DialogEventType.StartScene]: { scene: Scene, place: Place }
    [DialogEventType.DisplayMessage]: { message: MessageDisplay, dialog: Dialog }
}

export type DialogEventCallback<Event extends DialogEventType> = (data: DialogEventMap[Event], engine: Engine, ) => void;


