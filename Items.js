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
    item.land = app.world.layers.lands.makeKey(item);

    app.world.layers.lands.addToCell(item.land, item.id)
    this.list[item.id] = item;
  }
   
  /**
   * Clear the current list of items
   */
  clear() {
    this.list = {};
  }

  load(land) {}
  /**
   * Adds all items we know about that are in the selected lands
   * @param {array|strings} lands array ['0_0', '0_1' ...] 
   */
  addFromLands(lands) {
    const itemsInLand = this.list.filter(item => lands.contains(item.land));

    itemsInLand.forEach(item => {
      app.world.layers.lands.addToCell(land, item.id)
      this.list[item.id] = item;
    })
  }

  // remove from land


}