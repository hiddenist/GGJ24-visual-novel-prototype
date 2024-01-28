import { Place } from "../types"
import dormBackdrop from "../assets/backdrops/dorm_freepik-2151176401.jpg"

export const places = {
	dorm: {
		background: dormBackdrop,
		_attribution: "https://www.freepik.com/free-ai-image/anime-style-cozy-home-interior-with-furnishings_133783492.htm"
	},
	bus: {
		background: "bus"
	}
} as const satisfies Readonly<Record<string, Place>>

export type Settings = typeof places
