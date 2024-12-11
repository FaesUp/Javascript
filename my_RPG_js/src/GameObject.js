import { events } from "./Events";
import { Vector2 } from "./Vector2";

export class GameObject {
  constructor({ position }) {
    this.position = position ?? new Vector2(0, 0);
    this.children = [];
    this.parent = null;
    this.hasReadyBeenCalled = false;
  }

  // First entry point of the loop
  stepEntry(delta, root) {
    // call updates on all children firsy
    this.children.forEach((child) => child.stepEntry(delta, root));

    // Call ready on the first frame
    if (!this.hasReadyBeenCalled) {
      this.hasReadyBeenCalled = true;
      this.ready();
    }

    //call any implemented Step code
    this.step(delta, root);
  }

  ready() {
    // ...
  }

  //Called once every frame
  step(_delta) {
    // ...
  }

  /* Draw entry */
  draw(ctx, x, y) {
    const drawPosX = x + this.position.x;
    const drawPosY = y + this.position.y;

    //Do the actual rendenring for Images
    this.drawImage(ctx, drawPosX, drawPosY);

    //Pass on to children
    this.children.forEach((child) => child.draw(ctx, drawPosX, drawPosY));
  }

  drawImage(ctx, drawPosX, drawPosY) {
    //...
  }

  //Remove from the tree
  destroy() {
    this.children.forEach((child) => {
      child.destroy();
    });
    this.parent.removeChild(this);
  }

  /* Other Game Objects are nestable inside this one */
  addChild(GameObject) {
    GameObject.parent = this;
    this.children.push(GameObject);
  }

  removeChild(GameObject) {
    events.unsubscribe(GameObject);
    this.children = this.children.filter((g) => {
      return GameObject !== g;
    });
  }
}
