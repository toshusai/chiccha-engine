import { Component } from "./components/Component";
import { serializeComponent } from "../libs/serializeComponent";
import { GameRunner } from "../core/GameRunner";
import { RecursivePlainObject } from "../types";

/**
 * GameObject class
 */
export class GameObject {
  readonly type = "GameObject" as const;
  id = "";
  name = "";
  components: Component[] = [];

  /**
   * Start the game object and all its components
   */
  start() {
    this.components.forEach((component) => {
      component.start();
    });
  }

  /**
   * Update the game object and all its components
   */
  update() {
    this.components.forEach((component) => {
      component.update();
    });
  }

  /*
   * Render the game object and all its components
   */
  render() {
    this.components.forEach((component) => {
      component.render(GameRunner.instance.ctx);
    });
  }

  /**
   * Get a component of a specific type
   */
  getComponent<T extends typeof Component>(
    type: T
  ): InstanceType<T> | undefined {
    return this.components.find((component) => component instanceof type) as
      | InstanceType<T>
      | undefined;
  }

  /*
   * Add a component to the game object
   */
  addComponent(component: Component) {
    this.components.push(component);
    component.setGameObject(this);
    component.start();
  }

  destroy() {
    this.components.forEach((component) => {
      component.destroy();
    });
  }

  toJSON(): RecursivePlainObject<GameObject> {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      components: this.components.map((c) => c.toJSON()),
    };
  }

  public static fromJSON(json: RecursivePlainObject<GameObject>) {
    const self = new GameObject();
    self.id = json.id;
    self.name = json.name;
    self.components = json.components.map((c) => {
      const component = serializeComponent(c);
      component.setGameObject(self);
      return component;
    });
    return self;
  }
}
