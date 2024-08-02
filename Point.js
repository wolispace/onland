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

}