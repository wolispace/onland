import IndexList from "./IndexList.js";
import LayerList from "./LayerList.js";
import Asset from "./Asset.js";
import SpacialHashGrid from "./SpacialHashGrid.js";

/**
 * Holds the default and moved LayerLists
 * Combines into a tempory combined list used within the game 
 * Keeps lists updated to avoid duplicates
 * Also holds the SHGs for collisions (surface, ghosts etc..)
 * Keeps an index list of all items in combined for quick access
 */
export default class GameList {
  MOVED = 'moved';
  DEFAULT = 'default';
  COMBINED = 'combined';
  INDEX = 'index';
  GRID = 'grid';
  asset = new Asset();

  constructor() {
    this.setup();
  }
  
  setup() {
    // make the Encode lists for data read from disk and memory
    let listNames = [this.DEFAULT, this.MOVED];
    for (const listName of listNames) {
      this[listName] = new LayerList(listName, listName);
    }

    // make the index lists that dont need to be encoded/decoded
    listNames = [this.COMBINED, this.INDEX, this.GRID];
    for (const listName of listNames) {
      this[listName] = new IndexList(listName);
    }
  }

  /**
   * Returns the params needed for setting up different grids
   * surface and ghost grids are 50x50, suburbs are larger
   * @param {string} layerId 
   * @returns 
   */
  gridParams(layerId) {
  return {x:50, y:50};
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
    this.combined = this.default.copy(this.COMBINED);
    this.combined.merge(this.moved);
  }

  /**
   * Loops through both lists and reindexes each list
   * So whe can get the list (default or moved) an item is in when found in combined 
   */
  reindex() {
    this.combined.forOf(
      layerList => {
        layerList.forOf(item => {
          this.index.add(item);
          this.allocate(item);
        });
      }
    );
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
    item.collideList.forOf((layerList, layerId) => {
      // make sure we have a grid for this layer
      const area = {w: 2000, h: 2000};
      const size = {w:50, h: 50};
      const newGrid = new SpacialHashGrid(layerId, area, size);
      const thisGrid = this.grid.get(layerId, newGrid);
      layerList.forOf(collider => {
        // add this collidable into the grid for layerId eg surface
        thisGrid.addShape(collider);
      });
    });
  }

  /**
   * remove everything from default list that is in moved list
   */
  clean() {
    this.get(this.DEFAULT).clean(this.get(this.MOVED));
  }


}