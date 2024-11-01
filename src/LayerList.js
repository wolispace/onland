class LayerList {
  list = {};
  static DELIM = ' ';
  static VISIBLE = [settings.SFACE]; // layers that are visible and items need placing spatially

  /**
   * Adds a new BonesList object for a given layer
   * @param {BonesList} bonesList to add, which already includes an id we use for identifying the layer   */
  add(bonesList) {
    // TODO: if there is already a bones list then merge this into it
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
      const bones = bonesList.list[boneId]; 
      bones.parent = app.world;
      const thing = new Drawable(bones);
      thing.show();
    }  
  }

  prune(surrounds) {
    for (const layerId of LayerList.VISIBLE) {
      const bonesList = this.list[layerId];
      bonesList.prune(surrounds);
    }
  }
};
