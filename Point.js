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
    return this;
  }

  take(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
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

  isZero() {
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

}