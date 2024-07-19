import { expect, test } from "vitest";
import { ImageAsset } from "./ImageAsset";
import { RecursivePlainObject } from "../../types";
import { uuid } from "../../libs/uuid";

test("The input passed to fromJSON and the output of toJSON are equal", () => {
  const input: RecursivePlainObject<ImageAsset> = {
    id: uuid(),
    src: "/path/to/image.png",
    type: "ImageAsset",
  };

  const instance = ImageAsset.fromJSON(input);
  const output = instance.toJSON();

  expect(output).toStrictEqual(input);
});
