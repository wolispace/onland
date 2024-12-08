class ImageCache {
  list = {};

  constructor() {
  }

  add(imgName) {
    if (!this.list[imgName]) {
      this.list[imgName] = new Image();
      this.list[imgName].src = imgName;
    }
  }

  get(imgName) {
    return this.list[imgName];
  }


}

