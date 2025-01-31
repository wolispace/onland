/**
 * An area is the width and heigh of a rectangle. 
 */
export default class Area {

  /**
   * @param {number, object} w width of the area or a {w,h} object
   * @param {number, null} h optional height of the area defaults to w so its a square
   */
  constructor(w, h) {
    if (!w) {
      console.trace("Area needs a width", w);
    }
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

}