import { expect, test } from "vitest";
import { RecursivePlainObject } from "../../types";
import { ImageRenderer } from "./ImageRenderer";
import { uuid } from "../../libs/uuid";

test("The input passed to fromJSON and the output of toJSON are equal", () => {
  const scriptJson: RecursivePlainObject<ImageRenderer> = {
    id: uuid(),
    enableCollision: true,
    type: "ImageRenderer",
    flipX: false,
    flipY: false,
    imageAssetId: "image",
    rotation: 0,
  };

  const script = ImageRenderer.fromJSON(scriptJson);
  const result = script.toJSON();

  expect(result).toStrictEqual(scriptJson);
});
