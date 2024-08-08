class Item extends Rectangle {
  id = '';
  type = '';
  variant = '';
  it;  // the element on the screen (in the world)
  qty = 0;
  svg = '';
  surface = [];
  ghosts = [];
  autoShow = false;


  constructor(params) {
    super(params);
    this.id = params.id;
    this.type = params.type;
    this.variant = params.variant;
    this.svg = params.svg;
    this.autoShow = params.autoShow;
    this.setup(params);
  }

  setup(params) {
    this.setPostcode();
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

  setPostcode() {
    this.postcode = app.world.layers.suburbs.makeKey(this);
  }

  /**
   * 
   * @returns is the item in view of the player
   */
  isVisible() {
    let isVisible = true;
    if (this.id !== 'me') {
      // which suburb will this item be in
      let currentPostcode = app.world.layers.suburbs.makeKey(app.me);
      let itemPostcode = app.world.layers.suburbs.makeKey(this);
      let kingsSquare = app.world.layers.suburbs.kingsSquare(currentPostcode);

      //console.log('inKingsSquare?', itemPostcode, kingsSquare);
      if (!kingsSquare.has(itemPostcode)) {
        isVisible = false;
      };
    }
    return isVisible;
  }

  // add the item to the world div
  show() {
    // its already here..
    if (this.it) {
      //console.log('it exists', this);
      return;
    }

    app.world.addToLayers(this);
    // if its outside of our current view
    if (!this.isVisible()) return;

    let newSvg = `<div id="i${this.id}" class="item">${this.svg}</div>`;
    app.world.add(newSvg);
    this.it = document.querySelector(`#i${this.id}`);
    this.size();
    this.position();
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

  addClass(className) {
    if (!this.it) return;
    this.it.classList.add(className);
  }

  removeClass(className) {
    if (!this.it) return;
    this.it.classList.remove(className);
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