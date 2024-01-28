import { Chapter } from "../../types"
import type { Settings } from "../places"
import type { Characters } from "../characters"

export const prologue: Chapter<keyof Settings, keyof Characters> = {
	id: "prologue",
  title: "Prologue",
	scenes: [
		{
      id: "intro",
			placeId: "dorm",
      dialog: [
        {
          messages: [
            {
              text:  "Hi ${data.userProfile.name}! Welcome to the game!",
              character: { characterId: "narrator", imageKey: null }
            },
            { text: "This is the first message of the game!" }
          ]
        },
        {
          messages: [
            { text: "This is the second message of the game!" }
          ]
        },
        {
          id: "fav-color",
          messages: [
            { text: "You will have to make choices." },
            { text: "What's your favorite color?" }
          ],
          options: [
            { id: "red", text: "Red" },
            { id: "blue", text: "Blue" },
            { id: "green", text: "Green" },
            { id: "yellow", text: "Yellow" },
            { id: "purple", text: "Purple" }
          ]
        },
        {
          messages: [
            { text: "That's cool. I also like ${data.choices['prologue.intro.fav-color']}" },
            { text: "But I like blue more.", condition: { type: "notSelectedOption", option: "prologue.intro.fav-color.blue" } },
            { text: "Anyway, let's continue." },
            { text: "You will have to make more choices." },
            { text: "What's 1 + 1?" }
          ],
          options: [
            { text: "2", nextDialogId: "2" },
            { text: "10"},
            { text: "11" },
          ]
        },
        {
          messages: [
            { text: "No need to be so clever." },
            { text: "I know you know what I'm looking for." },
            { text: "What's 1 + 1?" }
          ],
          options: [
            { text: "Fine. 2." },
          ],
        },
        {
          id: "2",
          messages: [
            { text: "That's correct!" },
          ],
        },
        {
          messages: [
            { text: "ok bye." },
          ],
        }
      ]
		}
	]
}
