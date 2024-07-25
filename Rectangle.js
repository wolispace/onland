class Rectangle extends Vector{
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

  corners() {
    // get a point for each corner TL, TR, BR, BL
    return [
      new Point(x, y),
      new Point(x + w, y),
      new Point(x + w, y + h),
      new Point(x, y + h),
    ];
  }
}