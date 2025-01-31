export default class Point {

  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  copy() {
    return new Point(this.x, this.y);
  }

  /**
   * Adds the passed in objects x,y onto the current Points x,y
   * @param {object} point with x,y 
   * @returns 
   */
  add(point) {
    this.x += point.x;
    this.y += point.y;
    return this;
  }

  take(point) {
    this.x -= point.x;
    this.y -= point.y;
    return this;
  }

  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Returns the current point expanded out by the passed in point so 10x10 * 2x2 = 20x20
   * @param {Point} point 
   * @returns {Point}
   */
  expand(point) {
    return new Point(this.x * point.x, this.y * point.y);
  }

  round(decimals = 2) {
    this.x = parseFloat(this.x.toFixed(decimals));
    this.y = parseFloat(this.y.toFixed(decimals));
    return this;
  }

  clear() {
    this.x = 0;
    this.y = 0;
    return this;
  }

  /**
   * Getter returns true if both x and y are zero
   */
  get isZero() {
    return this.x === 0 && this.y === 0;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  backup() {
    this.backupPoint = this.copy();
    return this;
  }

  restore() {
    this.x = this.backupPoint.x;
    this.y = this.backupPoint.y;
    return this;
  }

  /**
 * 
 * @param {Point} point 
 * @returns the distance between two points
 */
  distance(point) {
    const dx = this.x - point.x;
    const dy = this.y - point.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  equals(point) {
    return this.x === point.x && this.y === point.y;
  }

}