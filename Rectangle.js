class Rectangle extends Vector {
  w = 0;
  h = 0;

  constructor(params) {
    super(params.x ?? 0, params.y ?? 0);
    this.w = params.w ?? 50;
    this.h = params.h ?? 50;
  }

  copy() {
    return new Rectangle(this);
  }

  copyWithPos(params) {
    let newRectangle = this.copy();
    newRectangle.x += params.x;
    newRectangle.y += params.y;
    return newRectangle;
  }
  
  center() {
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

  // return -1, 1 of colliding before or after the mid point or zero for no collision
  collides(otherRect) {
    // Calculate the distance between the two rectangles' centers
    var dx = (this.x + this.w / 2) - (otherRect.x + otherRect.w / 2);
    var dy = (this.y + this.h / 2) - (otherRect.y + otherRect.h / 2);
    // Compare distance with sum of half widths and heights
    if (Math.abs(dx) < (this.w / 2 + otherRect.w / 2) && Math.abs(dy) < (this.h / 2 + otherRect.h / 2)) {
      // return -1 or +1 indicating above or below, before or after centre point.
      return {
        x: this.x + this.w / 2 < otherRect.x + otherRect.w / 2 ? -1 : 1,
        y: this.y + this.h / 2 < otherRect.y + otherRect.h / 2 ? -1 : 1
      };
    }
    return { x: 0, y: 0 }; // They are not colliding
  }
}