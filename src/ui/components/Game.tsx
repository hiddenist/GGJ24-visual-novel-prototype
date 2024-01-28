import React from "react"
import "./Game.css"
import { DialogEventType } from "../../engine/Engine"
import { MessageDisplay, Option } from "../../types"
import { useGameStore } from "../useGameStore"
import { FastForwardIcon } from "../icons/FastForwardIcon"

interface GameProps {}

export const Game: React.FC<GameProps> = () => {
  const { engine } = useGameStore()
  React.useEffect(() => {
    engine.start()
  }, [engine])
  return (
    <SceneBackground>
      <MessageBox />
      <Options />
    </SceneBackground>
  )
}

const SceneBackground: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { engine } = useGameStore()
  const [background, setBackground] = React.useState<string>()

  React.useEffect(() => {
    engine.subscribe(DialogEventType.StartScene, ({ place }) => {
      setBackground(place.background)
    })
  }, [engine])

  return (
    <div className="scene" style={{ backgroundImage: `url(${background})` }}>
      {children}
    </div>
  )
}

const MessageBox: React.FC<unknown> = () => {
  const { engine, isWaitingForInput, configuration: { textSpeedWpm } } = useGameStore()
  const [message, setMessage] = React.useState<MessageDisplay>()
  const [isMessageFinished, setIsMessageFinished] = React.useState(false)

  React.useEffect(() => {
    engine.subscribe(DialogEventType.DisplayMessage, (message) => {
      setMessage(message)
      setIsMessageFinished(false)
    })
  }, [engine])

  const isNextDisabled = isWaitingForInput || !isMessageFinished

  if (!message) return null

  return (
    <div className="message-box" asia-disabled={isNextDisabled.toString()} onClick={() => {
      !isNextDisabled && engine.next()
    }}>
      {message?.speaker && <div className="speaker">{message.speaker}</div>}

      <div>
        {message && <MessageText text={message.text} textSpeed={Math.ceil(1000 / (textSpeedWpm/60 * 5))} onFinish={() => setIsMessageFinished(true)} />}
        &emsp;
        {!isNextDisabled && <FastForwardIcon />}
      </div>
    </div>
  )
}

const MessageText: React.FC<{ text: string, textSpeed?: number, onFinish?: () => void }> = ({ text, textSpeed = 50, onFinish }) => {
  const [textToDisplay, setTextToDisplay] = React.useState<string>("")
  const ref = React.useRef<{
    interval?: number,
    onFinish: typeof onFinish,
    position: number
  }>({
    position: 0,
    onFinish,
  })

  React.useEffect(() => {
    clearInterval(ref.current.interval)
    const interval = setInterval(() => {
      setTextToDisplay(text.slice(0, ref.current.position))
      ref.current.position++
      if (ref.current.position > text.length) {
        clearInterval(ref.current.interval)
        ref.current.position = 0
        ref.current.onFinish?.()
      }
    }, textSpeed)
    ref.current.interval = interval
    return () => {
      clearInterval(interval)
    }
  }, [text, textSpeed])

  return (
    <span className="text">
      {textToDisplay}
    </span>
  )
}

const Options: React.FC<unknown> = () => {
  const { engine, setIsWaitingForInput } = useGameStore()
  const [options, setOptions] = React.useState<Option[]>([])

  React.useEffect(() => {
    engine.subscribe(DialogEventType.DisplayOptions, (options) => {
      setOptions(options)
      setIsWaitingForInput(true)
    })
  }, [engine, setIsWaitingForInput])

  return (
    <ul className="options">
      {options && options.map((option, index) => (
        <li key={index}>
          <button onClick={() => {
            engine.selectOption(option)
            setIsWaitingForInput(false)
            setOptions([])
          }}>{option.text}</button>
        </li>
      ))}
    </ul>
  )
}