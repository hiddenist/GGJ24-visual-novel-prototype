import { Setting } from "../types"

export const settings = {
	dorm: {
		background: "dorm"
	},
	bus: {
		background: "bus"
	}
} as const satisfies Readonly<Record<string, Setting>>

export type Settings = typeof settings
