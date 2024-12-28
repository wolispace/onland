class Postcode extends Point {

  constructor(x, y = 0) {
    // initialize the point
    super(0, 0);

    // if the first argument is a string, then split it else set the x and y values
    if (typeof x === 'string') {
      this.split(x);
    } else {
      this.set(x, y);
    }
  }

  /** 
   * @returns {string} the postcode as a string eg: '0_0
  */
  get() {
    return `${this.x}_${this.y}`;
  }

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  set(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * 
   * @param {string} code like '0_0' that is x: 0, y: 0 
   */
  split(code) {
    const bits = code.split('_');
    
      this.x = parseInt(bits[0]);
      this.y = parseInt(bits[1]);
   
  }

  /**
   * 
   * @param {Postcode} newPostcode to add to current eg '3_4' + '-1_1' = '2_5' 
   */
  add(newPostcode)  {
    this.x += newPostcode.x;
    this.y += newPostcode.y;
  }

}