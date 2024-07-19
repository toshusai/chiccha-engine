import { Component } from "./Component";
import { GameRunner } from "../../core/GameRunner";
import { RecursivePlainObject } from "../../types/RecursivePlainObject";
import { Transform } from "./Transform";
import Matter from "matter-js";
import { ImageAsset } from "../assets/ImageAsset";
import { getConvexHull } from "../../libs/getConvexHull";

export class ImageRenderer extends Component {
  readonly type = "ImageRenderer" as const;
  id = "";
  imageAssetId = "";
  rotation = 0;
  flipX = false;
  flipY = false;
  enableCollision = false;

  private _box?: Matter.Body;

  start(): void {
    const img = this.getImage();
    const transform = this.getTransform();
    const { points } = getConvexHull(img!, 0.2);
    if (this.enableCollision) {
      this._box = Matter.Bodies.fromVertices(
        transform?.position.x || 0,
        transform?.position.y || 0,
        [points],
        { isSensor: true }
      );

      this._box.plugin.imageRenderer = this;
      this._box.plugin.gameObject = this.getGameObject();
      Matter.Composite.add(GameRunner.instance.engine.world, this._box);
    }
  }

  update() {
    const transform = this.getTransform();
    if (!transform) return;
    if (this._box) {
      Matter.Body.setPosition(this._box, {
        x: transform.position.x,
        y: transform.position.y,
      });
    }
  }

  getImage() {
    const asset = GameRunner.instance.assetManager.getAssetById(
      this.imageAssetId
    ) as ImageAsset | undefined;

    return asset?._image;
  }

  getTransform() {
    return this.getGameObject()?.getComponent(Transform);
  }

  render(ctx: CanvasRenderingContext2D) {
    const img = this.getImage();
    if (img) {
      const transform = this.getGameObject()?.getComponent(Transform);
      if (!transform) return;
      const position = transform.position;
      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2 + 64, -img.height / 2 + 64);
      ctx.restore();
    }
  }

  destroy(): void {
    if (this._box) {
      Matter.Composite.remove(GameRunner.instance.engine.world, this._box);
    }
  }

  toJSON(): RecursivePlainObject<ImageRenderer> {
    return {
      id: this.id,
      type: this.type,
      imageAssetId: this.imageAssetId,
      flipX: this.flipX,
      flipY: this.flipY,
      rotation: this.rotation,
      enableCollision: this.enableCollision,
    };
  }

  public static fromJSON(json: RecursivePlainObject<ImageRenderer>) {
    const self = new ImageRenderer();
    self.id = json.id;
    self.imageAssetId = json.imageAssetId;
    self.flipX = json.flipX;
    self.flipY = json.flipY;
    self.rotation = json.rotation;
    self.enableCollision = json.enableCollision;
    return self;
  }
}
