class Item extends Rectangle {
  id = '';
  it;  // the element on the screen (in the world)
  qty = 0;
  svg = '';
  surface = [];
  ghosts = [];
  autoShow = false;


  constructor(params) {
    super(params);
    this.id = params.id;
    this.svg = params.svg;
    this.autoShow = params.autoShow;
    this.setup(params);
  }

  setup(params) {
    this.setupCollisions(params);
    this.setupGhosts(params);
    if (this.autoShow) {
      this.show();
    }
  }

  setupCollisions(params) {
    // make the collision boxes
    params.collisions.forEach((collisionParams) => {
      const collision = new Collidable(collisionParams);
      this.surface.push(collision);
    });
  }

  setupGhosts(params) {
    // make the ghost collision boxes
    params.ghosts.forEach((ghostParams) => {
      const ghost = new Collidable(ghostParams);
      this.ghosts.push(ghost);
    });
  }

  // add the item to the world div
  show() {
    if (this.it) {
      // its already here..
    } else {
      let newSvg = `<div id="i${this.id}" class="item">${this.svg}</div>`;
      app.world.add(newSvg);
      this.it = document.querySelector(`#i${this.id}`);
      this.size();
      this.position();
      app.world.addToGrids(this);
    }
  }

  hide() {
    app.world.remove(this.id);
    delete this.it;
  }

  size() {
    if (this.it) {
      this.it.style.width = `${this.w}px`;
      this.it.style.height = `${this.h}px`;
    }
  }

  position() {
    if (!this.it) return;
    this.it.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    this.it.style.zIndex = parseInt(this.y);
    if (app.showCollision) {
      this.showCollision();
    }
  }

  /**
 * Add the html into the items div at the end - eg collision boxes
 * @param {string} html 
 */
  addChild(html) {
    if (!this.it) return;
    this.it.insertAdjacentHTML('beforeend', html);
  }

  /**
   * Remove all child items from this item that match the childSelector
   * @param {string} childrenSelector 
   */
  removeChildren(childrenSelector) {
    if (!this.it) return;
    let children = this.it.querySelectorAll(childrenSelector);
    children.forEach(child => this.it.removeChild(child));
  }


  // add a shape that defines the collision boarders and ghost borders
  showCollision() {
    this.removeChildren('.collideZone');

    this.surface.forEach((collider) => {
      this.addChild(collider.html());
    });

    this.ghosts.forEach((collider) => {
      this.addChild(collider.html());
    });
  }
}