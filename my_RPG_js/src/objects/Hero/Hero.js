import { GameObject } from "../../GameObject.js";
import { DOWN, LEFT, RIGHT, UP } from "../../Input.js";
import { Vector2 } from "../../Vector2.js";
import { Sprite } from "../../sprites.js";
import { Animations } from "../../Animation.js";
import { FrameIndexPattern } from "../../FrameIndexPattern.js";
import { isSpaceFree } from "../../helpers/grid.js";
import { walls } from "../../levels/level1.js";
import { resources } from "../../resource.js";
import { moveTowards } from "../../helpers/moveTowards.js";
import {
  WALK_DOWN,
  WALK_UP,
  WALK_LEFT,
  WALK_RIGHT,
  STAND_DOWN,
  STAND_LEFT,
  STAND_RIGHT,
  STAND_UP,
  PICK_UP_DOWN,
} from "./heroAnimation.js";
import { events } from "../../Events.js";

export class Hero extends GameObject {
  constructor(x, y) {
    super({
      position: new Vector2(x, y),
    });

    const shadow = new Sprite({
      resource: resources.images.shadow,
      frameSize: new Vector2(320, 180),
      position: new Vector2(-8, -19),
    });
    this.addChild(shadow);

    this.body = new Sprite({
      resource: resources.images.hero,
      frameSize: new Vector2(32, 32),
      hFrame: 3,
      vFrame: 8,
      frame: 1,
      position: new Vector2(-8, -20),
      animations: new Animations({
        walkDown: new FrameIndexPattern(WALK_DOWN),
        walkUp: new FrameIndexPattern(WALK_UP),
        walkLeft: new FrameIndexPattern(WALK_LEFT),
        walkRight: new FrameIndexPattern(WALK_RIGHT),
        standDown: new FrameIndexPattern(STAND_DOWN),
        standUp: new FrameIndexPattern(STAND_UP),
        standLeft: new FrameIndexPattern(STAND_LEFT),
        standRight: new FrameIndexPattern(STAND_RIGHT),
        pickUpDown: new FrameIndexPattern(PICK_UP_DOWN),
      }),
    });

    if (!this.body.animations) {
      console.error("Animations not properly initialized for Hero body");
    }

    this.addChild(this.body);

    this.facingDirection = DOWN;
    this.destinationPosition = this.position.duplicate();
    this.itemPickupTime = 0;
    this.itemPickupShell = null;

    // React to picking up an item
    events.on("HERO_PICKS_UP_ITEM", this, (data) => {
      this.onPickUpItem(data);
    });
  }

  step(delta, root) {
    // Lock movement if celebrating an item pickup
    if (this.itemPickupTime > 0) {
      this.workOnItemPickup(delta);
      return;
    }
    const distance = moveTowards(this, this.destinationPosition, 1);
    const hasArrived = distance <= 1;
    // Attempt to move again if the hero is at his position
    if (hasArrived) {
      this.tryMove(root);
    }
    if (this.body.animations) {
      this.body.animations.step(delta);
    } else {
      console.error("Hero body animations are undefined");
    }
    this.tryEmitPosition();
  }

  tryEmitPosition() {
    events.emit("HERO_POSITION", this.position);
  }

  tryMove(root) {
    const { input } = root;

    if (!input.direction) {
      if (this.facingDirection === LEFT) {
        this.body.animations.play("standLeft");
      }
      if (this.facingDirection === RIGHT) {
        this.body.animations.play("standRight");
      }
      if (this.facingDirection === UP) {
        this.body.animations.play("standUp");
      }
      if (this.facingDirection === DOWN) {
        this.body.animations.play("standDown");
      }
      return;
    }

    let nextX = this.destinationPosition.x;
    let nextY = this.destinationPosition.y;
    const gridSize = 16;

    if (input.direction === DOWN) {
      nextY += gridSize;
      this.body.animations.play("walkDown");
    }
    if (input.direction === UP) {
      nextY -= gridSize;
      this.body.animations.play("walkUp");
    }
    if (input.direction === LEFT) {
      nextX -= gridSize;
      this.body.animations.play("walkLeft");
    }
    if (input.direction === RIGHT) {
      nextX += gridSize;
      this.body.animations.play("walkRight");
    }
    this.facingDirection = input.direction ?? this.facingDirection;

    // Validating that the next destination is free
    if (isSpaceFree(walls, nextX, nextY)) {
      this.destinationPosition.x = nextX;
      this.destinationPosition.y = nextY;
    }
  }

  onPickUpItem({ image, position }) {
    //Make sure we land right on the item
    this.destinationPosition = position.duplicate();
    //Start the pickup animation
    this.itemPickupTime = 500; //ms

    this.itemPickupShell = new GameObject({});
    this.itemPickupShell.addChild(
      new Sprite({
        resource: image,
        position: new Vector2(0, -18),
      })
    );
    this.addChild(this.itemPickupShell);
  }
  workOnItemPickup(delta) {
    this.itemPickupTime -= delta;
    this.body.animations.play("pickUpDown");

    // Remove the item being held overhead
    if (this.itemPickupTime <= 0) {
      this.itemPickupShell.destroy();
    }
  }
}
