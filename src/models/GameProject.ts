import { GameObject } from "./GameObject";
import { Asset } from "./assets/Asset";

export type GameProject = {
  version: string;
  id: string;
  name: string;
  gameObjects: GameObject[];
  assets: Asset[];
};
