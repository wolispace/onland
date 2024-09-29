// a vector has and x and a y (so a point)
class Vector extends Point{

  constructor(x = 0, y = 0) {
    super(x, y);
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  /**
   * 
   * @returns the length of the vector
   */
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /**
   * Normalises the vector to have a magnitude of 1
   * If the vector has a magnitude of 0, it remains unchanged
   * 
   */
  normalise() {
    const magnitude = this.magnitude();
    if (magnitude > 0) {
      this.x /= magnitude;
      this.y /= magnitude;
    }
  }



  limit(maxMagnitude) {
    // this.x = Math.abs(this.x) > maxMagnitude ? Math.sign(this.x) * maxMagnitude : this.x;
    // this.y = Math.abs(this.y) > maxMagnitude ? Math.sign(this.y) * maxMagnitude : this.y;
    if (Math.abs(this.magnitude()) > maxMagnitude) {
      this.normalise();
      this.multiply(maxMagnitude);
    }
  }

}