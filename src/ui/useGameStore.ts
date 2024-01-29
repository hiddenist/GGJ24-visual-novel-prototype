import { create } from "zustand"
import { Engine } from "../engine/Engine"
import { sample } from "../data/chapters/sample-script"
import { places } from "../data/places"
import { characters } from "../data/characters"


export interface GameStore {
  engine: Engine
  isPlayerNameSet: boolean
  setPlayerName: (name: string) => void

  configuration: {
    // isMusicEnabled: boolean
    // isSoundEnabled: boolean
    // isAutoPlayEnabled: boolean
    textSpeedWpm: number
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  engine: new Engine([ sample ], places, characters),
  configuration: {
    textSpeedWpm: 300,
  },
  setPlayerName: (name: string) => {
    if (name.trim().length === 0) return
    get().engine.setPlayerName(name)
    set({ isPlayerNameSet: true })
  },
  isPlayerNameSet: false,
}))
