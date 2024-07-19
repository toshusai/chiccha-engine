import { Asset } from "../models/assets/Asset";
import { serializeAsset } from "../libs/serializeAsset";

export class AssetManager {
  assets: Asset[] = [];

  constructor(assets: Asset[]) {
    this.assets = assets.map(serializeAsset);
  }

  getAssetById(id: string) {
    return this.assets.find((asset) => asset.id === id);
  }

  async load() {
    await Promise.all(this.assets.map((asset) => asset.load()));
  }
}
