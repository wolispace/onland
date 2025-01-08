import UniqueSet from "./UniqueSet.js";
import Hood from "./Hood.js";

export default class ImageCache extends UniqueSet {
  constructor(iterable) {
    super(iterable);
  }

    /**
   * Adds the image object based on its name
   * @param {string} fileName 
   */
  addImage(fileName) {
    const newImage = this.makeImage(fileName);
    this.add(newImage);
  }

  /**
   * 
   * @param {string} fileName 
   * @returns {Image} with the src set as the imgName 
   */
  makeImage(fileName) {
    const image = new Image();
    image.src = fileName;

    return image;
  }

  addDirectional(type) {
    const hood = new Hood('1_1');
    for ( let key of hood.list) {
      const fileName = `img/${type}_${key}.png`;
      this.addImage(fileName);
    }
  }
  

  toString() {
    const expanded = [];
    for (const img of this) {
      expanded.push(img.src);
    }
    return expanded;
  }
}