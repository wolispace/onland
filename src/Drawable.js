class Drawable extends Rectangle {
  children = [];
  lastPos = {};
  colors = {s: 'white', g: 'dodgerblue', d: 'black'};

  constructor(params) {
    super(params);
    this.id = params.id;
    this.type = params.type;
    this.variant = params.variant;
    this.parent = params.parent ?? document.querySelector(`#world`);
    this.html = params.html;
    this.setupEvents(params);
  }

  /**
   * Setup the parent, html and onclick(?) for this drawable thing
   * @param {object} params 
   */
  setupEvents(params) {
    this.onclick = params.onclick;
    this.onpointerdown = params.onpointerdown;
    this.onpointerup = params.onpointerup;

  }

  /**
   * Add this drawable object to the dom within its parent and setup interaction(?)
   */
  show() {
    if (!this.div) {
      const tmp = assets.make(this);
      this.html = tmp.html;
      this.variant = tmp.variant;
      this.boxes = {};
      this.boxes[settings.SURFACE] = tmp[settings.SURFACE];
      this.boxes[settings.GHOSTS] = tmp[settings.GHOSTS];
      this.boxes[settings.SHADOW] = tmp[settings.SHADOW];
      
      
      this.addToParent();
      // clear this from memory as we dont need it any more
      this.html = null;
      this.div = document.querySelector(`#${this.id}`);

      if (this.onclick) {
        this.div.onclick = this.onclick;
      }
      if (this.onpointerdown) {
        this.div.onpointerdown = this.onpointerdown;
      }
      if (this.onpointerup) {
        this.div.onpointerup = this.onpointerup;
      }

    }

    this.position();
  }

  addToParent() {
    this.buildParent();
    this.parent.div.insertAdjacentHTML('beforeend', this.html);
  }

  buildParent() {
    if (this.parent) {
      if (typeof this.parent == 'string') {
        this.parent = {
          id: this.parent,
          div: document.querySelector(`#${this.parent}`),
        };
        const rectangle = this.parent.div.getBoundingClientRect();
        this.parent.x = rectangle.left;
        this.parent.y = rectangle.top;
      }
    }
    // the world is always absolute position 0,0 regardless of scroll
    if (this.parent.id === 'world') {
      this.parent.x = 0;
      this.parent.y = 0;
    }
  }

  position() {
    if (!this.div) return;
    if (this.lastPos.x === this.x && this.lastPos.y === this.y) return;
    this.x = parseInt(this.x);
    this.y = parseInt(this.y);

    // remember this position
    this.lastPos.x = this.x;
    this.lastPos.y = this.y;
    let itemPos = this.copy();
    // every item is relative to its parent. since the world is 0,0 we are not changing am.me x,y
    this.buildParent();
    // clear this from memory as we don't need it any more
    this.html = null;
    this.div = document.querySelector(`#${this.id}`);
    itemPos.add(this.parent);

    this.div.style.transform = `translate3d(${itemPos.x}px, ${itemPos.y}px, 0)`;
    //console.log('position', this.parent, this);

    // z index based on vertical position
    if (this.type == 'buttons') return;
    this.div.style.zIndex = parseInt(itemPos.y);
    this.setPostcode();
    if (settings.showBoxes) {
      this.showBoxes();
    }
  }
  /**
 * Record the current suburb (postcode) for this item
 * This is used to know if the item (player) has moved suburb
 */
  setPostcode() {
    this.postcode = app.world.layers.suburbs.makeKey(this);
  }


  hide() {
    if (this.div) {
      this.div.remove();
      this.div = null;
    }
    this.children.forEach(child => child.hide());
    this.children = [];
    this.parent.hideChild(this);
  }

  size() {
    if (this.div) {
      this.div.style.width = `${this.w}px`;
      this.div.style.height = `${this.h}px`;
    }
  }


  /**
   * Add a child drawable to this drawable
   * @param {Drawable} child 
   */
  addChild(child) {
    child.parent = this;
    child.show();
    this.children.push(child);
  }

  /**
   * Remove the child from children
   */
  hideChild(child) {

  }

  showBoxes() {
    const thisDiv = document.querySelector(`#${this.id}`);

    if (thisDiv.classList.contains('collision')) return;

    thisDiv.classList.add('collision');
    // loop through the boxes and show them
    for (const layerId in this.boxes) {
      const rectangles = this.boxes[layerId];
      if (!rectangles || layerId === 'd') continue;

      for (const rectangle of rectangles) {
        thisDiv.insertAdjacentHTML('beforeend', rectangle.html());
      }
    }
  }
}