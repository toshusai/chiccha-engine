import { RecursivePlainObject } from "../../types/RecursivePlainObject";

const srcMap = new Map<string, string>();

export const SCRIPT_ASSET_TYPE = "ScriptAsset" as const;

export class ScriptAsset {
  readonly type = SCRIPT_ASSET_TYPE;
  id = "";
  src = "";

  _script: string | null = null;

  async load() {
    if (srcMap.has(this.id)) {
      this._script = srcMap.get(this.id)!;
      return;
    }
    const res = await fetch(this.src);
    this._script = await res.text();
    srcMap.set(this.id, this._script);
  }

  toJSON() {
    return {
      id: this.id,
      src: this.src,
      type: this.type,
    };
  }

  public static fromJSON(json: RecursivePlainObject<ScriptAsset>): ScriptAsset {
    const self = new ScriptAsset();
    self.id = json.id;
    self.src = json.src;
    return self;
  }
}
