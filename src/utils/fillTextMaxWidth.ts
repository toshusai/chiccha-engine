export function fillTextMaxWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
) {
  const maxWidth = 100;
  const lineHeight = 16;
  let line = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    line += char;
    const lineWidth = ctx.measureText(line).width;
    if (lineWidth > maxWidth) {
      ctx.fillText(line, x, y);
      line = "";
      y += lineHeight;
    }
  }
  ctx.fillText(line, x, y);
}
