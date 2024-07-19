import { expect, test } from "vitest";
import { ScriptAsset } from "./ScriptAsset";
import { RecursivePlainObject } from "../../types";
import { uuid } from "../../libs/uuid";

test("The input passed to fromJSON and the output of toJSON are equal", () => {
  const input: RecursivePlainObject<ScriptAsset> = {
    id: uuid(),
    src: "/path/to/script.lua",
    type: "ScriptAsset",
  };

  const instance = ScriptAsset.fromJSON(input);
  const output = instance.toJSON();

  expect(output).toStrictEqual(input);
});
