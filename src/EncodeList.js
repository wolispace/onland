import IndexList from "./IndexList.js";

/**
 * A List holds things by their id that are encoded/decoded from storage
 */

export default class EncodeList extends IndexList {

  id = ''; // each list has an id that matched the item that owns it. Some generig lists are like the surface or underground defined in settings.js
  SEPERATOR = '|'; // how we seperate the id from the list in an encoded string
  DELIM = ';'; // how we delimit the list when encoding
  list = {};

  constructor(id = '') {
    super();
    this.id = id;
  }



  /**
   * Returns the list of items in encoded form
   * @returns {string}
   */
  encode() {
    let encodedString = this.id;
    let delim = this.SEPERATOR;
    for (const id in this.list) {
      const item = this.list[id];
      //console.log('encoding item', item);
      if (!item) continue;
     // console.trace('encoding item', item);
      encodedString += delim;
      encodedString += item.encode();
      delim = this.DELIM;
    }

    return encodedString;
  }

  /**
   * Remove newline characters and possibly other cleanups of an encoded string
   * @param {string} encodedString 
   * @returns {string}
   */
  static cleanEncodedString(encodedString) {
    return encodedString.replace(/\n/g, '').trim();
  }

  /**
     * Decodes the encoded string into the items. first part is the id of the ItemList, the rest are the items
     * @param {string} encodedString 
     */
  decode(encodedString) {
    encodedString = EncodeList.cleanEncodedString(encodedString);
    let parts = encodedString.split(this.SEPERATOR);
    this.id = parts[0].trim();
    const encodedItems = parts[1].trim();
    const items = encodedItems.split(this.DELIM);
    //console.log(this.id, items);
    for (const encodedItem of items) {
      if (encodedItem.trim() === '') continue;
      const item = this.createItem(encodedItem.trim());
      //console.log('decoding item', item);
      this.add(item);
    };
  }

  /** * Creates an item from the encoded string. * This method should be overridden by subclasses. 
   * * @param {string} encodedItem 
   * * @returns {Object} item */
  createItem(encodedItem) {
    throw new Error('createItem() must be implemented by subclasses');
  }


}