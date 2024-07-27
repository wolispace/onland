class Rectangle extends Vector {
  w = 0;
  h = 0;

  constructor(params) {
    super(params.x ?? 0, params.y ?? 0);
    this.w = params.w ?? 50;
    this.h = params.h ?? 50;
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
}