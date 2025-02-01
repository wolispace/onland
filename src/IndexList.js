/**
 * A List holds things by their id so they are easily retrieved
 */

export default class IndexList {

  list = {};

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
   * @param {any} value the default value if the list doesnt already exist 
   * @returns {Item} 
   */
  get(id, value = '') {
    // make sure the item exists 
    if (!this.has(id)) {
      this.list[id] = value;
    }
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
   * All items in the passed in (moved) list win - stomp over matching ids in the original (default) list
   * @param {ItemList} itemList 
   */
  merge(itemList) {
    for (const [key, value] of Object.entries(itemList.list)) {
      this.list[key] = value;
    }

    return this;
  }

  /**
   * Clears the list
   */
  clear() {
    this.list = {};
  }

  /**
   * Returns a copy of this list
   * @param {string} id 
   * @returns {IndexList} newList
   */
  copy(id) {
    const newList = new IndexList(id);
    newList.merge(this);
    return newList;
  }

  /**
   * Executes a function for each item in the list
   * @param {Function} functionName The function to execute on each item
   */
  forEach(functionName) {
    Object.values(this.list).forEach(functionName);
  }

  /**
   * Executes the function on each item
   * can use (item) => {} or (item, id) => {}
   * @param {function} functionName 
   */
  forOf(functionName) {
    for (const [id, item] of Object.entries(this.list)) {
      functionName(item, id);
    }
  }

  /**
   * Returns the number of items in the list
   * @returns {number}
   */
  size = () => Object.keys(this.list).length;
}