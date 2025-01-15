/**
 * A List holds things by their id so they are easily retrieved
 */

export default class IndexList {

  id = ''; // each list has an id that matched the item that owns it. Some generig lists are like the surface or underground defined in settings.js
  SEPERATOR = '|'; // how we seperate the id from the list in an encoded string
  DELIM = ';'; // how we delimit the list when encoding
  list = {};

  constructor(id = '') {
    this.id = id;
  }

  /**
   * Adds the item into the list eg: add {id:a, name=bob} = {a:{id:a, name=bob}}
   * @param {Item} item 
   */
  add(item) {
    if (!item || !item.id) return;
    this.list[item.id] = item;
  }

  /**
   * Returns the item with the matching id
   * @param {string} id 
   * @returns {Item} 
   */
  get(id) {
    return this.list[id];
  }

  /**
   * Return true if the item.id exists in the list
   * @param {string} id 
   * @returns {boolean} 
   */
  has(id) {
    return this.list[id] ? true : false;
  }

  /**
   * Removes the item with matching id and removes it from the screen if present
   * @param {string} id eg:'a' will remove {id='a', type='rock' ...}
   */
  remove(id) {
    delete this.list[id];
    // use an event to remove from the screen
    console.log('use an event to Screen.remove(id)');
    //Screen.remove(id);
  }

  /**
   * Merge the passed in ItemList with the current one
   * @param {ItemList} itemList 
   */
  merge(itemList) {
    this.list = { ...this.list, ...itemList.list };
  }

  /**
   * Clears the list
   */
  clear() {
    this.list = {};
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
    encodedString = IndexList.cleanEncodedString(encodedString);
    let parts = encodedString.split(this.SEPERATOR);
    this.id = parts[0].trim();
    const encodedItems = parts[1].trim();
    const items = encodedItems.split(this.DELIM);
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