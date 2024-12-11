export const LEFT = "LEFT";
export const RIGHT = "RIGHT";
export const UP = "UP";
export const DOWN = "DOWN";

export class Input {
  constructor() {
    this.heldDirections = [];

    document.addEventListener("keydown", (e) => {
      // if down, move down!
      if (e.code === "ArrowUp" || e.code === "keyW") {
        this.onArrowPressed(UP);
      }
      // if up, move up!
      if (e.code === "ArrowDown" || e.code === "keyS") {
        this.onArrowPressed(DOWN);
      }
      if (e.code === "ArrowLeft" || e.code === "keyA") {
        this.onArrowPressed(LEFT);
      }
      if (e.code === "ArrowRight" || e.code === "keyD") {
        this.onArrowPressed(RIGHT);
      }
    });

    document.addEventListener("keyup", (e) => {
      // if down, move down!
      if (e.code === "ArrowUp" || e.code === "keyW") {
        this.onArrowReleased(UP);
      }
      // if up, move up!
      if (e.code === "ArrowDown" || e.code === "keyS") {
        this.onArrowReleased(DOWN);
      }
      if (e.code === "ArrowLeft" || e.code === "keyA") {
        this.onArrowReleased(LEFT);
      }
      if (e.code === "ArrowRight" || e.code === "keyD") {
        this.onArrowReleased(RIGHT);
      }
    });
  }

  get direction() {
    return this.heldDirections[0];
  }

  onArrowPressed(direction) {
    //Add this arrow to the queue if is's new
    if ((this, this.heldDirections.indexOf(direction) === -1)) {
      this.heldDirections.unshift(direction);
    }
  }

  onArrowReleased(direction) {
    const index = this.heldDirections.indexOf(direction);
    if (index === -1) {
      return;
    }

    //Remove this keys from the list
    this.heldDirections.splice(index, 1);
  }
}
