class Item extends Rectangle {
  id = '';
  type = '';
  variant = '';
  it;  // the element on the screen (in the world)
  qty = 0;
  layer = 'surface'; // what layer are we currently on
  parent = new Point(0, 0); // default if there is no parent item
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
    if (this.autoShow) {
      this.show();
    }
  }

  /**
   * Record the current suburb (postcode) for this item
   * This is used to know if the item (player) has moved suburb
   */
  setPostcode() {
    this.postcode = app.world.layers.suburbs.makeKey(this);
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
    }
    return isVisible;
  }

  // add the item to the world div
  /**
   * Show the item in the world
   * @returns nothing
   */
  show() {
    // its already here..
    if (this.it) {
      return;
    }

    app.world.addToLayers(this);
    // if its outside of our current view
    if (!this.isVisible()) return;

    let assetInfo = assets.get(this.type, this.variant);
    let newDiv = `<div id="i${this.id}" class="item">${assetInfo.svg}</div>`;
    app.world.add(newDiv);
    this.it = document.querySelector(`#i${this.id}`);
    this.size();
    this.position();
    this.showChildren();
  }

  /**
   * All bits of this item (shadow, hats, collision boarders)
   */
  showChildren() {
    this.children.forEach(child => {
      child.show();
    });
  }

  hide() {
    app.world.remove(this.id);
    delete this.it;
  }

  hideChildren() {
    this.children.forEach(child => {
      child.hide();
    });
  }

  size() {
    if (this.it) {
      this.it.style.width = `${this.w}px`;
      this.it.style.height = `${this.h}px`;
    }
  }

  /**
   * Change the position of this item relative to its parent
   * @returns 
   */
  position() {
    if (!this.it) return;
    let itemPos = this.copy();
    // every item is relative to its parent
    if (this.parent) {
      itemPos.add(this.parent);
    }
    this.it.style.transform = `translate3d(${itemPos.x}px, ${itemPos.y}px, 0)`;
    // z index based on vertical position
    this.it.style.zIndex = parseInt(itemPos.y);
    this.setPostcode();
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
    if (!this.it) return;
    this.it.classList.add(className);
  }

  removeClass(className) {
    if (!this.it) return;
    this.it.classList.remove(className);
  }

}