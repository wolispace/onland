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
      //console.log('isVisible', isVisible, currentPostcode, this.postcode, this.id);
    }
    return isVisible;
  }


  // add the item to the world div
  /**
   * Show the item in the world
   * @returns nothing
   */
  OLD_show() {
    // if its outside of our current view
    if (!this.isVisible()) {
      return;
    }
    // its already here..
    if (this.div) {
      return;
    }

    let assetInfo = assets.get(this.type, this.variant);
    let newDiv = `<div id="i${this.id}" class="item">${assetInfo.svg}</div>`;
    app.world.add(newDiv);
    this.div = document.querySelector(`#i${this.id}`);
    this.size();
    this.position();
    this.showChildren();
  }

  /**
   * All bits of this item (shadow, hats, collision boarders)
   */
  OLD_showChildren() {
    this.children.forEach(child => {
      child.show();
    });
  }

  OLD_hide() {
    app.world.remove(this.id);
    delete this.div;
  }

  OLD_hideChildren() {
    this.children.forEach(child => {
      child.hide();
    });
  }

  size() {
    if (this.div) {
      this.div.style.width = `${this.w}px`;
      this.div.style.height = `${this.h}px`;
    }
  }

  /**
   * Change the position of this item relative to its parent
   * @returns 
   */
  position() {
    if (!this.div) return;
    let itemPos = this.copy();
    // every item is relative to its parent. since the world is 0,0 we are not changing am.me x,y
    if (this.parent) {
      itemPos.add(this.parent);
    }
    this.div.style.transform = `translate3d(${itemPos.x}px, ${itemPos.y}px, 0)`;
    //console.log('position', this.parent, this);
    
    // z index based on vertical position
    this.div.style.zIndex = parseInt(itemPos.y);
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
    if (!this.div) return;
    this.div.classList.add(className);
  }

  removeClass(className) {
    if (!this.div) return;
    this.div.classList.remove(className);
  }

}