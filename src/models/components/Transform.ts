import { RecursivePlainObject } from "../../types/RecursivePlainObject";
import { Vector2 } from "../../core/Vector2";
import { Component } from "./Component";

export class Transform extends Component {
  readonly type = "Transform" as const;
  id: string = "";
  position = new Vector2();

  public static fromJSON(json: RecursivePlainObject<Transform>) {
    const self = new Transform();
    self.id = json.id;
    self.position = new Vector2(json.position.x, json.position.y);
    return self;
  }

  toJSON(): RecursivePlainObject<Transform> {
    return {
      id: this.id,
      type: this.type,
      position: this.position.toJSON(),
    };
  }
}
