import Point from "./Point.js";

/**
 * An area is the width and heigh of a rectangle. 
 * Used for the cell size of a grid and other fun stuff
 */
export default class Area {

  /**
   * @param {number, object} w width of the area or a {w,h} object
   * @param {number, null} h optional height of the area defaults to w so its a square
   */
  constructor(w, h) {
    // is it an object
    if (w.w) {
      w = w.w;
      h = w.h;
    } else {
      // is it a square
      if (h == undefined) {
        h = w;
      }
    }
    this.set(w, h);
  }
  
  /**
   * Sets the width and height of this area
   * @param {number} w 
   * @param {number} h 
   * @returns {Area} this area
   */
  set(w, h) {
    this.w = w;
    this.h = h;
    return this;
  }

  /**
   * Multiply the area by the point for calculating offsets from a grid to the world coords
   * @param {Point} point eg {x:5, y:2} 
   * @returns {Point} eg: w,h=1000x1000 returns x:5000, y:2000
   */
  expand(point) {
    return new Point(this.w * point.x, this.h * point.y);
  }
}