class Point {
  x = 0;
  y = 0;
 
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return JSON.stringify(this);
  }

  copy() {
    return new Point(this.x, this.y);
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  take(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }

  round(decimals = 2) {
    this.x = parseFloat(this.x.toFixed(decimals));
    this.y = parseFloat(this.y.toFixed(decimals));
  }

  clear() {
    this.x = 0;
    this.y = 0;
  }

  isZero() {
    return this.x === 0 && this.y === 0;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  backup() {
    this.backupPoint = this.copy();
  }

  restore() {
    this.x = this.backupPoint.x;
    this.y = this.backupPoint.y;
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

}