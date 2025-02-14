
import Point from './Point.js';
import Area from './Area.js';
import UniqueSet from './UniqueSet.js';

export default class Rectangle {
  /**
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   */
  constructor(params) {
    this.position = new Point(params.x, params.y);    // Position using Point
    this.area = new Area(params.w, params.h); // Dimensions using Area
  }

  copy() {
    return new Rectangle(this);
  }

  /**
   * Getter to return the centre point as a new vector
   * @returns {Point} the centre point of the rectangle
   */
  get center() {
    return new Point(
      this.w / 2,
      this.h / 2);
  }

  /**
   * 
   * @returns an array of points for each corner in this order [TL, TR, BR, BL]
   */
  corners() {
    const cornerList = new UniqueSet();
    cornerList.add(new Point(this.x, this.y));
    cornerList.add(new Point(this.x + this.w, this.y));
    cornerList.add(new Point(this.x + this.w, this.y + this.h));
    cornerList.add(new Point(this.x, this.y + this.h));
    return cornerList;
  }

  equals(rectangle) {
    return (
      this.x === rectangle.x &&
      this.y === rectangle.y &&
      this.w === rectangle.w &&
      this.h === rectangle.h
    );
  }

  /**
   * Multiply the area by the point for calculating offsets from a grid to the world coords
   * @param {Area} area eg {w:5, h:2} 
   * @returns {Rectangle} eg: w,h=1000x1000 returns w:5000, h:2000
   */
  expand(area) {
    return new Rectangle(this.w * area.w, this.h * area.h);
  }

  /**
   * Returns true if the point is within the rectangle
   * @param {Point} point 
   * @returns {boolean}
   */
  contains(point) {
    return point.x >= this.position.x &&
      point.x <= this.position.x + this.area.w &&
      point.y >= this.position.y &&
      point.y <= this.position.y + this.area.h;
  }


}