import { StartScreen } from './components/StartScreen'
import { Game } from './components/Game'
import { useGameStore } from './useGameStore'

function App() {
  const { isPlayerNameSet, setPlayerName } = useGameStore()

  if (!isPlayerNameSet) {
    return (
      <StartScreen
        setPlayerName={(name) => {
          setPlayerName(name)
        }}
      />
    )
  }

  return <Game />

}

export default App
