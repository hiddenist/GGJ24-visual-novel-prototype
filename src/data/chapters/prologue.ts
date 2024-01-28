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
              // todo: this no worky:
              text:  "Hi {profile.name}! Welcome to the game!",
              // todo: this no worky either:
              character: { characterId: "narrator", imageKey: null } // Should I just have the character specified any time it changes? That might get weird with conditional messages.
            },
          ]
        },
        {
          id: "fav-color",
          messages: [
            { text: "This is a game where you'll get to make some choices. Let's practice!" },
            {
              text: "What's your favorite color?",
              // todo: undo some dumb:
              // options: [
              //   { id: "red", text: "Red" },
              //   { id: "blue", text: "Blue" },
              //   { id: "green", text: "Green" },
              //   { id: "yellow", text: "Yellow" },
              //   { id: "purple", text: "Purple" }
              // ]
            }
          ],
          options: [
            { id: "red", text: "Red" },
            { id: "blue", text: "Blue" },
            { id: "green", text: "Green" },
            { id: "yellow", text: "Yellow" },
            { id: "purple", text: "Purple" },
            // { id: "idk", text: "I don't know", skipToMessageId: "idk" },
          ]
        },
        {
          messages: [
            { text: "That's cool. I also like {choice.prologue.intro.fav-color}" },
            { text: "But I like purple more.", condition: { type: "notSelectedOption", option: "prologue.intro.fav-color.purple" } },
            { text: "In fact, that's my favorite color!", condition: { type: "selectedOption", option: "prologue.intro.fav-color.purple" } },
            { text: "Anyway, let's continue." },
            // { id: "idk", text: "I guess that one isn't easy for everybody. I'll ask you something else.", condition: { type: "selectedOption", option: "prologue.intro.fav-color.idk" } },
            { text: "This next one should be really easy." },
            { text: "What's 1 + 1?" }
          ],
          options: [
            { text: "2", skipToDialogId: "2" },
            { text: "10"},
            { text: "11" },
          ]
        },
        {
          messages: [
            { text: "No need to be so clever." },
            { text: "I know you know what answer I'm looking for." },
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
            { text: "Thank for stopping by." },
          ],
        }
      ]
		}
	]
}
