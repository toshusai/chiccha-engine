import { expect, test, vi } from "vitest";
import { RecursivePlainObject } from "../../types";
import { Script } from "./ScriptComponent";
import { GameObject } from "../GameObject";
import { Transform } from "./Transform";
import { AssetManager, GameRunner } from "../../core";
import { ScriptAsset } from "../assets";
import { uuid } from "../../libs/uuid";

test("The input passed to fromJSON and the output of toJSON are equal", () => {
  const input: RecursivePlainObject<Script> = {
    id: uuid(),
    scriptAssetId: "script",
    type: "Script",
  };

  const instance = Script.fromJSON(input);
  const output = instance.toJSON();

  expect(output).toStrictEqual(input);
});

test("Calling moveX from a script can modify the value of transform", () => {
  const gameObject = new GameObject();
  const script = new Script();
  script.setGameObject(gameObject);
  const transform = new Transform();
  gameObject.addComponent(transform);

  script.moveX(10);

  expect(transform.position.x).toBe(10);
});

test("Calling moveX from a lua script should modify the value of transform", () => {
  const scriptAssetId = uuid();
  const gameObject = GameObject.fromJSON({
    id: uuid(),
    type: "GameObject",
    name: "gameObject",
    components: [
      {
        id: uuid(),
        type: "Transform",
        position: { x: 0, y: 0 },
      } as RecursivePlainObject<Transform>,
      {
        id: uuid(),
        type: "Script",
        scriptAssetId: scriptAssetId,
      } as RecursivePlainObject<Script>,
    ],
  });

  vi.spyOn(globalThis, "fetch").mockImplementation(
    async () =>
      new Response(
        `
return {
  onStart = function()
    self.moveX(10)
  end
}      
`
      )
  );

  const assetManager = new AssetManager([
    ScriptAsset.fromJSON({
      id: scriptAssetId,
      src: "/path/to/script.lua",
      type: "ScriptAsset",
    }),
  ]);

  GameRunner.instance.initialize({
    assetManager,
    gameObjects: [gameObject],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: {} as any,
  });

  (async () => {
    await assetManager.load();

    const script = gameObject.getComponent(Script);
    script?.start();

    expect(gameObject.getComponent(Transform)?.position.x).toBe(10);

    vi.restoreAllMocks();
  })();
});
