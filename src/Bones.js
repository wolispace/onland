// the bare bones of items id, type, position
class Bones {
  static DELIM = ','; // how encoded elements of these bones are delimited
  static ENCODED_KEYS = ['id', 'parent', 'type', 'variant', 'qty', 'x', 'y'];
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
    if (this.id === '') {
      this.id = app.uniqueId.next();
    }
    app.uniqueId.set(this.id);
  }

  /**
   * Returns an encodes string of this bones object
   * @params {boolean} includePosition should we include the x, y position? Save space when in an inventory
   * @returns {string} encoded eg 'a,,rock,,,100,200' or `b,,coin,,,55`
   */
  encode(includePosition = true) {
    let encoded = [];

    for (const key of Bones.ENCODED_KEYS) {
      let value = this[key];
      if (value === null || value === undefined || value === 'basic'
        || value === 'world' 
        || (key === 'qty' && value === 1)) {
        value = '';
      }
      if (includePosition) {
        encoded.push(value);
      } else {
        if ('xy'.indexOf(key) < 0) {
          encoded.push(value);
        }
      }
    }

    return encoded.join(Bones.DELIM);
  }

  /**
   * 
   * @param {string} encodedString 'a,rock,,,100,150'
   * @returns {object} this {id, type, variant, qty, x, y}
   */
  decode(encodedString) {
    const decodedValues = encodedString.split(Bones.DELIM);

    for (let i = 0; i < Bones.ENCODED_KEYS.length; i++) {
      const key = Bones.ENCODED_KEYS[i];
      let value = decodedValues[i];
      if (value !== '') {
        // x, y and qty are ints
        if ('xqty'.indexOf(key) > -1) {
          this[key] = parseInt(value);
        } else {
          this[key] = value;
        }
      }
    }

    return this;
  }

  allocate() {

    // place this in spacial grid cell/s
    const itemInfo = assets.make(this);
    //app.world.layers[layerId].addAll(itemInfo, itemInfo[layerId]);
    app.world.layers[settings.SURFACE].addAll(itemInfo, itemInfo[settings.SURFACE]);
    app.world.layers[settings.GHOSTS].addAll(itemInfo, itemInfo[settings.GHOSTS]);
    // every visible item 
    app.world.layers[settings.LANDS].add(this);
    app.world.layers[settings.SUBURBS].add(this);

  }

}