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

  clear() {
    this.x = 0;
    this.y = 0;
  }

  isZero() {
    return this.x === 0 && this.y === 0;
  }

}