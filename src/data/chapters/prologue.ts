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
        { message: "Hi {profile.name}!", },
        {
          message: "Have you ever played a visual novel before?",
          id: "played-vn",
          choice: [
            { id: "yes", value: true, message: "Yes!" },
            { id: "no", value: false, message: "Nope. What's that?", skipToDialogId: "new-to-vn" },
          ]
        },
        { message: "Awesome, looks like I won't have to hold your hand too much through this. I mean... unless..." },
        { message: "Well, while we're here getting to know eachother, I have a question." },
        {
            id: "new-to-vn",
            message: "It's a game where you play through a story, and you get to make some choices to influence it. Let's practice!",
            condition: { type: "selectedOption", option: "prologue.intro.played-vn.no" }
          },
        {

          id: "fav-color",
          message: "What's your favorite color?",
          choice: [
            { id: "red", value: "red" },
            { id: "blue", value: "blue" },
            { id: "green", value: "green" },
            { id: "yellow", value: "yellow" },
            { id: "purple", value: "purple" },
            { id: "idk", message: "Uhh... I don't know.", value: "idk", skipToDialogId: "idk" },
          ]
        },
        { message: "That's cool. I also like {choice.prologue.intro.fav-color}!" },
        { message: "But I like purple more.", condition: { type: "notSelectedOption", option: "prologue.intro.fav-color.purple" } },
        { message: "In fact, that's my favorite color!", condition: { type: "selectedOption", option: "prologue.intro.fav-color.purple" } },
        { message: "Anyway, let's continue." },
        { id: "idk", message: "I guess that one isn't easy for everybody. I'll ask you something else.", condition: { type: "selectedOption", option: "prologue.intro.fav-color.idk" } },
        { message: "This next one should be really easy." },
        {
          message: "What's 1 + 1?", choice: [
            { value: "2", skipToDialogId: "2" },
            { value: "10" },
            { value: "11" },
          ]
        },
        { message: "No need to be so clever." },
        { message: "I know you know what answer I'm looking for." },
        {
          message: "What's 1 + 1?",
          choice: [
            { value: "Fine. 2." },
          ],
        },
        { id: "2", message: "That's correct!" },
        { message: "Thanks for stopping by. That's all that's here for now.", isEnd: true },
      ]
    }
  ]
}
