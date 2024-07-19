import { RecursivePlainObject } from "../../types/RecursivePlainObject";

export const IMAGE_ASSET_TYPE = "ImageAsset" as const;

export class ImageAsset {
  readonly type = IMAGE_ASSET_TYPE;
  id = "";
  src = "";

  _image: HTMLImageElement | null = null;

  async load() {
    this._image = new Image();
    this._image.src = this.src;
    await new Promise<void>((resolve, reject) => {
      this._image!.onload = () => {
        resolve();
      };
      this._image!.onerror = () => {
        reject(new Error(`Failed to load image: ${this.src}`));
      };
    });
  }

  toJSON(): RecursivePlainObject<ImageAsset> {
    return {
      id: this.id,
      src: this.src,
      type: this.type,
    };
  }

  public static fromJSON(json: RecursivePlainObject<ImageAsset>): ImageAsset {
    const self = new ImageAsset();
    self.id = json.id;
    self.src = json.src;
    return self;
  }
}
