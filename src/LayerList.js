
import IndexList from "./IndexList.js";
import ItemList from "./ItemList.js";

/**
 * A list of one or more layers. 
 * Each layer is identified by an id and has a list of items
 * We can interact with just one or all layers via this class
 */
export default class LayerList extends IndexList {

  constructor(id) {
    super(id);
    this.DELIM = ' ';
    this.SEPERATOR = ':';
    // if we initialised with an encoded string, decode it to populate this list
    if (id.includes(this.SEPERATOR)) {
      this.decode(id);
    }
  }

  /**
 * Adds a new itemList object for a given layer
 * @param {ItemList} itemList to add, which already includes an id we use for identifying the layer   */
  add(itemList) {
    if (itemList.id === '') return;
    if (this.list[itemList.id]) {
      this.list[itemList.id].merge(itemList);
    } else {
      this.list[itemList.id] = itemList;
    }
  }

  /**
   * Adds the item inot the list with a known listId eg '_s' = surface
   * @param {string} listId 
   * @param {Item} item 
   */
  addItem(listId, item) {
    if (!this.list[listId]) {
      this.list[listId] = new ItemList(listId);
    }
    this.list[listId].add(item);
  }

  getItem(listId, itemId) {
    const itemList = this.list[listId];
    if (!itemList || !itemId) return;

    return itemList.get(itemId);
  }

  removeItem(listId, itemId) {
    const itemList = this.list[listId];
    if (itemList) {
      itemList.remove(itemId);
    }
  }

  /**
   * When decoding from LayerList we need a new ItemList
   * @param {string} encodedString 
   * @returns 
   */
  createItem(encodedString) {
    return new ItemList(encodedString);
  }

  /**
   * Remove everything from this list that is in the passed in layerList
   * This is mainly done to remove moved items from the default list
   * @param {GameList} gameList 
   */
  clean(newLayerList) {
    for (const newListId in newLayerList.list) {
      const movedList = newLayerList.list[listId];
      for (const itemId in movedList.list) {
        for (const listId in this.list) {
          this.removeItem(listId, itemId);
        }
      }
    }
  }

}