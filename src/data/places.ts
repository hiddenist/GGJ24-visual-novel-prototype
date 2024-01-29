import { Place } from "../types"
import dormBackdrop from "../assets/backdrops/dorm_freepik-2151176401.jpg"
import busStopBackdrop from "../assets/backdrops/bus-stop-13375351.jpg"

export const places = {
	dorm: {
		background: dormBackdrop,
		_attribution: "https://www.freepik.com/free-ai-image/anime-style-cozy-home-interior-with-furnishings_133783492.htm"
	},
	busStop: {
		background: busStopBackdrop,
		_attribution: "https://www.freepik.com/free-ai-image/dark-style-sky-nighttime_133757351.htm"
	},
	bus: {
		background: "bus"
	}
} as const satisfies Readonly<Record<string, Place>>

export type Settings = typeof places


// resort inspiration https://www.freepik.com/premium-ai-image/mountain-valley-home-terrace-winter-generative-ai_50465790.htm
// friend's desk? https://www.freepik.com/free-ai-image/beautiful-office-space-cartoon-style_94942422.htm
// twilight bus stop: https://www.freepik.com/premium-ai-image/bus-stop-with-yellow-roof-sign-that-says-bus-stop_63062636.htm
// inside of bus https://www.freepik.com/free-ai-image/lifestyle-scene-with-people-doing-regular-tasks-anime-style_94952587.htm
