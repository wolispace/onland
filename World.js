// The world is what the game is played on, its a rectangle
class World extends Rectangle {
  gridSize = { w: 10, h: 10 }; // how big all the grids will be
  grids = {}; // holds all the spacialHashGrids

  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.items = [];
    this.setup();
  }

  setup() {
    this.div = document.querySelector(".world");
    this.styleWorld();
    this.setupGrids();
    this.grids['surface'].show();
  }

  gridDefinitions() {
    return {
      surface: this.gridSize, // obstacles we can bump into
      underground: this.gridSize, // things we can dig up
      overhead: this.gridSize, // amove we cant bump into
      ghosts: this.gridSize, // items to ghost when we move behind
      suburbs: this.suburbSize(app.suburbSize), // screen spaces/zones that are loaded dynamically
    };
  }

  setupGrids() {
    for (const [key, gridSize] of Object.entries(this.gridDefinitions())) {
      const gridRectangle = new Rectangle(gridSize);
      this.grids[key] = new SpacialHashGrid(gridRectangle);
    }
  }

  // every item has some grids they are part of 'ghosts', 'surface' etc..
  addToGrids(item) {
    for (const [key, gridSize] of Object.entries(this.gridDefinitions())) {
      if (item[key]) {
        this.grids[key].addAll(item[key], this.id);
      }
    }
  }

  suburbSize(defaultSize) {
    return {
      w: defaultSize ?? window.innerWidth,
      h: defaultSize ?? window.innerHeight,
    };
  }

  styleWorld() {
    this.div.style.width = `${this.w}px`;
    this.div.style.height = `${this.h}px`;
    this.div.style.backgroundColor = 'seagreen';
  }

  add(html) {
    app.world.div.insertAdjacentHTML('beforeend', html);
  }

  remove(id) {
    let element = document.querySelector(`#i${id}`);
    if (element) {
      app.world.div.removeChild(element);
    }
  }

  setPos(element, point) {
    element.style.left = `${point.x}px`;
    element.style.top = `${point.y}px`;
  }

  showCursor() {
    this.div.style.cursor = "auto";
  }

  hideCursor() {
    this.div.style.cursor = "none";
  }

  // scroll the world div so the player is in the middle of the screen if possible
  centerPlayer() {
    // Calculate the middle position of the window
    var centerX = window.innerWidth / 2;
    var centerY = window.innerHeight / 2;

    // Get the player's coordinates
    var rect = { top: app.me.y, left: app.me.x };
    // app.me.it.getBoundingClientRect();

    // Calculate the amount of scrolling
    var scrollLeft = rect.left + window.scrollX - centerX;
    var scrollTop = rect.top + window.scrollY - centerY;

    //window.scrollTo(scrollLeft, scrollTop);

    // // Scroll the world div
    app.scrollable.div.scrollLeft = scrollLeft;
    app.scrollable.div.scrollTop = scrollTop;
  }

  // fill the world with items
  populate() {
    const stepPos = new Point(144, 133);
    const lastPos = new Point(200, 200);
    let itemQty = app.itemQty;

    for (var i = 1; i < itemQty; i++) {
      
      let x = app.randomItems ? app.rnd(app.world.w) : lastPos.x;
      let y = app.randomItems ? app.rnd(app.world.h) : lastPos.y;
      let key = i;

      let itemInfo;
      switch (app.randomItems ? app.rnd(2) : 0) {
        case 0:
          itemInfo = items.makeTree(key, x, y, true);
          break;
        case 1:
          itemInfo = items.makeRock(key, x, y, true);
          break;
        case 2:
          itemInfo = items.makeDiamond(key, x, y, true);
          break;
      }

      this.items[i] = new Item(itemInfo);

      // increment pos grid
      lastPos.x += stepPos.x;
      if (lastPos.x > this.x) {
        lastPos.x = stepPos.x;
        lastPos.y += stepPos.y;
      }
    }
  }

  /*
    addItem(item) {
      this.items.push(item);
    }
  
    removeItem(item) {
      const index = this.items.indexOf(item);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    }
  
    update() {
      for (const item of this.items) {
        item.update();
      }
    }
  
    draw() {
      for (const item of this.items) {
        item.draw();
      }
    }
      */
}