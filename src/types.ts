export interface Chapter<
    PlaceId extends string = string,
    CharacterId extends string = string,
> {
    id: string
    title: string
    scenes: Scene<PlaceId, CharacterId>[]
}

export interface ConditionalWithId {
    id?: string
    condition?: Condition
}

export interface Scene<
    PlaceId extends string = string,
    CharacterId extends string = string,
> extends ConditionalWithId {
    placeId: PlaceId
    dialog: Dialog<CharacterId>[]
}

export interface Place {
    background: string
    _attribution?: string
}

export interface Dialog<
    CharacterId extends string = string,
> extends ConditionalWithId {
    messages: Message<CharacterId>[]
    options?: Option[]
    nextDialogId?: string
    isEnd?: true
}

export interface Message<
    CharacterId extends string = string,
> extends ConditionalWithId  {
    text: string
    seen?: boolean
    character?: { characterId: CharacterId, imageKey: string | null }
}

export interface MessageDisplay {
    text: string
    speaker?: string
    foregroundImage?: string
}

export type DialogPath = `${Required<Chapter>["id"]}.${Required<Scene>["id"]}.${Required<Dialog>["id"]}`
export type MessagePath = `${DialogPath}.${Required<Message>["id"]}`
export type OptionPath = `${DialogPath}.${Required<Option>["id"]}`

export type Condition = 
    | { type: "seenMessage", message: MessagePath }
    | { type: "selectedOption", option: OptionPath }
    | { type: "notSelectedOption", option: OptionPath }
    | { type: "notSeenMessage", message: MessagePath }

export interface Option {
    id?: string
    text: string
    skipToDialogId?: string
}

export interface Character {
    name: string
    images: Record<string, string>
}

export interface SaveData {
    choices: Record<DialogPath, Option["text"]>
    selectedOptions: OptionPath[]
    seenMessages: MessagePath[]
    userProfile: UserProfile
    history: { message: string, date: Date, characterName?: string }[]
}

interface UserProfile {
    name: string
}
