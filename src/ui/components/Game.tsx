import React from "react"
import "./Game.css"
import { DialogEventType, Engine } from "../../engine/Engine"
import { MessageDisplay, Option } from "../../types"

interface GameProps {
  engine: Engine
}

export const Game: React.FC<GameProps> = ({ engine }) => {
  React.useEffect(() => {
    engine.subscribe(DialogEventType.StartChapter, () => {
      console.log(engine)
    })
    engine.subscribe(DialogEventType.StartScene, () => {
      console.log(engine)
    })
    engine.start()
  }, [engine])
  return (
    <SceneBackground engine={engine}>
      <MessageBox engine={engine} />
      <Options engine={engine} />
    </SceneBackground>
  )
}

const SceneBackground: React.FC<React.PropsWithChildren<{ engine: Engine }>> = ({ engine, children }) => {
  const [background, setBackground] = React.useState<string>()

  React.useEffect(() => {
    engine.subscribe(DialogEventType.StartScene, ({ place }) => {
      setBackground(place.background)
    })
  }, [engine])

  return (
    <div className="scene-background" style={{ backgroundImage: `url(${background})` }}>
      (background: {background})
      {children}
    </div>
  )
}

const MessageBox: React.FC<{ engine: Engine }> = ({ engine  }) => {
  const [message, setMessage] = React.useState<MessageDisplay>()

  React.useEffect(() => {
    engine.subscribe(DialogEventType.DisplayMessage, (message) => {
      setMessage(message)
    })
  }, [engine])

  return (
    <div className="message-box" onClick={() => {
      // todo: we shouldn't show this when there are options
      engine.next()
    }}>
      <div className="speaker">{message?.speaker}</div>
      <div className="message">{message?.text}</div>
    </div>
  )
}

const Options: React.FC<{ engine: Engine }> = ({ engine  }) => {
  const [options, setOptions] = React.useState<Option[]>([])

  React.useEffect(() => {
    engine.subscribe(DialogEventType.DisplayOptions, (options) => {
      setOptions(options)
    })
  }, [engine])

  return (
    <ul className="options">
      {options && options.map((option, index) => (
        <li key={index}>
          <button onClick={() => {
            engine.selectOption(option)
            setOptions([])
          }}>{option.text}</button>
        </li>
      ))}
    </ul>
  )
}