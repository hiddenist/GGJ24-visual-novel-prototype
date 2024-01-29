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
    script: (Dialog<CharacterId> | string)[]
}

export interface Place {
    background: string
    _attribution?: string
}

export interface Dialog<
    CharacterId extends string = string
> extends ConditionalWithId {
    choice?: Option[]
    nextDialogId?: string
    
    message: string
    
    isEnd?: true
    seen?: boolean
    character?: { characterId: CharacterId, imageKey: string | null }
}

export interface MessageDisplay {
    displayText: string
    speaker?: string
    foregroundImage?: string | null
    options?: OptionDisplay[]
}

export interface OptionDisplay extends Option {
    displayText: string
}


type ChapterId = Required<Chapter>["id"]
type SceneId = Required<Scene>["id"]
type DialogId = Required<Dialog>["id"]
type OptionId = Required<Option>["id"]
export type DialogPath = `${ChapterId}.${SceneId}.${DialogId}`
export type OptionPath = `${DialogPath}.${OptionId}`

export type Condition = 
    | { type: "seenMessage", message: DialogPath }
    | { type: "selectedOption", option: OptionPath }
    | { type: "notSelectedOption", option: OptionPath }
    | { type: "notSeenMessage", message: DialogPath }

export interface Option {
    id?: string
    message?: string
    value: string | boolean
    skipToDialogId?: string
}

export interface Character {
    name: string
    images: Record<string, string>
}

export interface SaveData {
    choices: Record<DialogPath, Option["value"]>
    selectedOptions: OptionPath[]
    seenMessages: DialogPath[]
    userProfile: UserProfile
    history: { message: string, date: Date, characterName?: string }[]
}

interface UserProfile {
    name: string
}
