import { characters } from "./data/characters";
import { Chapter, SaveData, Scene, Dialog, DialogPath, Option, Message, ConditionalWithId } from "./types";

// Chapter 
//  => Scene 
//  => Dialog
//  => Message
//  => Option

export class Engine {
    private saveData: SaveData = {
        choices: {},
        seenMessages: [],
        selectedOptions: [],
        userProfile: {
            name: "Player"
        },
        history: [],
    };
    private chapters: Chapter[];

    private subscriptions: { [Event in DialogEventType]: DialogEventCallback<Event>[] } = {
        startScene: [],
        startChapter: [],
        displayMessage: [],
        displayOptions: [],
    }

    constructor(chapters: Chapter[]) {
        this.chapters = structuredClone(chapters);
    }

    public subscribe<Event extends DialogEventType>(event: Event, callback: DialogEventCallback<Event>) {
        this.subscriptions[event].push(callback);
    }

    public unsubsribe<Event extends DialogEventType>(event: Event, callback: DialogEventCallback<Event>) {
        const index = this.subscriptions[event].indexOf(callback);
        if (index !== -1) this.subscriptions[event].splice(index, 1);
    }

    private emit<T extends DialogEventType>(event: T, data: DialogEventMap[T]) {
        this.subscriptions[event].forEach(callback => callback(this, data));
    }

    public start() {
        this.startChapter();
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
        const dialog = this.currentScene.dialog[0];
        return dialog;
    }

    public get currentMessage() {
        const message = this.currentDialog.messages[0];
        return message;
    }

    private getDialogPath(): DialogPath | null{
        if (!this.currentChapter || !this.currentScene || !this.currentDialog) return null;
        return `${this.currentChapter.id}.${this.currentScene.id}.${this.currentDialog.id}`;
    }

    public selectOption(option: Option) {
        this.logOptionSelected(option);
        this.logHistory(option.text, this.saveData.userProfile.name);
        this.getNextDialog(option.nextDialogId ?? this.currentDialog.nextDialogId);
        this.startDialog();
    }

    public endCurrentDialog() {
        if (this.currentDialog.options) {
            this.emit(DialogEventType.DisplayOptions, this.currentDialog.options);
        } else {
            this.getNextDialog(this.currentDialog?.nextDialogId);
            this.startDialog();
        }
    }

    public next() {
        this.getNextMessage();
    }

    private getNextChapter(chapterId?: Chapter["id"]) {
        if (chapterId && !this.chapters.find(chapter => chapter.id === chapterId)) {
            throw new Error(`Chapter with id ${chapterId} does not exist.`);
        }
        do {
            this.chapters.shift();
            if (!this.currentChapter) {
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
                return this.getNextChapter();
            }
        } while (!this.isConditionMet(this.currentScene, sceneId));
    }

    private getNextDialog(dialogId?: Dialog["id"]) {
        if (dialogId && !this.currentScene.dialog.find(dialog => dialog.id === dialogId)) {
            throw new Error(`Dialog with id ${dialogId} does not exist in this scene.`);
        }
        do {
            this.currentScene.dialog.shift();
            if (!this.currentDialog) {
                return this.getNextScene();
            }
        } while (!this.isConditionMet(this.currentDialog, dialogId));
    }

    private getNextMessage(messageId?: Message["id"]) {
        if (messageId && !this.currentDialog.messages.find(message => message.id === messageId)) {
            throw new Error(`Message with id ${messageId} does not exist in this dialog.`);
        }
        do {
            this.currentDialog.messages.shift();
            if (!this.currentMessage) {
                return this.getNextDialog();
            }
        } while (!this.isConditionMet(this.currentMessage, messageId));
    }

    private startChapter() {
        this.emit(DialogEventType.StartChapter, this.currentChapter);
        this.startScene();
    }

    private startScene() {
        this.emit(DialogEventType.StartScene, this.currentScene);
        this.startDialog();
    }

    private startDialog() {
        this.showMessage(this.currentMessage);
    }

    private showMessage(message: Message) {
        const characterId = message.character?.characterId;
        const character = characterId && characters[characterId];
        const messageDisplay = {
            text: typeof message.text === "function" ? message.text(this.saveData) : message.text,
            characterName: character.name,
            characterImage: message.character?.imageKey && character.images[message.character.imageKey],
        }
        this.emit(DialogEventType.DisplayMessage, messageDisplay);
        this.logMessageSeen(message);
        this.logHistory(messageDisplay.text, messageDisplay.characterName);
    }

    private logMessageSeen(message: Message) {
        if (message.id) {
            const path = this.getDialogPath();
            if (!path) throw new Error("Dialog path is not available.");
            this.saveData.seenMessages.push(`${path}.${message.id}`);
        }
    }

    private logOptionSelected(option: Option) {
        if (option.id) {
            const path = this.getDialogPath();
            if (!path) throw new Error("Dialog path is not available.");
            this.saveData.selectedOptions.push(`${path}.${option.id}`);
        }
    }

    private logHistory(message: string, characterName?: string) {
        this.saveData.history.push({ message, date: new Date(), characterName });
    }

    private isConditionMet(conditional: ConditionalWithId, matchesId?: string) {
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
    DisplayOptions = "displayOptions",
}

export interface DialogEventMap {
    [DialogEventType.StartChapter]: Chapter
    [DialogEventType.StartScene]: Scene
    [DialogEventType.DisplayMessage]: Omit<Message, "text"> & { text: string }
    [DialogEventType.DisplayOptions]: Option[]
}

export type DialogEventCallback<Event extends DialogEventType> = (engine: Engine, data: DialogEventMap[Event]) => void;
