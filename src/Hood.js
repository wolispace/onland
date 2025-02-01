import Point from "./Point.js";

/**
 * A hood is a 9 square grid of points around a centre point
 * We start witht he middle then do a kings square around it
 * Start with '2_2' and we get a list of keys '1_1' to '3_3' (9 squares)
 */
export default class Hood extends Point {
  static DELIM = '_';

  /**
   * Can create a new Hood by passing in iether string '3_5' or numbers (3, 5)
   * @param {string or number} x eg '1_1' or just 1 
   * @param {*} y optional or 1
   * @returns {Hood}
   */
  constructor(x, y) {
    if (typeof x === "string") {
      [x, y] = Hood.breakKey(x);
    } else if (x.x !== undefined) {
      y = x.y;
      x = x.x;
    }
    super(x, y);
  }

  /**
   * Splits the string by the delimiter
   * @param {string} key eg '2_5'
   * @returns {array} [x,y] eg [2, 5]
   */
  static breakKey(key) {
    const [x, y] = key.split(Hood.DELIM);
    return [parseInt(x), parseInt(y)];
  }
  /**
   * Getter generates a key from the x,y eg 2,5
   * @returns {string} a key in the format 'x_y' eg '2_5'
   */
  get key() {
    return `${this.x}${Hood.DELIM}${this.y}`;
  }

  /**
   * Getter returns a point of the x and y
   * @returns {Point}
   */
  get point() {
    return new Point(this.x, this.y);
  }

  /**
   * 
   * @param {Hood} hood to add to current x,y (using Points add method)
   * @returns {Hood} the hood of the result eg 0,2 + -1,1 = -1,3 = '-1_3'
   */
  addHood(hood) {
    return this.add(hood);
  }

  /**
   * Expands the hood eg 1_1 by the cellArea
   * so 2_5 by 1000x1000 = 2000x5000
   * @param {Point} point 
   * @returns {Hood}
   */
  expandHood(point) {
    return this.expand(point);
  }

  /**
   * return an array of 9 keys being the 8 surrounding keys and the key itself
   * @param {array} of keys [1,2,3,4,5,6,7,8,9] with 5 as the centre x,y of this Hood
   */
  get list() {
    const hood = [];
    for (let x = this.x - 1; x <= this.x + 1; x++) {
      for (let y = this.y - 1; y <= this.y + 1; y++) {
        hood.push(new Hood(x, y).key);
      }
    }
    return hood;
  }

  /**
   * Returns just the actual hood keys nothing in negative
   * @returns {array} of keys [1,2,3,4,5,6,7,8,9] with 5 as the centre x,y of this Hood
   */
  get listReal() {
    const hood = [];
    for (let x = this.x - 1; x <= this.x + 1; x++) {
      if (x < 0) continue;
      for (let y = this.y - 1; y <= this.y + 1; y++) {
        if (y < 0) continue;
        hood.push(new Hood(x, y).key);
      }
    }
    return hood;
  }

};