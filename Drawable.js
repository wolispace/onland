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
  }

  hide() {
    if (this.div) {
      this.div.remove();
    }
    this.children.forEach(child => child.hide());
    this.children = [];
    this.parent.hideChild(this);
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