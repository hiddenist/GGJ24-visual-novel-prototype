import { Character } from "../types";

export const characters = {
    narrator: {
        name: "Narrator",
        images: {},
    },
} as const satisfies Readonly<Record<string, Character>>

export type Characters = typeof characters
