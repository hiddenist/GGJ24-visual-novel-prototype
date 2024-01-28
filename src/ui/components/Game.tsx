import React from "react"
import "./Game.css"
import { DialogEventType } from "../../engine/Engine"
import { MessageDisplay, OptionDisplay } from "../../types"
import { useGameStore } from "../useGameStore"
import { FastForwardIcon } from "../icons/FastForwardIcon"

interface GameProps { }

export const Game: React.FC<GameProps> = () => {
  const { engine } = useGameStore()
  React.useEffect(() => {
    engine.start()
  }, [engine])
  return (
    <SceneBackground>
      <MessageBox />
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
  const { engine, configuration: { textSpeedWpm } } = useGameStore()
  const [message, setMessage] = React.useState<MessageDisplay>()
  const [isMessageFinished, setIsMessageFinished] = React.useState(false)
  const messageRef = React.useRef<MessageTextRef>(null)
  const [isEnd, setIsEnd] = React.useState(false)

  const [options, setOptions] = React.useState<OptionDisplay[]>()

  const isNextDisabled = (!isMessageFinished && options !== undefined) || isEnd


  React.useEffect(() => {
    engine.subscribe(DialogEventType.DisplayMessage, ({ message, dialog }) => {
      setMessage(message)
      setIsEnd(dialog.isEnd ?? false)
      setIsMessageFinished(false)
    })
  }, [engine])

  const handleNext = React.useCallback(() => {
    if (!isMessageFinished) {
      messageRef.current?.finish()
      return
    }
    !isNextDisabled && engine.next()
  }, [isMessageFinished, isNextDisabled, engine])

  React.useEffect(() => {
    const onContinueKeyPress = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        handleNext()
      }
    }
    window.addEventListener("keydown", onContinueKeyPress)
    return () => {
      window.removeEventListener("keydown", onContinueKeyPress)
    }
  }, [handleNext])

  if (!message) return null

  return (
    <>
      {isMessageFinished && message.options && (
        <Options
          options={message.options}
          onSelect={(option) => {
            engine.selectOption(option)
            setOptions(undefined)
          }}
        />
      )}
      <div className="message-box" asia-disabled={isNextDisabled.toString()} onClick={handleNext}>
        {message?.speaker && <div className="speaker">{message.speaker}</div>}

        <div>
          {message && (
            <MessageText
              ref={messageRef}
              text={message.displayText} textSpeed={Math.ceil(1000 / (textSpeedWpm / 60 * 5))}
              onFinish={() => {
                setIsMessageFinished(true)
              }}
            />
          )}
          &emsp;
          {!isNextDisabled && <FastForwardIcon className={isMessageFinished ? "" : "hide"} />}
        </div>
      </div>
    </>
  )
}

interface MessageTextRef {
  finish: () => void
}

const MessageText = React.forwardRef<
  MessageTextRef,
  { text: string, textSpeed?: number, onFinish?: () => void }
>(
  function MessageText(
    { text, textSpeed = 50, onFinish }, ref
  ) {
    const [textToDisplay, setTextToDisplay] = React.useState<string>("")
    const stableRef = React.useRef<{
      interval?: number,
      onFinish: typeof onFinish,
      position: number
    }>({
      position: 0,
      onFinish,
    })

    React.useImperativeHandle(ref, () => ({
      finish: () => {
        setTextToDisplay(text)
        stableRef.current.position = text.length
      }
    }), [text])

    React.useEffect(() => {
      clearInterval(stableRef.current.interval)
      const interval = setInterval(() => {
        setTextToDisplay(text.slice(0, stableRef.current.position))
        stableRef.current.position++
        if (stableRef.current.position > text.length) {
          clearInterval(stableRef.current.interval)
          stableRef.current.position = 0
          stableRef.current.onFinish?.()
        }
      }, textSpeed)
      stableRef.current.interval = interval
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
)

const Options: React.FC<{ options: OptionDisplay[], onSelect: (option: OptionDisplay) => void }> = ({ options, onSelect }) => {

  return (
    <ul className="options">
      {options.map((option, index) => (
        <li key={index}>
          <button
            // todo: UI/UX for selected option and navigating with keyboard
            onClick={() => { onSelect(option) }}>{option.displayText}</button>
        </li>
      ))}
    </ul>
  )
}