import { Asset } from "../engine/Engine";
import { Chapter, Place } from "../types";

export const getChapterAssets = (chapter: Chapter, places: Record<string, Place>): Asset[] => {
  const assets: Asset[] = [];
  chapter.scenes.forEach(scene => {
    const place = places[scene.placeId]
    if (place?.background) {
      assets.push({ type: "image", src: place.background });
    }
  });
  return assets;
}