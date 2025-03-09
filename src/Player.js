
import Point from "./Point.js";
import Vector from "./Vector.js";
import Item from "./Item.js";

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

}
