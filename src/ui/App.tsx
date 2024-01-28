import React from 'react'
import { Engine } from '../engine/Engine'
import { prologue } from '../data/chapters/prologue'
import { places } from '../data/places'
import { characters } from '../data/characters'
import { StartScreen } from './components/StartScreen'
import { Game } from './components/Game'

function App() {
  const [engine] = React.useState(() => new Engine([ prologue ], places, characters))
  const [playerName, setPlayerName] = React.useState<string>("")

  if (!playerName) {
    return (
      <StartScreen
        setPlayerName={(name) => {
          setPlayerName(name)
          engine.setPlayerName(name)
        }}
      />
    )
  }

  return <Game engine={engine} />

}

export default App
