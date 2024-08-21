class Drawable extends Rectangle{
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
    this.onclick = params.onclick || function () { console.log('no click defined')};
  }
  
  /**
   * Add this drawable object to the dom within its parent and setup interaction(?)
   */
  show() {
    //console.log('showing', this);
    this.parent.div.insertAdjacentHTML('beforeend', this.html);
    this.div = document.querySelector(`#i${this.id}`);
    if (this.div) {
      this.div.onclick = this.onclick || function () { console.log('no click defined2')};
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