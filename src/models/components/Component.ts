import { RecursivePlainObject } from "../../types";
import { GameObject } from "../GameObject";

export class Component {
  id: string = "";
  type: string = "";
  _gameObject!: GameObject;

  getGameObject() {
    return this._gameObject;
  }

  setGameObject(gameObject: GameObject) {
    this._gameObject = gameObject;
  }

  start() {}
  update() {}
  render(_ctx: CanvasRenderingContext2D) {}
  destroy() {}

  toJSON(): RecursivePlainObject<Component> {
    throw new Error("Not implemented");
  }

  public static fromJSON(_: RecursivePlainObject<Component>): Component {
    throw new Error("Not implemented");
  }
}
