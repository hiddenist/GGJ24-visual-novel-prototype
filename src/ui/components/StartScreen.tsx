import React from "react"
import { t } from "../lang"
import { assets } from "../../assets/assets"

interface StartScreenProps {
  setPlayerName: (name: string) => void
}

export const StartScreen: React.FC<StartScreenProps> = ({ setPlayerName }) => {
  const [name, setName] = React.useState<string>()
  const [showButton, setShowButton] = React.useState(false)
  const onSubmit = () => {
    name && setPlayerName(name)
  }

  React.useEffect(() => {
    let timeout: number
    if (name) {
      timeout = setTimeout(() => {
        setShowButton(true)
      }, 500)
    } else {
      setShowButton(false)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [name])
  return (
    <div className="start-screen">
      <form onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}>
        <h1>{t("What's your name?")}</h1>
        <input
          type="text"
          autoComplete="false"
          autoFocus={true}
          onChange={(e) => {
            setName(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setShowButton(true)
            }
          }}
          onBlur={() => setShowButton(true)}
        />
        <button
          disabled={!showButton}
          onClick={onSubmit}
        >
          {t("Start (button)")}
        </button>
      </form>
      <Credits />
    </div>
  )
}

const Credits: React.FC<unknown> = () => {
  const [isShowing, setIsShowing] = React.useState(false)

  const creditsContent = (
    <div className="credits">
      <h2>Credits</h2>
      <ul>
        <li>Developed by <a href="https://github.com/hiddenist">Devin Elrose</a></li>
        {creditsListItems}
        <li>Special thanks to Jay Sharma and Michael Earl</li>
      </ul>
      <button className="hide-credits toggle-credits" onClick={() => setIsShowing(false)}>Hide Credits</button>
    </div>
  )

  return (
    <>
      <button className="show-credits toggle-credits" onClick={() => setIsShowing(true)}>Show Credits</button>
      {isShowing && creditsContent}
    </>
  )
}

const creditsListItems = [...Object.values(assets.audio), ...Object.values(assets.images)].map(asset => {
  return (
    <li key={asset.src}>
      {asset.credit} <a href={asset.url}>{asset.linkText}</a>
    </li>
  )
})
