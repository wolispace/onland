
import Point from './Point.js';
import Vector from './Vector.js';

export default class Rectangle extends Vector {
  w = 0;
  h = 0;

  constructor(params) {
    super(params.x ?? 0, params.y ?? 0);
    this.w = params.w;
    this.h = params.h;
  }

  copy() {
    return new Rectangle(this);
  }

  /**
   * Getter to return the centre point as a new vector
   * @returns the centre point of the rectangle
   */
  get center() {
    return new Vector(
      this.w / 2,
      this.h / 2);
  }

  /**
   * 
   * @returns an array of points for each corner in this order [TL, TR, BR, BL]
   */
  corners() {
    return [
      new Point(this.x, this.y),
      new Point(this.x + this.w, this.y),
      new Point(this.x + this.w, this.y + this.h),
      new Point(this.x, this.y + this.h),
    ];
  }

  equals(rectangle) {
    return (
      this.x === rectangle.x &&
      this.y === rectangle.y &&
      this.w === rectangle.w &&
      this.h === rectangle.h
    );
  }

}