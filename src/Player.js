
import Point from "./Point.js";
import Vector from "./Vector.js";
import Item from "./Item.js";
import Collidable from "./Collidable.js";
import Rectangle from "./Rectangle.js";

export default class Player extends Item {
  constructor() {
    // default player 
    const params = {
      id: '_player',
      type: 'rock_02',
      x: 150,
      y: 80,
    };
    super(params);
    this.baseSpeed = 300; // how far to move in a second
    this.maxSpeed = 10000;
    this.velocity = new Vector();
    this.friction = 50;
    this.itemInfo = app.asset.make(new Item(this));
  }

  applyVelocity() {
    // round velocity
    this.velocity.round(3);
    if (this.velocity.isZero()) return;

    this.backupPos();

    // Update position
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  /**
   * Bakcup current pos so we can restore if there is a collision
   */
  backupPos() {
    this.backup = new Point(this.x, this.y);
  }

  /**
   * Restore previous pos if there was a collision
   */
  restorePos() {
    if (!this.backup) return;
    this.x = this.backup.x;
    this.y = this.backup.y;
  }

  checkCollisions(itemList) {
    // get current collision box for the player
    const playerRectInfo = {w: 10, h: 10, x:this.x, y:this.y};

    const playerRectangle = new Rectangle(playerRectInfo);

    // loop through all combined items for a layer eg SURFACE for a collision
    if (!itemList) return;
    
    itemList.forOf((item) => {
      item.collideList.forOf((itemList) => {
        itemList.forOf((rectangle) => {
          if (!rectangle) return;
          const colideInfo = rectangle.collides(playerRectangle);

          if (!colideInfo.isZero()) {
            this.restorePos();
          }
        });

      });
    });
  }

}
