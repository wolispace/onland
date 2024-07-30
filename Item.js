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
    if (this.it) {
      this.it.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
      this.it.style.zIndex = this.y;
      console.log(this.it, this.y);
      if (app.showCollision) {
        this.showCollision();
      }
    }
  }

    // add a shape that defines the collision boarder
    showCollision() {
      if (this.cl) {
        app.world.div.removeChild(this.cl);
      }
      if (this.gh) {
        app.world.div.removeChild(this.gh);
      }
  
      let html = `<div id="c${this.id}" class="collideZone" 
          style="top:${this.pos.y}px; left:${this.pos.x}px; width:${this.dims.w}px; height:${this.dims.h}px"></div>`;
       html += `<div id="g${this.id}" class="ghostZone" 
              style="top:${this.ghost.y}px; 
              left:${this.ghost.x}px; 
              width:${this.ghost.w}px; 
              height:${this.ghost.h}px">`;
      app.world.add(html);
  
      this.cl = document.querySelector(`#c${this.id}`);
      this.gh = document.querySelector(`#g${this.id}`);
    }

}