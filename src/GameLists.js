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
    let combinedList = this.default.get(layer);
    if (combinedList === undefined) {
      combinedList = new LayerList();
    }
    const temp = this.moved.get(layer);
    if (layer !== 's') {
      console.log(layer, temp, combinedList);
    }
    combinedList = combinedList.merge(temp);
    return combinedList;
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

  decode(encoded, set = 'moved') {
    console.log(set, this[set])
    return this[set].decode(encoded);
  }

  prune(surrounds, set = 'moved') {
    return this[set].prune(surrounds);
  } 

  allocate(thing, set = 'moved') {
    return this[set].allocate(thing);  
  }
}