import { expect, test } from "vitest";
import { RecursivePlainObject } from "../types";
import { GameObject } from "./GameObject";
import { ImageRenderer, Script, Transform } from "./components";
import { uuid } from "../libs/uuid";

test("The input passed to fromJSON and the output of toJSON are equal", () => {
  const input: RecursivePlainObject<GameObject> = {
    components: [
      {
        id: uuid(),
        enableCollision: true,
        type: "ImageRenderer",
        flipX: false,
        flipY: false,
        imageAssetId: "image",
        rotation: 0,
      } as RecursivePlainObject<ImageRenderer>,
      {
        id: uuid(),
        scriptAssetId: "script",
        type: "Script",
      } as RecursivePlainObject<Script>,
      {
        id: uuid(),
        position: { x: 0, y: 0 },
        type: "Transform",
      } as RecursivePlainObject<Transform>,
    ],
    id: uuid(),
    type: "GameObject",
    name: "GameObject",
  };

  const instance = GameObject.fromJSON(input);
  const output = instance.toJSON();
  expect(output).toStrictEqual(input);
});
