// the bare bones of items id, type, position
class Bones {
  delim = ','; // how encoded elements of these bones are delimited
  encodeKeys = ['id', 'parent', 'type', 'variant', 'qty', 'x', 'y'];
  id = '';
  parent = '';
  type = '';
  variant = 'basic';
  qty = 1;
  x = 0;
  y = 0;

  // can pass in either an encoded string or an object with matching params
  constructor(params) {
    // if we initialise with an encodes string, decode it otherwise set the params id = id etc..
    if (typeof params == 'string') {
      this.decode(params);
    } else {
      for (let key in params) {
        this[key] = params[key];
      };
    }
  }

  /**
   * Returns an encodes string of this bones object
   * @returns {string} encoded eg 'a,rock,,,100,200'
   */
  encode() {
    let encoded = [];
    for (key in this.encodeKeys) {
      let value = item[key];
      if (value === null || value === undefined || value === 'basic' || value === 'surface') {
        value = '';
      }
      encoded.push(value);
    }

    return encoded.join(this.delim);
  }

  /**
   * 
   * @param {string} encodedString 'a,rock,,,100,150'
   * @returns {object} this {id, type, variant, qty, x, y}
   */
  decode(encodedString) {
    const decodedValues = encodedString.split(this.delim);

    for (let i = 0; i < this.encodeKeys.length; i++) {
      const key = this.encodeKeys[i];
      let value = decodedValues[i];
      if (value !== '') {
        if ('xqty'.indexOf(key) > -1) {
          this[key] = parseInt(value);
        } else {
          this[key] = value;
        }
      }

    }

    return this;
  }

}