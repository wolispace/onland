import settings from './settings.js';
import EncodeList from "./EncodeList.js";
import ItemList from "./ItemList.js";
import Hood from "./Hood.js";
import Point from "./Point.js";

/**
 * A list of one or more layers. 
 * Each layer is identified by an id and has a list of items
 * We can interact with just one or all layers via this class
 */
export default class LayerList extends EncodeList {

  constructor(id, source = '') {
    super(id, source);
    this.DELIM = '/';
    this.SEPERATOR = ':';
    // if we initialised with an encoded string, decode it to populate this list
    if (id.includes(this.SEPERATOR)) {
      this.decode(id);
    }
    // set the default cell area - can be overwritten as needed
    this.setCellArea(this.cellArea);
  }

  /**
   * Set the area of the cells eg a 1000x1000 grid with 100x100 cells has 10x10 cells
   * So this is the 100x100 so we can scale 
   * @param {Point} cellArea with x,y 
   */
  setCellArea(cellArea) {
    this.cellArea = cellArea;
  }

  /**
   * Adds a new itemList object for a given layer
   * @param {ItemList} itemList to add, which already includes an id we use for identifying the layer   
   */
  add(itemList) {
    if (itemList.id === '') return;
    if (this.list[itemList.id]) {
      this.list[itemList.id].merge(itemList);
    } else {
      this.list[itemList.id] = itemList;
    }
  }

  /**
   * Merge the items form the itemList foe each layerList
   * overwrite anything from the default list with the moved list
   * @param {LayerList} layerList 
   */
  merge(layerList) {
    for (const listId in layerList.list) {
      const itemList = layerList.get(listId);
      const thisList = this.get(listId);
      itemList.forOf((item) => {
        thisList.add(item);
      });
    }
  }

  /**
   * Adds the item into the list with a known listId eg '_s' = surface
   * @param {string} listId 
   * @param {Item} item 
   */
  addItem(listId, item) {
    if (!this.list[listId]) {
      this.list[listId] = new ItemList(listId, this.source);
    }
    this.list[listId].add(item);
  }

  /**
   * Get the item from the list when we know the list
   * @param {string} listId 
   * @param {string} itemId 
   * @returns 
   */
  getItem(listId, itemId) {
    const itemList = this.list[listId];
    if (!itemList || !itemId) return;

    return itemList.get(itemId);
  }

  /**
   * Remove the item from the list
   * @param {string} listId 
   * @param {string} itemId 
   */
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
    return new ItemList(encodedString, this.source);
  }

  /**
   * Copy this layerList - a copy only needs the id and list (I think)
   * @param {string} id 
   * @returns 
   */
  copy (id) {
    const newlayerList =  new LayerList(id, this.source);
    newlayerList.list = {... this.list};
    return newlayerList;
  }

  /**
   * Expand all items x,y in each itemList to the cellArea
   * we only do this for default loaded data so we can start each file with 0,0
   * After this, any placed or moved items are in world coords when stored in localStorage in the moved: itemLists
   * @param {string} hoodKey eg '1_1' 
   */
  expand(hoodKey) {
    const hood = new Hood(hoodKey);
    const cellArea = this.cellArea;
    const hoodOffset = hood.expandHood(cellArea);
    for (const listId in this.list) {
      const itemList = this.get(listId);
      for (const itemId in itemList.list) {
        const item = itemList.get(itemId);
        // add the hoods expanded coords to the item
        item.expand(hoodOffset);
        //this.removeItem(listId, itemId);
      }
    }
  }

  /**
   * Remove everything from this list that is in the passed in layerList
   * This is mainly done to remove moved items from the default list
   * @param {GameList} gameList 
   */
  clean(newLayerList) {
    for (const newListId in newLayerList.list) {
      const movedList = newLayerList.get(listId);
      for (const itemId in movedList.list) {
        for (const listId in this.list) {
          this.removeItem(listId, itemId);
        }
      }
    }
  }

  /**
   * Loop thught all this.list and remove all that are NOT in the hoodList array
   * @param {array} hoodList ['0_0', '1_0' ...]
   */
  prune(hoodList) {
    for (const listId in this.list) {
      const layerList = this.get(listId);
      for (const itemId in layerList) {
        const item = layerList.get(itemId);
        const hood = new Hood(item);
        if (!hoodList.includes(hood.id)) {
          this.removeItem(listId, itemId);
        }
      }
    }
  }
}
