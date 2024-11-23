class LayerList {
  list = {};
  static DELIM = ' ';
  static VISIBLE = [settings.SFACE]; // layers that are visible and items need placing spatially

  /**
   * Adds a new BonesList object for a given layer
   * @param {BonesList} bonesList to add, which already includes an id we use for identifying the layer   */
  add(bonesList) {
    if (this.list[bonesList.id]) {
      this.list[bonesList.id].merge(bonesList);
    } else {
      this.list[bonesList.id] = bonesList;
    }
  }

  /**
   * Returns the BonesList for the given layer
   * @param {string} layerId the id for the layer eg 's' = settings.SURFACE
   * @returns BonesList
   */
  get(layerId) {
    return this.list[layerId];
  }

  /**
   * Adds some bones to the given layer
   * @param {string} layerId the id for the layer eg 's' = settings.SURFACE
   * @param {Bones} bones to of an item to add
   */
  addBones(layerId, bones) {
    if (!this.list[layerId]) {
      this.list[layerId] = new BonesList(layerId);
    }
    this.list[layerId].add(bones);
  }

  /**
   * Returns the Bones for the given layer and bone id
   * @param {string} layerId the id for the layer eg 's' = settings.SURFACE
   * @param {string} bonesId the id for the bones eg: 'a'
   * @returns Bones
   */
  getBones(layerId, bonesId) {
    const bonesList = this.list[layerId];
    if (!bonesList || !bonesId) return;

    return bonesList.get(bonesId);
  }

  removeBones(layerId, bonesId) {
    const bonesList = this.list[layerId];
    if (bonesList) {
      bonesList.remove(bonesId);
    }
  }

  /**
   * Encodes the current list of layers and their BonesLists
   * @returns {string} the coded version of these layers and their boneLists
   */
  encode() {
    let encodedString = '';
    let delim = '';
    for (const bonesListId in this.list) {
      const bonesList = this.list[bonesListId];
      encodedString += delim;
      encodedString += bonesList.encode();
      delim = LayerList.DELIM;
    }

    return encodedString;
  }

  /**
   * Decode the string into a set of layers and their bonesLists 
   * eg: s,,ant,,,220,220;b,,bee,,,257,151 x,,cat,,,110,210;d,,dog,,,253,353
   * @param {string} encodedString 
   */
  decode(encodedString) {
    // remove all CRLF used to make the stored data easier to read
    encodedString = encodedString.replaceAll("\n", '');
    const parts = encodedString.split(LayerList.DELIM);

    for (let part of parts) {
      const name = part[0];
      const bonesList = new BonesList(name);
      bonesList.decode(part);
      this.add(bonesList);
    };
  }

  allocate() {
    // loops through all visual layers and adds them into spacial grids
    for (const layerId of LayerList.VISIBLE) {
      const bonesList = this.list[layerId];
      bonesList.allocate();
    }
  }

  render(layerId) {
    const bonesList = this.list[layerId];
    for (const boneId in bonesList.list) {
      // Create a deep copy of the bones object
      const bonesCopy = JSON.parse(JSON.stringify(bonesList.list[boneId]));
      // Update the parent property on the copy
      bonesCopy.parent = app.world;
      // Use the copy to create the Drawable
      const thing = new Drawable(bonesCopy);
      thing.show();
    }
  }

  prune(surrounds) {
    for (const layerId of LayerList.VISIBLE) {
      const bonesList = this.list[layerId];
      bonesList.prune(surrounds);
    }
  }

  merge(layerList) {
    if (!layerList) return this;
    console.log('merging layerList', layerList);
    if (!layerList instanceof LayerList) return this;
    for (const layerId in layerList.list) {
      const bonesList = layerList.list[layerId];
      this.add(bonesList);
    }
    return this; 
  }
};
