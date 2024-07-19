import { ImageAsset } from "../models/assets/ImageAsset";
import { ScriptAsset } from "../models/assets/ScriptAsset";
import { Asset } from "../models/assets/Asset";

export function serializeAsset(asset: Asset) {
  if (asset.type === "ImageAsset") {
    return ImageAsset.fromJSON(asset as ImageAsset);
  } else if (asset.type === "ScriptAsset") {
    return ScriptAsset.fromJSON(asset as ScriptAsset);
  }
  throw new Error(`Unknown asset type: ${asset.type}`);
}
