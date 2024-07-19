import { KeyEvent } from "../models/components/ScriptComponent";

export interface InputManager {
  /**
   * Initialize the input manager
   */
  initialize(): void;

  /**
   * Update the input state
   */
  update(): void;

  /**
   * Add an event listener
   * expected called from the script component
   * the event string is the key name
   * @param type  key event type 'onKeyDown' | 'onKeyUp' | 'onKeyPress'
   * @param listener the callback function when the event is triggered
   */
  addEventListener(type: KeyEvent, listener: (event: string) => void): void;
}
