class Overlay extends Rectangle {
  children = [];
  constructor(params) {
    super(params);
    this.id = params.id;
    this.type = params.type;
    this.setup(params);

  }

  setup(params) {
    if (!this.parent) {
      this.parent = document.querySelector(`#overlay`);
    }
    this.html = assets.getOverlayHtml(this);
    this.onclick = params.onclick || function () { console.log('no click defined')};

  }
  
  show() {
    this.parent.insertAdjacentHTML('beforeend', this.html);
    this.it = document.querySelector(`#o${this.id}`);
    if (this.it) {
      this.it.onclick = this.onclick || function () { console.log('no click defined2')};
    }
    
  }

  addChild(childOverlay) {
    childOverlay.parent = this.it;
    childOverlay.show();
    // add child overlay controls
    this.children.push(childOverlay);
   
  }
  

}