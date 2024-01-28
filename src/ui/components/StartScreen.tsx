import React from "react"
import { t } from "../lang"

interface StartScreenProps {
  setPlayerName: (name: string) => void
}

export const StartScreen: React.FC<StartScreenProps> = ({ setPlayerName }) => {
  const [name, setName] = React.useState<string>()
  return (
    <div className="start-screen">
      <h1>{t("What's your name?")}</h1>
      <input type="text" onChange={(e) => {
        setName(e.target.value)
      }} />
      <button
        disabled={!name}
        onClick={() => {
          name && setPlayerName(name)
        }}
      >
        {t("Start (button)")}
      </button>
    </div>
  )
}