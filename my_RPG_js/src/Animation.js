export class Animations {
  constructor(patterns) {
    this.patterns = patterns;
    this.activeKey = Object.keys(this.patterns)[0];
  }

  get frame() {
    if (this.patterns[this.activeKey]) {
      return this.patterns[this.activeKey].frame;
    } else {
      console.error(`No pattern found for activeKey: ${this.activeKey}`);
      return null;
    }
  }

  play(key, startAtTime = 0) {
    // Already playing this one
    if (this.activeKey === key) {
      return;
    }
    if (!this.patterns[key]) {
      console.error(`No animation pattern found for key: ${key}`);
      return;
    }
    // Switch
    this.activeKey = key;
    this.patterns[this.activeKey].currenTime = startAtTime;
  }

  step(delta) {
    if (this.patterns[this.activeKey]) {
      this.patterns[this.activeKey].step(delta);
    } else {
      console.error(`No pattern found for activeKey: ${this.activeKey}`);
    }
  }
}
