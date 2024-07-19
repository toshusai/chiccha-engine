const canvas =
  typeof document !== "undefined" ? document.createElement("canvas") : null;

export function getConvexHull(img: HTMLImageElement, scale = 1) {
  if (!canvas) return { points: [], data: null };
  const def = {
    points: [] as Matter.Vector[],
    data: null,
  };

  if (!canvas) {
    return def;
  }
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (img.width === 0 || img.height === 0) {
    return def;
  }

  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  ctx.clearRect(0, 0, img.width, img.height);
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    0,
    0,
    img.width * scale,
    img.height * scale
  );

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height, {});
  const points: Matter.Vector[] = [];

  const add = (x: number, y: number) => {
    const i = y * canvas.width * 4 + x * 4 + 3;
    const a = data.data[i];
    if (a > 0) {
      if (points.find((p) => p.x === x && p.y === y)) return false;
      points.push({ x, y });
      return true;
    }
  };
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      if (add(x, y)) break;
    }
  }
  if (points.length === 0) return def;
  for (let x = points[points.length - 1].x + 1; x < canvas.width; x++) {
    for (let y = canvas.height - 1; y >= 0; y--) {
      if (add(x, y)) break;
    }
  }
  for (let y = points[points.length - 1].y - 1; y >= 0; y--) {
    for (let x = canvas.width - 1; x >= 0; x--) {
      if (add(x, y)) break;
    }
  }
  for (let x = points[points.length - 1].x - 1; x >= points[0].x + 1; x--) {
    for (let y = 0; y < canvas.height; y++) {
      if (add(x, y)) break;
    }
  }

  points.forEach((p) => {
    p.x /= scale;
    p.y /= scale;
  });

  return { points, data };
}
