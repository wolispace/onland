// the bare bones of items id, type, position
 export default class Item {
  static DELIM = ','; // how encoded elements of these bones are delimited
  static ENCODED_KEYS = ['id', 'parent', 'type', 'qty', 'x', 'y'];
  id = '';
  parent = '';
  type = '';
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
  
  setup(app) {
    // if no id defined then generate a unique id
    if (this.id === '') {
      this.id = app.uniqueId.next;
    }
    // record this id as in use
    app.uniqueId.set(this.id);
    // prep the image cache as we know we need this image
    app.imageCache.addImage(this.fileName);
  }

  /**
   * Expands the items x,y by the cellSize and its hood
   * An item 11,33 in hood 1_2 and cells size 1000 = 1011x2033
   * @param {Point} point 
   */
  expand(point) {
    this.x = this.x + point.x;
    this.y = this.y + point.y;
  }

  /**
   * Getter for the filename
   */
  get fileName() {
    return `img/${this.type}.png`;
  }


  /**
   * Returns an encodes string of this bones object
   * @params {boolean} includePosition should we include the x, y position? Save space when in an inventory
   * @returns {string} encoded eg 'a,,rock,,,100,200' or `b,,coin,,,55`
   */
  encode(includePosition = true) {
    let encoded = [];

    for (const key of Item.ENCODED_KEYS) {
      let value = this[key];
      if (value === null || value === undefined
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

    return encoded.join(Item.DELIM);
  }

  /**
   * 
   * @param {string} encodedString 'a,rock,,,100,150'
   * @returns {object} this {id, type, qty, x, y}
   */
  decode(encodedString) {
    const decodedValues = encodedString.split(Item.DELIM);

    for (let i = 0; i < Item.ENCODED_KEYS.length; i++) {
      const key = Item.ENCODED_KEYS[i];
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

  /**
   * Place this item into the layers of the world
   * Since one item may have multiple collision boxes each needs to be added into the correct spacial hash grid
   * 
   * @param {object} app 
   */
  allocate(app) {
    // place this in spacial grid cell/s
    const itemInfo = app.asset.make(this);
    //app.world.layers[layerId].addAll(itemInfo, itemInfo[layerId]);
    app.world.layers[settings.SURFACE].addAll(itemInfo, itemInfo[settings.SURFACE]);
    app.world.layers[settings.GHOSTS].addAll(itemInfo, itemInfo[settings.GHOSTS]);
    // every visible item 
    app.world.layers[settings.LANDS].add(this);
    app.world.layers[settings.SUBURBS].add(this);

  }

}