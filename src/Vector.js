// a vector represents direction and magnitude 

export default class Vector {

  static decimals = 4;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * 
   * @returns {Vector}  a copy of the Vector
   */
  copy() {
    return new Vector(this.x, this.y);
  }

  /**
   * Getter for the magnitude of this vector
   * @returns {number} the length of the vector
   */
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /**
   * Normalises this vector to have a magnitude of 1
   * If the vector has a magnitude of 0, it remains unchanged
   */
  normalise() {
    const magnitude = this.magnitude();
    if (magnitude > 0) {
      this.x /= magnitude;
      this.y /= magnitude;
    }
    return this;
  }

  /**
   * Limit this vector to a maximum magnitude
   * @param {number} maxMagnitude 
   */
  limit(maxMagnitude) {
    if (Math.abs(this.magnitude()) > maxMagnitude) {
      this.normalise();
      this.multiply(maxMagnitude);
    }
  }

  /**
   * Multipiles the current vector by another vector or a number
   * @param {Vector or number} vector 
   */
  multiply(vector) {
    if (typeof vector === 'number') {
      this.x *= vector;
      this.y *= vector;
    } else {
      this.x *= vector.x;
      this.y *= vector.y;
    }
    return this;
  }

  scale(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }



  /**
   * Adds another vector to this vector
   * @param {Vector} vector 
   * @returns 
   */
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  round(decimals) {
    this.decimals = decimals ?? this.decimals;
    const factor = Math.pow(10, this.decimals);
    this.x = Math.round(this.x * factor) / factor;
    this.y = Math.round(this.y * factor) / factor;
    this.roundDownToZero();
    return this; // add return for method chaining
  }

  /**
   * 
   * @returns Set either x or y to zero if close, and return true if both zero
   */
  roundDownToZero() {
    const epsilon = 2 / Math.pow(10, this.decimals);
    if (Math.abs(this.x) <= epsilon) {
      this.x = 0;
    }
    if (Math.abs(this.y) <= epsilon) {
      this.y = 0;
    }
  }

  isZero() {
    return this.x === 0 && this.y === 0;
  }

}