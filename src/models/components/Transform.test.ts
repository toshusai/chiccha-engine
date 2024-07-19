import { expect, test } from "vitest";
import { RecursivePlainObject } from "../../types";
import { Transform } from "./Transform";
import { uuid } from "../../libs/uuid";

test("The input passed to fromJSON and the output of toJSON are equal", () => {
  const input: RecursivePlainObject<Transform> = {
    id: uuid(),
    position: { x: 0, y: 0 },
    type: "Transform",
  };

  const instance = Transform.fromJSON(input);
  const output = instance.toJSON();

  expect(output).toStrictEqual(input);
});
