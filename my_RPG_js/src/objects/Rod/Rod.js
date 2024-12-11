import { events } from "../../Events";
import { GameObject } from "../../GameObject";
import { resources } from "../../resource";
import { Sprite } from "../../sprites";
import { Vector2 } from "../../Vector2";

export class Rod extends GameObject {
  constructor(x, y) {
    super({
      name: "Rod",
      position: new Vector2(x, y),
    });
    const sprite = new Sprite({
      resource: resources.images.rod,
      position: new Vector2(0, -5), // nudge upwards visually
    });
    this.addChild(sprite);
  }

  ready() {
    console.log("ROD IS READY!");
    events.on("HERO_POSITION", this, (pos) => {
      // detect overlap...
      const roundedHeroX = Math.round(pos.x);
      const roundedHeroY = Math.round(pos.y);
      if (
        roundedHeroX === this.position.x &&
        roundedHeroY === this.position.y
      ) {
        // overlap!
        this.onCollideWithHero();
      }
    });
  }

  onCollideWithHero() {
    // Remove this instance from the scene
    this.destroy();
    // Alert other things that we picked up a rod
    events.emit("HERO_PICKS_UP_ITEM", {
      image: resources.images.rod,
      position: this.position,
    });
  }
}
