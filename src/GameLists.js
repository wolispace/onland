class GameLists {
  defaultList = new LayerList();
  movedList = new LayerList();

  
  /**
   * Adding a new object bones to our list of moved objects
   * @param {bones} item 
   */
  add(layer, item) {
    this.movedList.addBones(layer, item);
  }

  /**
   * Remove from both lists. so moving an item first removes it from default then adds it into the moved list
   * @param {bones} item 
   */
  remove(layer, item) {
    this.defaultList.removeBones(layer, item);
    this.movedList.removeBones(layer, item);
  
  }

  move(layer, item) {
    this.removeBones(layer, item);
    this.addBones(layer, item);
  }

  render() {
    // merge both list into one and render the result
    const mergedList = this.defaultList.merge(this.movedList);  
    mergedList.render();
  }
}