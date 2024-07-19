import { useCallback, useEffect, useState } from "react";
import {
  GameProject,
  GameRunner,
  AssetManager,
  GameObject,
} from "@toshusai/chiccha-engine";
import { useRef } from "react";

function useGame(gameProject: GameProject) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current!.getContext("2d")!;
    if (!ctx) {
      return;
    }

    GameRunner.instance.initialize({
      assetManager: new AssetManager(gameProject.assets),
      gameObjects: gameProject.gameObjects.map((go) => {
        return GameObject.fromJSON(go);
      }),
      ctx,
    });

    let requestAnimationFrameId: number;
    const mainLoop = () => {
      GameRunner.instance.update();
      GameRunner.instance.render();
      requestAnimationFrameId = requestAnimationFrame(mainLoop);
    };

    // may not work with StrictMode
    GameRunner.instance.start().then(() => {
      mainLoop();
    });

    return () => {
      GameRunner.instance.destroy();
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [gameProject]);

  return canvasRef;
}

function GameCanvas(props: { game: GameProject }) {
  const ref = useGame(props.game);

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <canvas
        ref={ref}
        id="canvas"
        width="128"
        height="128"
        style={{
          imageRendering: "pixelated",
          width: "256px",
          height: "256px",
        }}
      ></canvas>
    </div>
  );
}

function App() {
  const [game, setGame] = useState<GameProject | null>(null);
  const [key, setKey] = useState("");
  const restart = useCallback(() => {
    setKey(Math.random().toString());
  }, []);

  useEffect(() => {
    fetch("/shmup/project.json")
      .then((res) => res.json())
      .then((game) => setGame(game));
  }, []);

  if (!game) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <GameCanvas key={key} game={game} />
      <button
        style={{
          width: "fit-content",
        }}
        onClick={restart}
      >
        Restart
      </button>
      <div>
        A: Move Left
        <br />
        D: Move Right
        <br />
        Z: Shoot
      </div>
    </div>
  );
}

export default App;
