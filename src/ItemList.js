import UniqueSet from "./UniqueSet";

/**
 * A list of items found in/on this layer.
 * The surface of the world, undeground, the sky, etc.
 * Also inventories of players, NPCs and chests etc
 * Adding an item into one ItemList must remove it from all other ItemLists
 * Showing the contents of a chest should show the players inventory ItemList plus the chests ItemList
 * the id should match the id of the item that holds it so if -me is the player then itemList.id = '_me'
 * So surface and underground etc should be prefixed with underscore so they do not clash with auto-generated ids '_s'
 */
export default class ItemList extends UniqueSet {
  id = ''; // each ItemList is on a layer 's' = surface, but could be a chest or an NPC inventory etc..
  static DELIM = ';';

  constructor(id = '', iterable = []) {
    super(iterable);
    this.id = id;
  }

};