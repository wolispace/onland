class GameLists {
  default = new LayerList(); // loaded from disk 
  moved = new LayerList(); // loaded from local storage: augments and overrides default
  
  /**
   * Adding a new object bones to our list of moved objects
   * @param {bones} item 
   */
  add(layer, item) {
    this.moved.addBones(layer, item);
  }

  get(layer) {
    const defaultList = this.default || new LayerList();
    const movedList = this.moved || new LayerList();

    // Create a new copy before merging
    const newList = new LayerList();
    newList.merge(defaultList);
    newList.merge(movedList);
    return newList.get(layer);
  }

  /**
   * Remove from both lists. so moving an item first removes it from default then adds it into the moved list
   * @param {bones} item 
   */
  remove(layer, item) {
    this.default.removeBones(layer, item);
    this.moved.removeBones(layer, item);
  
  }

  move(layer, item) {
    this.removeBones(layer, item);
    this.addBones(layer, item);
  }

  render(layerId) {
    // merge both list into one and render the result
    const mergedList = this.default.merge(this.moved);  
    mergedList.render(layerId);
  }

  decode(encoded, set = settings.MOVED_ITEMS) {
    return this[set].decode(encoded);
  }

  encode(set = settings.MOVED_ITEMS) {
    return this[set].encode();
  }

  prune(surrounds, set = settings.MOVED_ITEMS) {
    return this[set].prune(surrounds);
  } 

  allocate(thing, set = settings.MOVED_ITEMS) {
    return this[set].allocate(thing);  
  }
}