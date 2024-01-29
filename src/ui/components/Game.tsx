import React from "react"
import "./Game.css"
import { DialogEventCallback, DialogEventType } from "../../engine/Engine"
import { MessageDisplay, OptionDisplay } from "../../types"
import { useGameStore } from "../useGameStore"
import { FastForwardIcon } from "../icons/FastForwardIcon"
import { preloadAssets } from "../../assets/preloadAssets"

import music from "../../assets/music/Leash_room_loop.mp3"
import { VolumeOffIcon } from "../icons/VolumeOffIcon"
import { VolumeOnIcon } from "../icons/VolumeOnIcon"

interface GameProps { }

export const Game: React.FC<GameProps> = () => {
  const { engine } = useGameStore()
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    const loadChapter: DialogEventCallback<DialogEventType.StartChapter> = ({ assets }) => {
      setIsLoaded(false)
      Promise.all(
        [
          preloadAssets([ ...assets, { type: "audio", src: music }]),
          // new Promise(resolve => setTimeout(resolve, 2000)),
        ]
      ).then(() => {
        setIsLoaded(true)
      })
    }
    engine.subscribe(DialogEventType.StartChapter, loadChapter)
    engine.startChapter()
    return () => {
      engine.unsubscribe(DialogEventType.StartChapter, loadChapter)
    }
  }, [engine])

  if (!isLoaded) return <Loading />

  return (
    <SceneBackground>
      <MessageBox />
      <MusicControls />
    </SceneBackground>
  )
}

const Loading: React.FC<unknown> = () => {
  return (
    <div className="loading">
      <div className="loading-text">Loading...</div>
    </div>
  )
}

const MusicControls: React.FC<unknown> = () => {
  const { configuration: { isMusicEnabled }, isDialogChoiceOpen } = useGameStore()
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = React.useState(isMusicEnabled)

  const toggleMusicEnabled = React.useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false)
      audioRef.current?.pause()
    } else {
      setIsPlaying(true)
      audioRef.current?.play()
    }
  }, [isPlaying])

  return (
    <>
      <audio src={music} loop={true} autoPlay={isMusicEnabled} ref={audioRef} />
      <button className="music-controls" onClick={toggleMusicEnabled} aria-label={isPlaying ? "disable music" : "enable music"} tabIndex={isDialogChoiceOpen ? -1 : 0}>
        {isPlaying ? <VolumeOnIcon /> : <VolumeOffIcon />}
      </button>
    </>
  )
}

const SceneBackground: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { engine } = useGameStore()
  const [background, setBackground] = React.useState<string>()

  React.useLayoutEffect(() => {
    const loadScene: DialogEventCallback<DialogEventType.StartScene> = ({ place }) => {
      setBackground(place.background)
    }
    engine.subscribe(DialogEventType.StartScene, loadScene);
    engine.startScene();
    return () => {
      engine.unsubscribe(DialogEventType.StartScene, loadScene);
    }
  }, [engine])

  return (
    <div className="scene" key={background} style={{ backgroundImage: `url(${background})` }}>
      {children}
    </div>
  )
}

const MessageBox: React.FC<unknown> = () => {
  const { engine, configuration: { textSpeedWpm }, setIsDialogChoiceOpen } = useGameStore()
  const [message, setMessage] = React.useState<MessageDisplay>()
  const [isMessageFinished, setIsMessageFinished] = React.useState(false)
  const messageRef = React.useRef<MessageTextRef>(null)
  const messageBoxRef = React.useRef<HTMLDivElement>(null)
  const [isEnd, setIsEnd] = React.useState(false)

  const [options, setOptions] = React.useState<OptionDisplay[]>()

  const isNextDisabled = !isMessageFinished || options !== undefined || isEnd


  React.useEffect(() => {
    const loadMessage: DialogEventCallback<DialogEventType.DisplayMessage> = ({ message, dialog }) => {
      setMessage(message)
      setIsEnd(dialog.isEnd ?? false)
      setIsMessageFinished(false)
      setOptions(message.options)
    }
    engine.subscribe(DialogEventType.DisplayMessage, loadMessage)
    engine.startDialog()
    return () => {
      engine.unsubscribe(DialogEventType.DisplayMessage, loadMessage)
    }
  }, [engine])

  const handleNext = React.useCallback(() => {
    if (!isMessageFinished) {
      messageRef.current?.finish()
      return
    }
    if (isEnd) {
      window.location.reload()
    }
    !isNextDisabled && engine.next()
  }, [isMessageFinished, isNextDisabled, engine, isEnd])

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

  

  const isDialogChoiceOpen = isMessageFinished && message?.options
  React.useEffect(() => {
    setIsDialogChoiceOpen(Boolean(isDialogChoiceOpen))
  }, [setIsDialogChoiceOpen, isDialogChoiceOpen])

  if (!message) return null

  return (
    <>
      {isDialogChoiceOpen && message.options && (
        <Options
          options={message.options}
          onSelect={(option) => {
            engine.selectOption(option)
            setOptions(undefined)
          }}
        />
      )}
      <div tabIndex={isDialogChoiceOpen ? -1 : 0} className="message-box" asia-disabled={isNextDisabled.toString()} onClick={handleNext} ref={messageBoxRef}>
        {message?.speaker && <div className="speaker">{message.speaker}</div>}

        <div>
          {message && (
            <MessageText
              ref={messageRef}
              text={message.displayText} textSpeed={Math.ceil(1000 / (textSpeedWpm / 60 * 5))}
              onFinish={() => {
                setIsMessageFinished(true)
                if (!options) {
                  messageBoxRef.current?.focus()
                }
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
      interval?: NodeJS.Timeout,
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
  const optionsRef = React.useRef<HTMLUListElement>(null)
  const focusedIndexRef = React.useRef<number>(0)

  React.useEffect(() => {
    optionsRef.current?.getElementsByTagName("button")[0]?.focus()
    focusedIndexRef.current = 0
  }, [options])

  React.useEffect(() => {
    const setFocus = (adjustBy: number) => { 
      focusedIndexRef.current = (focusedIndexRef.current + adjustBy) % options.length
      optionsRef.current?.getElementsByTagName("button")[focusedIndexRef.current]?.focus()
    }
    const onKeyPress = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight"].includes(e.key)) {
        e.preventDefault()
        setFocus(1)
      } else if (["ArrowUp", "ArrowLeft"].includes(e.key)) {
        e.preventDefault()
        setFocus(-1)
      } else if (e.key === "Tab") {
        e.preventDefault()
        setFocus(e.shiftKey ? -1 : 1)
      }
    }
    window.addEventListener("keydown", onKeyPress)
    return () => {
      window.removeEventListener("keydown", onKeyPress)
    }
  }, [options.length])

  return (
    <ul className="options" ref={optionsRef}>
      {options.map((option, index) => (
        <li key={index}>
          <button
            tabIndex={index + 1}
            // todo: UI/UX for selected option and navigating with keyboard
            onClick={() => { onSelect(option) }}>{option.displayText}</button>
        </li>
      ))}
    </ul>
  )
}