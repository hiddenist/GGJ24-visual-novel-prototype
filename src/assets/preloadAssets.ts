import { Asset } from "../engine/Engine"

export const preloadAssets = (assets: Asset[]) => {
  return Promise.all(assets.map((asset) => {
    switch (asset.type) {
      case "image":
        return loadImage(asset.src)
      case "audio":
        return loadAudio(asset.src)
      default:
        console.warn(`Unknown asset type: ${asset.type}`)
        return Promise.resolve()
    }
  }))
}

const loadImage = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve()
    }
    image.onerror = () => {
      reject()
    }
    image.src = src
  })
}

const loadAudio = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    const audio = new Audio()
    audio.onloadeddata = () => {
      resolve()
    }
    audio.onerror = () => {
      reject()
    }
    audio.src = src
  })
}