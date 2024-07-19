function colorTween(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function yellowToRed(t: number) {
  const r = colorTween(255, 255, t);
  const g = colorTween(255, 0, t);
  return `rgb(${r}, ${g}, 0)`;
}

export function greenToYellow(t: number) {
  const r = colorTween(0, 255, t);
  const g = colorTween(255, 255, t);
  return `rgb(${r}, ${g}, 0)`;
}
