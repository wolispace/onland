// a vector has and x and a y (so a point)
class Vector extends Point{

  constructor(x = 0, y = 0) {
    super(x, y);
  }

  copy() {
    return new Vector(this.x, this.y);
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

  // how long is the vector?
  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  // Normalises the vector to have a magnitude of 1
  // If the vector has a magnitude of 0, it remains unchanged
  normalise() {
    const magnitude = this.magnitude();
    if (magnitude > 0) {
      this.x /= magnitude;
      this.y /= magnitude;
    }
  }

  /**
   * 
   * @param {*} vector 
   * @returns 
   */
  distance(vector) {
    const dx = this.x - vector.x;
    const dy = this.y - vector.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  round(decimals = 2) {
    this.x = parseFloat(this.x.toFixed(decimals));
    this.y = parseFloat(this.y.toFixed(decimals));
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  limit(maxMagnitude) {
    // this.x = Math.abs(this.x) > maxMagnitude ? Math.sign(this.x) * maxMagnitude : this.x;
    // this.y = Math.abs(this.y) > maxMagnitude ? Math.sign(this.y) * maxMagnitude : this.y;
    if (Math.abs(this.magnitude()) > maxMagnitude) {
      this.normalise();
      this.multiply(maxMagnitude);
    }
  }

  backup() {
    this.backupPoint = { x: this.x, y: this.y };
  }

  restore() {
    this.x = this.backupPoint.x;
    this.y = this.backupPoint.y;
  }
}