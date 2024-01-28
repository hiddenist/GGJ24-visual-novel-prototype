import React from "react"
import { t } from "../lang"

interface StartScreenProps {
  setPlayerName: (name: string) => void
}

export const StartScreen: React.FC<StartScreenProps> = ({ setPlayerName }) => {
  const [name, setName] = React.useState<string>()
  const onSubmit = () => {
    name && setPlayerName(name)
  }
  return (
    <form className="start-screen" onSubmit={(e) => {
      e.preventDefault()
      onSubmit()
    }}>
      <h1>{t("What's your name?")}</h1>
      <input
        type="text"
        onChange={(e) => {
          setName(e.target.value)
        }}
      />
      <button
        disabled={!name}
        onClick={onSubmit}
      >
        {t("Start (button)")}
      </button>
    </form>
  )
}