import IndexList from "./IndexList.js";
import LayerList from "./LayerList.js";
import Asset from "./Asset.js";

/**
 * Holds the default and moved LayerLists
 * Combines into a tempory combined list used within the game 
 * Keeps lists updated to avoid duplicates
 * Also holds the SHGs for collisions (surface, ghosts etc..)
 * Keeps an index list of all items in combined for quick access
 */
export default class GameList extends IndexList {
  MOVED = 'moved';
  DEFAULT = 'default';
  COMBINED = 'combined';
  INDEX = 'index';
  LAYER = 'layer';

  grids = new IndexList('grids');
  
  constructor(id) {
    super(id);
    this.setup();
    this.asset = new Asset();
  }
  
  
  //NOTE: use this.add(layerList) to add a newly decoded layerList 'default' or 'moved'
  
  // when first setting up the gameList we run this
  setup() {
    const listNames = [this.DEFAULT, this.MOVED, this.INDEX, this.LAYER];
    for (const listName of listNames) {
      this.add(new LayerList(listName));
    }
    this.combined = new IndexList(this.COMBINED);
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
    this.combined = this.get(this.DEFAULT).copy(this.COMBINED);
    this.combined.merge(this.get(this.MOVED));
    this.combined.DELIM = 'X';
  }

  /**
   * Loops through both lists and reindexes each list
   * So whe can get the list (default or moved) an item is in when found in combined 
   */
  reindex() {
    this.reindexList(this.get(this.DEFAULT));
    this.reindexList(this.get(this.MOVED));
  }

  /**
   * Loop thought all items in all itemLists and add them into our index
   *  of itemId = {gameListId: 'default', listId: '_s'}
   * @param {LayerList} layerList 
   */
  reindexList(layerList) {
    for (const listId in layerList.list) {
      const itemList = layerList.get(listId);
      for (const itemId in itemList.list) {
        // DEBUG need our item here
        const item = itemList.list[itemId];
        const params = {
          id: item.id,
          gameListId: layerList.id,
          listId: itemList.id,
        };
        this.get(this.INDEX).add(params);
        // also allocate them into layers (and lands?)
        this.allocate(item);
      }
    }
  }

  /**
     * Adding a new item into our list of moved items
     * @param {string} listId which layer this is on eg: 's_' = surface
     * @param {Item} item
     * MAYBE app.gameList.get('moved').addItem(listId, item); 
     */
  set(listId, item) {
    this.get(this.MOVED).addItem(listId, item);
  }

  /**
   * Returns the item from the combined default and moved lists
   * @param {string} id 
   * @returns {Item}
   */
  getById(id) {
    for (const listId in this.combined.list) {
      const itemList = this.combined.list[listId];
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

  allocate(item) {
    if (!item.collideList) return;
    console.log('allocate', item.collideList.list);
    for (const layerId in item.collideList.list) {
      const colliderList = item.collideList[layerId];
      console.log(  'colliderList', layerId, colliderList);
      for (const colliderId in colliderList) {
        const collider = colliderList.get(colliderId);
        console.log('collider', collider);
        layerList.addItem(item.id, collider);
      }
      //console.log(layerId, layer);
    }
    const layerList = this.get(this.LAYER);

// // loop through all collidables layers and allocate the item into each one
//     for (const layerId in itemInfo.layers) {
//       const colliderList = itemInfo.layers[layerId];
//       for (const colliders of colliderList) {
//          console.log(collider);    
//          layerList.addItem(item.id, collider);
//       }
//       //console.log(layerId, layer);
//     }
//     // allocate each collision box in each collision layer into the matching gameList layer
  }

  /**
   * remove everything from default list that is in moved list
   */
  clean() {
    this.get(this.DEFAULT).clean(this.get(this.MOVED));
  }


}