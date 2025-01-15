import IndexList from "./IndexList.js";
import LayerList from "./LayerList.js";

/**
 * Holds the default and moved LayerLists (maybe others?) so ise an IndexList
 * Combines into a tempory list 
 * Keeps lists updated to avoid duplicates
 */
export default class GameList extends IndexList {
  
  index = new IndexList(); // unique list of item ids and what layerList and listId they are in 
  combined = new LayerList('combined');

  //NOTE: use this.add(layerList) to add a newly decoded layerList 'default' or 'moved'

  // when first setting up the gameList we run this
  setup() {
    this.update();
  }

  /**
   * Update the combined list of items
   * and the indexes of the items
   */
  update() {
    this.combine();
    this.reindex();
  }

  /**
   * Populates the combined list with all game lists ('default' and 'moved' for starters)
   * @returns {LayerList}
   */
  combine() {
    this.combined.clear();
    for(const listId in this.list) {
      this.combined.merge(this.get(listId));
    }
  }

  /**
   * Loops through both lists and reindexes each list 
   */
  reindex() {
    for(const listId in this.list) {
      this.reindexList(this.get(listId));
    }
  }
  
  /**
   * Loop thought all items in all itemLists and add them into our index
   *  of itemId = {gameListId: 'default', listId: '_s'}
   * @param {LayerList} layerList 
   */
  reindexList(layerList) {
    for (const listId in layerList.list) {
      const itemList = layerList.get(listId);
      for (const item in itemList.list) {
        const params = {
          id: item.id,
          gameListId: layerList.id,
          listId: itemList.id,
        };
        this.index.add(params);
      }
    }
  }

  /**
     * Adding a new item into our list of moved items
     * @param {string} listId which layer this is on eg: 's_' = surface
     * @param {Item} item 
     */
  add(listId, item) {
    this.get('moved').addItem(listId, item);
  }

  /**
   * Returns the combined layer from both default and moved layerLists
   * @param {string} listId which layer this is on eg: 's_' = surface
   * @returns {LayerList}
   */
  get(listId) {
    return this.combined.get(listId);
  }

  /**
   * Returns the item from the combined default and moved lists
   * @param {string} id 
   * @returns {Item}
   */
  getById(id) {
    for (const listId in this.combined.list) {
      const itemList = this.combined.list[istId];
      for (const itemId in itemList.list) {
        if (itemId === id) {
          return itemList.list[id];
        }
      }
    }
  }

  /**
   * Remove from both lists. Used when moving from default into moved or destroying an item completely
   * @param {string} listId 
   * @param {item} item 
   */
  remove(layer, item) {
    // use the index of items to find its gameList and layerList
    const itemInfo = this.index.get(item);    
    this.get(itemInfo.gameListId).removeItem(itemInfo.listId, itemInfo.id);
  }

/**
 * Moves the item from any list into the 'moved' list
 * @param {string} layer 
 * @param {Item} item 
 */
  move(listId, item) {
    this.remove(listId, item);
    this.add(listId, item);
  }

  /**
   * Renders the layer from the combined default and moved lists
   * @param {string} listId eg '_s' = surface 
   */
  render(listId) {
    // merge both list into one and render the result
    this.combined.render(listId);
  }

  /**
   * 
   * @param {Hood.list} hoodList 
   * @returns 
   */
  prune(hoodList) {
    return this.combined.prune(hoodList);
  }

  allocate() {
    this.clean();
    this.default.allocate();
    this.moved.allocate();
  }

  /**
   * remove everything from default list that is in moved list
   */
  clean() {
    this.default.clean(this.moved);
  }


}