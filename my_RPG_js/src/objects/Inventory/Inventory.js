import { GameObject } from "../../GameObject";
import { Sprite } from "../../sprites";
import { resources } from "../../resource";
import { Vector2 } from "../../Vector2";
import { events } from "../../Events";

export class Inventory extends GameObject {
  constructor() {
    super({
      position: new Vector2(0, 1),
    });
    this.nextID = 0;
    this.items = [
      {
        id: -1,
        image: resources.images.rod,
      },
      {
        id: -2,
        image: resources.images.rod,
      },
    ];

    // React to Hero picking up an item
    events.on("HERO_PICKS_UP_ITEM", this, (data) => {
      // Show something on the screen...
      this.nextID += 1;
      this.items.push({
        id: this.nextID,
        image: resources.images.rod,
      });
      this.renderInventory();
    });

    // // Demo removing of something (could happen on item use)
    // setTimeout(() => {
    //   this.removeFromInventory(-2);
    // }, 2000);

    // Draw initial state on bootup
    this.renderInventory();
  }

  renderInventory() {
    //Remove state drawings
    this.children.forEach((child) => child.destroy());

    // Draw fresh from the latest version of the list
    this.items.forEach((item, index) => {
      const sprite = new Sprite({
        resource: item.image,
        position: new Vector2(index * 12, 0),
      });
      this.addChild(sprite);
    });
  }
  removeFromInventory(id) {
    this.items = this.items.filter((item) => item.id !== id);
    this.renderInventory();
  }
}
