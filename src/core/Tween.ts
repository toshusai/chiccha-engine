export class Tween {
  f: (t: number) => void;
  duration: number;
  timer = 0;
  delay = 0;
  onEnd?: () => void;
  isEnded = false;

  constructor(
    f: (t: number) => void,
    duration: number,
    delay = 0,
    onEnd?: () => void
  ) {
    this.f = f;
    this.duration = duration;
    this.delay = delay;
    this.onEnd = onEnd;
  }

  update() {
    if (this.delay > 0) {
      this.delay -= 1 / 60;
      return;
    }
    this.timer += 1 / 60;
    this.f(this.timer / this.duration);
    if (this.timer >= this.duration) {
      this.onEnd?.();
      this.isEnded = true;
    }
  }
}
