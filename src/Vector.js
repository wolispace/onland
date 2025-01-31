// a vector represents direction and magnitude 

export default class Vector {

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

}