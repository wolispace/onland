import Item from "./Item.js";
import EncodeList from "./EncodeList.js";

/**
 * A list of items found in/on this layer.
 * The surface of the world, undeground, the sky, etc.
 * Also inventories of players, NPCs and chests etc
 * Adding an item into one ItemList must remove it from all other ItemLists
 * Showing the contents of a chest should show the players inventory ItemList plus the chests ItemList
 * the id should match the id of the item that holds it so if -me is the player then itemList.id = '_me'
 * So surface and underground etc should be prefixed with underscore so they do not clash with auto-generated ids '_s'
 */
export default class ItemList extends EncodeList{
  
  constructor(id, source = '') {
    super(id, source);
    this.SEPERATOR = '|';
    this.DELIM = ';';
    // if we initialised with an encoded string, decode it to populate this list
    if (id.includes(this.SEPERATOR)) {
      this.decode(id);
    }
  }
  
  /**
 * Return a unique list where the types are unique and the quantity is the sum of all the quantities
 * @returns {object} a list of items with unique types - non-destructive purely visual representation of items
   eg: {rock: {type:rock, qty:3}, tree: {type:tree, qty:22}}
  */
  compact() {
    const uniqueList = {};
    for (const id in this.list) {
      const item = this.list[id];
      const key = item.type;
      if (uniqueList[key]) {
        uniqueList[key].qty += item.qty;
      } else {
        uniqueList[key] = item;
      }
    }

    return uniqueList
  }
  
  /**
   * When decoding from List we need a new Item
   * @param {string} encodedItem 
   * @returns 
   */
  createItem(encodedString) 
  { 
    return new Item(encodedString, this.source); 
  } 

  /**
   * Run the allocate() function on all items in this list
   * Allocating them to their respective layers
   */
  allocate(gameList) {
    for (const id in this.list) {
      const item = this.list[id];
      item.allocate(gameList);
    }
  }

  /**
   * TODO: do we need to prune()?
   * 
   * Remove all bones from this list that are not in the same LAND as one of the passed-in surrounds
   * @param {UniqueSet} surrounds 
   */
  prune(surrounds) {
    for (const id in this.list) {
      const item = this.list[id];
      const land = app.world.layers[settings.LANDS].makeKey(id);
      if (!surrounds.has(land)) {
        delete this.list[id];
      }
    }
  }

};