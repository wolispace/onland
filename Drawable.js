class Drawable extends Rectangle {
  children = [];
  constructor(params) {
    super(params);
    this.id = params.id;
    this.type = params.type;
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
      if (!this.html) {
        const tmp = assets.make(this);
        this.html = tmp.html; 
      }
      this.parent.div.insertAdjacentHTML('beforeend', this.html);
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
    if (this.type == 'buttons') return;
    this.div.style.zIndex = parseInt(itemPos.y);
    this.setPostcode();
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

}