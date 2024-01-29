import { Chapter } from "../../types"
import type { Settings } from "../places"
import type { Characters } from "../characters"

// look into twine

export const sample: Chapter<keyof Settings, keyof Characters> = {
  id: "prologue",
  title: "Sample Script",
  scenes: [
    {
      id: "intro",
      placeId: "dorm",
      script: [
        "Hi {profile.name}!",
        {
          message: "Have you ever played a visual novel before?",
          id: "played-vn",
          choice: [
            { id: "yes", value: true, message: "Yes!" },
            { id: "no", value: false, message: "Nope. What's that?", skipToDialogId: "new-to-vn" },
          ]
        },
        "Awesome, looks like I won't have to hold your hand too much through this. I mean... unless...",
        "Well, um, while we're here let's get to know eachother! I have a question.",
        {
          id: "new-to-vn",
          message: "It's a game where you play through a story, making choices that influence the plot.",
          condition: { type: "selectedOption", option: "prologue.intro.played-vn.no" }
        },
        {
          message: "It's a little like those old choose-your-own adventure books. Let's practice making some choices now!",
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
            { id: "other", message: "What?? My color isn't listed!", value: "other", skipToDialogId: "wheres-my-color"},
          ]
        },
        "That's cool. I also like {choice.prologue.intro.fav-color}!",
        { message: "But I like purple more.", condition: { type: "notSelectedOption", option: "prologue.intro.fav-color.purple" } },
        { message: "In fact, that's my favorite color!", condition: { type: "selectedOption", option: "prologue.intro.fav-color.purple" } },
        { id: "wheres-my-color", message: "Look, we can't have everything sometimes. It's a limitation of the format.", condition: { type: "selectedOption", option: "prologue.intro.fav-color.other" } },
        "Anyways, let's continue.",
        { id: "idk", message: "I guess that one isn't easy for everybody. I'll ask you something else.", condition: { type: "selectedOption", option: "prologue.intro.fav-color.idk" } },
        "This next one should be really easy.",
        {
          id: "simple-math",
          message: "What's 1 + 1?",
          choice: [
            { value: "2", skipToDialogId: "2" },
            { value: "10", id: "binary" },
            { value: "11" },
          ]
        },
        { 
          message: 
          "01000101 01111000 01100011 01110101 01110011 01100101 00100000 01101101 01100101 00101100 00100000 01100001 01110010 01100101 00100000 01111001 01101111 01110101 00100000 01100001 00100000 01110010 01101111 01100010 01101111 01110100 00111111",
          condition: { type: "selectedOption", option: "prologue.intro.simple-math.binary" }
        },
        "Look, there's no need to be so clever.",
        "I know you know what answer I'm looking for.",
        {
          message: "What's 1 + 1?",
          choice: [
            { value: "Fine. 2." },
          ],
        },
        { id: "2", message: "That's correct!" },
        {
          message: "Thanks for stopping by. That's all that's here for now.",
          isEnd: true,
          choice: [
            { value: "Bye!" },
          ]
        },
      ]
    }
  ]
}
