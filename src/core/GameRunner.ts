import { GameObject } from "../models/GameObject";
import * as Matter from "matter-js";
import { Script } from "../models/components/ScriptComponent";
import { KeyboardInputManager } from "./KeyboardInputManager";
import { AssetManager } from "./AssetManager";
import { fillTextMaxWidth } from "../utils/fillTextMaxWidth";
import { yellowToRed, greenToYellow } from "./yellowToRed";
import { InputManager } from "./InputManager";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import confetti from "canvas-confetti";
import { Tween } from "./Tween";

const GAME_TIMER = 6;

export class GameRunner {
  inputManager!: InputManager;
  assetManager!: AssetManager;
  gameObjects!: GameObject[];
  ctx!: CanvasRenderingContext2D;
  engine!: Matter.Engine;
  runner!: Matter.Runner;
  tweens: Tween[] = [];

  mRender?: Matter.Render;

  hasError = false;

  timer = GAME_TIMER;

  gameState: "gameClear" | "gameOver" | "playing" = "playing";

  screenWidth = 128;
  screenHeight = 128;

  freeze = false;

  overlayCanvas?: HTMLCanvasElement;

  public static instance: GameRunner = new GameRunner();

  constructor() {}

  /**
   * Initialize the game
   */
  public initialize(options: {
    assetManager: AssetManager;
    gameObjects: GameObject[];
    ctx: CanvasRenderingContext2D;
  }) {
    this.timer = GAME_TIMER;
    this.freeze = false;
    this.hasError = false;
    this.gameState = "playing";
    this.assetManager = options.assetManager;
    this.gameObjects = options.gameObjects;
    this.ctx = options.ctx;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.imageSmoothingQuality = "low";

    this.engine = Matter.Engine.create({
      gravity: {
        x: 0,
        y: 0,
      },
    });
    this.runner = Matter.Runner.create();
    this.inputManager = new KeyboardInputManager();
    this.inputManager.initialize();
  }

  /**
   * Start the game
   */
  async start() {
    try {
      await this.assetManager.load();

      Matter.Runner.run(this.runner, this.engine);

      this.gameObjects.forEach((gameObject) => {
        gameObject.start();
      });

      Matter.Events.on(
        this.engine,
        "collisionStart",
        this.handleCollisionStart
      );
    } catch (e) {
      this.handleError(`${e}`);
    }
  }

  runDebugRender() {
    this.mRender = Matter.Render.create({
      element: document.body,
      engine: this.engine,
      options: {
        width: 128,
        height: 128,
        wireframes: false,
        background: "transparent",
      },
    });
    Matter.Render.run(this.mRender);
  }

  /**
   * Update the game
   * before rendering
   */
  update() {
    if (this.hasError) return;
    if (this.freeze) return;
    if (this.gameState === "gameOver") return;
    this.inputManager.update();
    this.gameObjects.forEach((gameObject) => {
      gameObject.update();
    });
    Matter.Engine.update(this.engine, 1000 / 60);

    if (this.gameState === "playing") {
      this.timer -= (1 / 60) * (8 / 6);

      if (this.timer < 0) {
        this.gameOver();
      }
    }
  }

  /**
   * Render the game
   */
  render() {
    if (this.hasError) return;
    if (this.freeze) return;
    if (this.gameState !== "gameOver") {
      const ctx = this.ctx;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, 128, 128);
      this.gameObjects.forEach((gameObject) => {
        gameObject.render();
      });
    }

    if (this.gameState === "gameClear") {
      const colors = ["red", "orange", "yellow", "green", "blue"];
      this.ctx.font = "12px Gamer";
      this.ctx.textAlign = "center";
      const text = "GAME CLEAR";
      const width = this.ctx.measureText(text).width;
      const left = this.screenWidth / 2 - width / 2 + 4;
      const space = width / text.length;
      text.split("").forEach((char, i) => {
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(char, left + i * space, 64);
        this.ctx.fillStyle = colors[i % colors.length];
        this.ctx.fillText(char, left + i * space, 64);
      });
    }

    this.renderTimer();

    this.tweens = this.tweens.filter((tween) => {
      tween.update();
      return !tween.isEnded;
    });
  }

  gameOver() {
    this.ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    this.ctx.fillRect(0, 0, 128, 128);
    this.ctx.fillStyle = "black";
    this.ctx.font = "12px Gamer";
    this.ctx.textAlign = "center";
    this.ctx.fillText("GAME OVER", 64, 64);
    this.gameState = "gameOver";
  }

  gameClear() {
    this.overlayCanvas = this.ctx.canvas.cloneNode() as HTMLCanvasElement;
    this.ctx.canvas.parentElement!.appendChild(this.overlayCanvas);
    this.overlayCanvas.style.position = "absolute";
    this.overlayCanvas.style.top = "0";
    this.overlayCanvas.style.left = "0";
    const fire = confetti.create(this.overlayCanvas, {});

    const baseConfig = {
      particleCount: 100,
      spread: 30,
      ticks: 100,
      scalar: 0.3,
      startVelocity: 20,
      gravity: 0.5,
    };

    fire({
      ...baseConfig,
      angle: 75,
      origin: { x: 0, y: 1 },
    });
    fire({
      ...baseConfig,
      angle: 105,
      origin: { x: 1, y: 1 },
    });
    this.gameState = "gameClear";

    this.tweens.push(
      new Tween(
        (t) => {
          this.ctx.globalAlpha = t;
          this.ctx.fillStyle = "black";
          this.ctx.fillRect(0, 0, 128, 128);
          this.ctx.globalAlpha = 1;
        },
        1,
        1,
        () => {
          this.freeze = true;
        }
      )
    );
  }

  renderTimer() {
    this.ctx.lineWidth = 4;
    this.ctx.fillStyle = "black";
    this.ctx.strokeRect(
      this.ctx.lineWidth / 2,
      this.ctx.lineWidth / 2,
      this.screenWidth - this.ctx.lineWidth,
      this.screenHeight - this.ctx.lineWidth
    );
    if (this.timer < 0) {
      return;
    }

    const width = 4;
    const half = this.screenWidth / 2;

    const realTime = this.timer;
    this.timer = this.timer * (8 / GAME_TIMER);

    if (this.timer < 4) {
      this.ctx.fillStyle = yellowToRed(1 - (this.timer % 4) / 4);
    } else {
      this.ctx.fillStyle = greenToYellow(1 - (this.timer % 4) / 4);
    }

    if (this.timer < 1) {
      const x = half - half * (this.timer % 1);
      this.ctx.fillRect(x, 0, half - x, width);
    } else {
      this.ctx.fillRect(0, 0, half, width);
    }

    if (this.timer < 1) {
      //
    } else if (this.timer < 3) {
      this.ctx.fillRect(
        0,
        0,
        width,
        this.screenHeight * (((this.timer + 1) % 2) / 2)
      );
    } else {
      this.ctx.fillRect(0, 0, width, this.screenHeight);
    }

    const right = this.screenWidth - width;

    if (this.timer < 3) {
      //
    } else if (this.timer < 5) {
      this.ctx.fillRect(
        0,
        right,
        this.screenWidth * (((this.timer + 1) % 2) / 2),
        width
      );
    } else {
      this.ctx.fillRect(0, right, this.screenWidth, width);
    }

    if (this.timer < 5) {
      //
    } else if (this.timer < 7) {
      const h = this.screenHeight * (((this.timer + 1) % 2) / 2);
      this.ctx.fillRect(right, this.screenHeight - h, width, h);
    } else {
      this.ctx.fillRect(right, 0, width, this.screenHeight);
    }

    if (this.timer < 7) {
      //
    } else if (this.timer < 8) {
      const w = this.screenWidth * ((this.timer % 2) / 2);
      this.ctx.fillRect(this.screenWidth + half - w, 0, w, width);
    } else {
      this.ctx.fillRect(half, 0, 0, width);
    }

    this.timer = realTime;

    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = "black";
    this.ctx.strokeRect(
      width,
      width,
      this.screenWidth - width * 2,
      this.screenHeight - width * 2
    );
  }

  destroy() {
    this.gameObjects.forEach((gameObject) => {
      gameObject.destroy();
    });
    this.gameObjects = [];

    this.tweens = [];

    Matter.Runner.stop(this.runner);
    if (this.mRender) {
      const render = this.mRender;
      render.canvas.remove();
      render.textures = {};
    }

    this.overlayCanvas?.remove();

    Matter.Events.off(this.engine, "collisionStart", this.handleCollisionStart);
  }

  handleError(error: string) {
    this.hasError = true;
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 0, 128, 128);
    this.ctx.fillStyle = "white";
    this.ctx.font = "12px Gamer";

    fillTextMaxWidth(this.ctx, error, 4, 16);
  }

  /**
   *  when two objects collide
   */
  handleCollisionStart(event: Matter.IEventCollision<Matter.Engine>) {
    const pairs = event.pairs;
    pairs.forEach((pair) => {
      const a = pair.bodyA.plugin.gameObject as GameObject;
      const b = pair.bodyB.plugin.gameObject as GameObject;
      const scriptA = a.getComponent(Script);
      const scriptB = b.getComponent(Script);

      scriptA?.emitEvent("onCollisionEnter", b.name);
      scriptB?.emitEvent("onCollisionEnter", a.name);
    });
  }
}
