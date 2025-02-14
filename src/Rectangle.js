
import Point from './Point.js';
import Area from './Area.js';
import UniqueSet from './UniqueSet.js';

export default class Rectangle {
  /**
   * @param {object} {x,y,w,h}
   */
  constructor(params) {
    this.position = new Point(params.x, params.y);    // Position using Point
    this.area = new Area(params.w, params.h); // Dimensions using Area
  }

  /**
   * 
   * @returns Makes a copy of the current rectangle
   */
  copy() {
    return new Rectangle(this);
  }

  /**
   * Getter to return the centre point as a new vector
   * @returns {Point} the centre point of the rectangle
   */
  get center() {
    return new Point(
      this.area.w / 2,
      this.area.h / 2);
  }

  /**
   * 
   * @returns an array of points for each corner in this order [TL, TR, BR, BL]
   */
  corners() {
    const cornerList = new UniqueSet();
    cornerList.add(new Point(this.position.x, this.position.y));
    cornerList.add(new Point(this.position.x + this.area.w, this.position.y));
    cornerList.add(new Point(this.position.x + this.area.w, this.position.y + this.area.h));
    cornerList.add(new Point(this.position.x, this.position.y + this.area.h));
    return cornerList;
  }

  equals(rectangle) {
    return (
      this.position.x === rectangle.x &&
      this.position.y === rectangle.y &&
      this.area.w === rectangle.w &&
      this.area.h === rectangle.h
    );
  }

  /**
   * Multiply the area by the point for calculating offsets from a grid to the world coords
   * With origin x,y remaining the same
   * @param {Area} area eg {w:5, h:2} 
   * @returns {Rectangle} eg: w,h=1000x1000 returns w:5000, h:2000
   */
  expand(area) {
    return new Rectangle(this.position.x, this.position.y, this.area.w * area.w, this.area.h * area.h);
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