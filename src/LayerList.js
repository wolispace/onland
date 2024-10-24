class LayerList {
  list = {};
  static DELIM = ' ';

  /**
   * Adds a new BonesList object for a given layer
   * @param {BonesList} bonesList to add, which already includes an id we use for identifying the layer   */
  add(bonesList) {
    this.list[bonesList.id] = bonesList;
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
    const parts = encodedString.split(LayerList.DELIM);

    for (let part of parts) {
      const name = part[0];
      // remove first character from encodedString
      part = part.substring(1);
      const bonesList = new BonesList(name);
      bonesList.decode(part);
      this.add(bonesList);
    };
  }
};
