import Point from "./Point.js";

export default class Hood extends Point {
  static DELIM = '_';
  /**
   * Can create a new Hood by passing in iether string '3_5' or numbers (3, 5)
   * @param {string or number} x eg '1_1' or just 1 
   * @param {*} y optional or 1
   * 
   */
  constructor(x, y) {
    if (typeof x === "string") {
      [x, y] = Hood.breakKey(x);
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
   * generates a key from the x,y eg 2,5
   * @returns {string} a key in the format 'x_y' eg '2_5'
   */
  get key() {
    return `${this.x}${Hood.DELIM}${this.y}`;
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
   * 
   * @param {object} params {w, h} of a cell 
   * @returns {Point} with x and y being the absolute position relative to the cell in the grid
   */
  expandHood(params) {
    return new Point(this.x * params.w, this.y * params.h);
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

};