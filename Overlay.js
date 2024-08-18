class Overlay extends Rectangle {
  children = [];
  constructor(params) {
    super(params);
    this.id = params.id;
    this.setup(params);

  }

  setup(params) {
    if (!this.parent) {
      this.parent = document.querySelector(`#overlay`);
    }
    this.html = assets.getOverlayHtml(params.type);

    this.parent.insertAdjacentHTML('beforeend', this.html);
    this.it = document.querySelector(`#o${this.id}`);
    // TODO: attach events to this.it
  }
  addChild() {
    // add child overlay controls

  }
  

}