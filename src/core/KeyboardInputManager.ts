import { InputManager } from "./InputManager";
import { KeyEvent } from "../models/components/ScriptComponent";

enum DownType {
  KeyDown,
  KeyPress,
  KeyUp,
}

type EventMap = {
  onKeyDown: ((event: string) => void)[];
  onKeyUp: ((event: string) => void)[];
  onKeyPress: ((event: string) => void)[];
};

export class KeyboardInputManager implements InputManager {
  static instance = new KeyboardInputManager();

  constructor() {}

  private keyDownMap: Record<string, DownType> = {};

  eventMap: EventMap = {
    onKeyDown: [],
    onKeyUp: [],
    onKeyPress: [],
  };

  cleanUp: (() => void)[] = [];

  initialize() {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (this.keyDownMap[e.key] === DownType.KeyDown) return;
      if (this.keyDownMap[e.key] === DownType.KeyPress) return;
      this.keyDownMap[e.key] = DownType.KeyDown;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      this.keyDownMap[e.key] = DownType.KeyUp;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    this.cleanUp.push(() => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    });
  }

  destroy() {
    this.cleanUp.forEach((fn) => fn());
    this.cleanUp = [];
  }

  update() {
    for (const key in this.keyDownMap) {
      if (this.keyDownMap[key] === DownType.KeyPress) {
        this.eventMap["onKeyPress"].forEach((listener) => listener(key));
      } else if (this.keyDownMap[key] === DownType.KeyDown) {
        this.eventMap["onKeyDown"].forEach((listener) => listener(key));
      } else if (this.keyDownMap[key] === DownType.KeyUp) {
        this.eventMap["onKeyUp"].forEach((listener) => listener(key));
      }
    }
    this.updateKeyType();
  }

  private updateKeyType() {
    for (const key in this.keyDownMap) {
      if (this.keyDownMap[key] === DownType.KeyDown) {
        this.keyDownMap[key] = DownType.KeyPress;
      }
      if (this.keyDownMap[key] === DownType.KeyUp) {
        delete this.keyDownMap[key];
      }
    }
  }

  addEventListener(type: KeyEvent, listener: (event: string) => void) {
    this.eventMap[type].push(listener);
  }
}
