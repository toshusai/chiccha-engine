export class Vector2 {
  x = 0;
  y = 0;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  toJSON() {
    return { x: this.x, y: this.y };
  }
}
