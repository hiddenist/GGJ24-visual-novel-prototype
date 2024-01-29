
import dormBackdrop from "./backdrops/dorm_freepik-2151176401.jpg"

import leashRoomLoop from "./music/Leash_room_loop.mp3"

export const assets = {
    images: {
        dormBackdrop: {
            src: dormBackdrop,
            url: "https://www.freepik.com/free-ai-image/anime-style-cozy-home-interior-with-furnishings_133783492.htm",
            credit: "AI-generated background Image from",
            linkText: "Freepik.com",
        },
    },
    audio: {
        leashRoomLoop: {
            src: leashRoomLoop,
            credit: "Music Credit: Leash Room Loop by",
            linkText: "Michael Jones",
            url: "https://www.mikejonesaudio.com"
        }
    }
} as const
