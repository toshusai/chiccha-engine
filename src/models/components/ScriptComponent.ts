import { Component } from "./Component";
import { RecursivePlainObject } from "../../types/RecursivePlainObject";
import { Transform } from "./Transform";
import * as LuaInJS from "lua-in-js";
import { ImageRenderer } from "./ImageRenderer";
import { GameRunner } from "../../core/GameRunner";
import { ScriptAsset } from "../assets/ScriptAsset";

export type KeyEvent = "onKeyDown" | "onKeyUp" | "onKeyPress";
type ColliderEvent = "onCollisionEnter" | "onCollisionExit" | "onCollisionStay";

type Event = KeyEvent | ColliderEvent;

type LuaScriptInterface = {
  moveX: (value: number) => void;
  moveY: (value: number) => void;
  changeImage: (imageId: string) => void;
  gameClear: () => void;
  gameOver: () => void;
  random: (min?: number, max?: number) => number;
};

export class Script extends Component {
  readonly type = "Script" as const;
  id = "";
  scriptAssetId = "";

  private _eventMap: Record<string, (event: string) => void> = {};
  private _functions: Record<string, () => void> = {};

  emitEvent(event: Event, mode: string) {
    if (event in this._eventMap) {
      this._eventMap[event](mode);
    }
  }

  createScriptInterface() {
    const luaInterface: LuaScriptInterface = {
      moveX: (value: number) => this.moveX(value),
      moveY: (value: number) => this.moveY(value),
      changeImage: (...imageIds: string[]) => {
        imageIds.forEach((imageId, i) => {
          setTimeout(() => {
            const image = this.getGameObject()?.getComponent(ImageRenderer);
            if (image) {
              image.imageAssetId = imageId;
            }
          }, 250 * i);
        });
      },
      gameClear: () => {
        GameRunner.instance.gameClear();
      },
      gameOver: () => {
        GameRunner.instance.gameOver();
      },
      random: (min = 0, max = 1) => {
        return Math.random() * (max - min) + min;
      },
    };
    return luaInterface;
  }

  start(): void {
    const luaEnv = LuaInJS.createEnv();
    const table = new LuaInJS.Table(this.createScriptInterface());
    luaEnv.loadLib("self", table);
    const src = this.getSource();
    if (!src) {
      console.error("No source found for script", this.scriptAssetId);
      return;
    }

    const result = luaEnv.parse(src).exec() as LuaInJS.Table;
    const methods = result.strValues;

    this._functions = Object.keys(methods).reduce((acc, key) => {
      acc[key] = () => {
        try {
          LuaInJS.utils.coerceArgToFunction(methods[key], "", 0)();
        } catch (e) {
          GameRunner.instance.handleError(`Error: ${e}`);
        }
      };
      return acc;
    }, {} as Record<string, () => void>);

    this._functions["onStart"]?.();

    if (methods) {
      Object.keys(methods).forEach((key) => {
        const [_, name] = key.split("_");
        const f = (event: string) => {
          try {
            if (event === name) {
              LuaInJS.utils.coerceArgToFunction(methods[key], "", 0)();
            }
          } catch (e) {
            GameRunner.instance.handleError(`Error: ${e}`);
          }
        };
        if (key.startsWith("onCollision")) {
          this.addEventListener("onCollisionEnter", f);
        } else if (key.startsWith("onKeyDown")) {
          GameRunner.instance.inputManager.addEventListener("onKeyDown", f);
        } else if (key.startsWith("onKeyUp")) {
          GameRunner.instance.inputManager.addEventListener("onKeyUp", f);
        } else if (key.startsWith("onKeyPress")) {
          GameRunner.instance.inputManager.addEventListener("onKeyPress", f);
        }
      });
    }
  }

  addEventListener(type: Event, listener: (event: string) => void) {
    this._eventMap[type] = listener;
  }

  update(): void {
    this._functions["onUpdate"]?.();
  }

  destroy(): void {}

  moveX(value: number) {
    const transform = this.getGameObject()?.getComponent(Transform);
    if (transform) {
      transform.position.x += value;
    }
  }

  moveY(value: number) {
    const transform = this.getGameObject()?.getComponent(Transform);
    if (transform) {
      transform.position.y += value;
    }
  }

  getSource() {
    const asset = GameRunner.instance.assetManager.getAssetById(
      this.scriptAssetId
    ) as ScriptAsset | undefined;
    return asset?._script;
  }

  public static fromJSON(json: RecursivePlainObject<Script>) {
    const self = new Script();
    self.id = json.id;
    self.scriptAssetId = json.scriptAssetId;
    return self;
  }

  toJSON(): RecursivePlainObject<Script> {
    return {
      id: this.id,
      type: this.type,
      scriptAssetId: this.scriptAssetId,
    };
  }
}
