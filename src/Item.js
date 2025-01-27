// the bare bones of items id, type, position
import Asset from "./Asset.js";
import IndexList from "./IndexList.js";
import Collidable from "./Collidable.js";

export default class Item {
  static DELIM = ','; // how encoded elements of these bones are delimited
  static ENCODED_KEYS = ['id', 'parent', 'type', 'qty', 'x', 'y'];
  id = '';
  parent = '';
  type = '';
  qty = 1;
  x = 0;
  y = 0;
  collideList = new IndexList('collidable'); // list of layers holding collidable rectangles

  // can pass in either an encoded string or an object with matching params
  constructor(params, source = '') {
    this.source = source;
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
    this.updateCollideList();

    return this;
  }

  /**
   * Updates the list of collidables for items current position
   * collidable is an indexList where each is a layer (surface, ghost)
   * containing the Collidables for each layer
   * The collidable info is relative to the items x, y 
   * so add the items x,y to the collidable 
   * @returns 
   */
  updateCollideList() {
    const asset = new Asset();
    const itemInfo = asset.get(this.type);
    if (!itemInfo.collideList) return;
    
    // loop through collidable layers
    for (let layerId in itemInfo.collideList) {
      const layer = this.collideList.get(layerId, new IndexList());
      layer.id = layerId;
      //console.log(layer);
      // loop through collidable items in this layer

      for (let collideInfo of itemInfo.collideList[layerId]) {
        const collidable = new Collidable(collideInfo);
        collidable.id = this.id;
        // expand relative x,y to absolute x,y
        collidable.add(this);
        layer.add(collidable, new IndexList());
      }
      // Add this line to save the changes back to this.collidable
      this.collideList.add(layer);
    }
  }

  /**
   * Place this item into the layers of the world
   * Since one item may have multiple collision boxes 
   * each needs to be added into the correct spacial hash grid
   * stored in gameList.layers
   * 
   * @param {GameList} gameList 
   */
  allocate(gameList) {
    // place this in spacial grid cell/s
    const itemInfo = app.asset.make(this);
    //app.world.layers[layerId].addAll(itemInfo, itemInfo[layerId]);
    gameList.layers[settings.SURFACE].addAll(itemInfo, itemInfo[settings.SURFACE]);
    gameList.layers[settings.GHOSTS].addAll(itemInfo, itemInfo[settings.GHOSTS]);
    // every visible item 
    gameList.lands[settings.LANDS].add(this);
    gameList.lands[settings.SUBURBS].add(this);

  }

}