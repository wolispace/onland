// stores and loads items used in the game
// this is temporary and only contains items in the current lands
class Items {
  list = {};

  get(itemId) {
    let foundItem = this.list[itemId];
    if (foundItem) return foundItem;
  }

  set(item) {
    // work out which land this item is in
    app.world.layers.lands.add(item);
    app.world.layers.suburbs.add(item);
    this.list[item.id] = item;
  }

  setItem(parent, item, autoShow) {
    item.autoShow = autoShow;
    item.id = item.id ?? app.uniqueId.next();
    const itemInfo = assets.make(item);
    itemInfo.parent = parent;
    const tempItem = new Item(itemInfo);
    this.set(tempItem);
    return tempItem;
  }

  setItems(itemList) {
    const parent = app.world;
    const autoShow = true;
    for (const itemId in itemList) {
      const params = itemList[itemId];
      this.setItem(parent, params, autoShow);
    }
  }

  // remove an item from the current list
  /**
   * Clear the current list of items
   */
  clear() {
    this.list = {};
  }

  /**
   * break the encoded string into item and add each into out temporary ap.items
   * 
  *  @param {string} encodedData eg "rock|||100|200^tree|||200,350^..."
  * */
  setAll(encodedData) {
    if (!encodedData) return;
    let decodedData = app.store.decodeData(encodedData);
    decodedData.forEach(item => {
      item.autoShow = true;
      item.id = app.uniqueId.next();
      const itemInfo = assets.make(item);
      itemInfo.parent = app.world;
      const tempItem = new Item(itemInfo);

      this.set(tempItem);
    });
  }

  /**
   * remove all items not in the current list of lands
   * @param {array of strings} lands array ['0_0', '0_1' ...] 
   */
  removeNotIn(lands) {
    this.list = this.list.filter(item => lands.contains(item.land));
  }

  /**
   * Adds all current items to their named layer plus suburbs
   */
  addAllToGrids() {
    for (const [itemId, item] of Object.entries(this.list)) {
      const layer = item.layer ?? 'surface';
      app.world.layers[layer].add(item);
      app.world.layers['suburbs'].add(item);
    };
  }
}