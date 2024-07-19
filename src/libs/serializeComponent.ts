import { ImageRenderer } from "../models/components/ImageRenderer";
import { Component } from "../models/components/Component";
import { Transform } from "../models/components/Transform";
import { Script } from "../models/components/ScriptComponent";
import { RecursivePlainObject } from "../types";

export function serializeComponent(json: RecursivePlainObject<Component>) {
  switch (json.type) {
    case "ImageRenderer":
      return ImageRenderer.fromJSON(
        json as RecursivePlainObject<ImageRenderer>
      );
    case "Transform":
      return Transform.fromJSON(json as RecursivePlainObject<Transform>);
    case "Script":
      return Script.fromJSON(json as RecursivePlainObject<Script>);
    default:
      throw new Error(`Unknown component type: ${json.type}`);
  }
}
