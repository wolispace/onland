class ImageCache {
  list = {};

  constructor() {
  }

  /**
   * Adds the image object based on its name
   * @param {string} imgName 
   */
  add(imgName) {
    if (!this.list[imgName]) {
      this.list[imgName] = new Image();
      this.list[imgName].src = imgName;
    }
  }

  /**
   * 
   * @param {string} imgName 
   * @returns the image object loaded for this file name
   */
  get(imgName) {
    return this.list[imgName];
  }

  /**
   * Scan the assets and load dirctional images for those with a .png
   */
  load() {
    for (const typeName in assets.items) {
      const variants = assets.items[typeName];
      for (const variantName in variants) {
        const variantData = variants[variantName];
        if (variantData) {
          if (variantData.mover) {
            this.directional(typeName, variantName);
          }
        }
      }
    }
  }

  /**
   * Construct all 9 variations of movement (kings square plus middle)
   * @param {string} type 
   * @param {string} variant 
   */
  directional(type, variant = 'basic') {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        this.add(`img/${type}_${variant}_${x}_${y}.png`);
      }
    }
  }

}

