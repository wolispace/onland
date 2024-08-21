class Item extends Drawable {
  qty = 0;
  layer = 'surface'; // what layer are we currently on
  autoShow = false;
  children = [];

  constructor(params) {
    super(params);
    this.id = params.id;
    this.type = params.type;
    this.variant = params.variant;
    this.layer = params.layer ?? 'surface';
    this.autoShow = params.autoShow;
    this.setup();
  }

  setup() {
    this.setPostcode();
    app.world.addToLayers(this);
    if (this.autoShow) {
      this.show();
    }
  }

  /**
   * Compares suburbs
   * @returns is the item in view of the player
   */
  isVisible() {
    let isVisible = true;
    if (this.id !== 'me') {
      // which suburb will this item be in
      let currentPostcode = app.world.layers.suburbs.makeKey(app.me);
      let kingsSquare = app.world.layers.suburbs.kingsSquare(currentPostcode);
      if (!kingsSquare.has(this.postcode)) {
        isVisible = false;
      };
      //console.log('isVisible', isVisible, currentPostcode, this.postcode, this.id);
    }
    return isVisible;
  }



  // all items can have child items so showing this one also shows all its children, and their children etc..
  addChild(item) {
    this.children.add(item);
  }

  removeChild(item) {
    this.children.take(item);
  }

  removeChildren() {
    this.children.clear();
  }

  addClass(className) {
    if (!this.div) return;
    this.div.classList.add(className);
  }

  removeClass(className) {
    if (!this.div) return;
    this.div.classList.remove(className);
  }

}