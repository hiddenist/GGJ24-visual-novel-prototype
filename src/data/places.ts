import { Place } from "../types"

export const places = {
	dorm: {
		background: "dorm"
	},
	bus: {
		background: "bus"
	}
} as const satisfies Readonly<Record<string, Place>>

export type Settings = typeof places
