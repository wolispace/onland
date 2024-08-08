// The world is what the game is played on, its a rectangle
class World extends Rectangle {
  cellSize = new Rectangle({ w: 50, h: 50 }); // size of each cell within a grid
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
  }

  gridDefinitions() {
    return {
      overhead: this.cellSize, // amove we cant bump into
      raised: this.cellSize, // obstacles we can bump into when on a bridge or top of a rock
      surface: this.cellSize, // obstacles we can bump into
      underground: this.cellSize, // things we can dig up
      ghosts: this.cellSize, // items to ghost when we move behind
      suburbs: this.suburbSize(app.suburbSize), // screen spaces/zones that are loaded dynamically
    };
  }

  setupGrids() {
    for (const [key, cellSize] of Object.entries(this.gridDefinitions())) {
      const gridRectangle = new Rectangle(this);
      this.grids[key] = new SpacialHashGrid(key, gridRectangle, cellSize);
    }
  }

  // every item has some uniqueSets they are part of 'ghosts', 'surface' etc..
  addToGrids(item) {
    for (const [key, cellSize] of Object.entries(this.gridDefinitions())) {
      if (item[key]) {
        this.grids[key].addAll(item, key);
      }
    }
    if(item.unsurface) {
      this.grids['surface'].clearAll(item, 'surface');
      console.log('unsurface');
    }
    
    this.grids['suburbs'].add(item);
  }

  suburbSize(defaultSize) {
    let size = window.innerWidth;
    size = size > window.innerHeight ? size : window.innerHeight;
    return new Rectangle({
      w: defaultSize ?? size,
      h: defaultSize ?? size,
    });
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

      let itemType = 'rock';
      if (app.rnd(20) == 1) {
        itemType = 'arch';
      } else {
        if (app.rnd(2) == 1) {
          itemType = 'tree';
        }
      }
      const itemInfo = assets.make(itemType, key, x, y, true);

      this.items[i] = new Item(itemInfo);

      // increment pos grid
      lastPos.x += stepPos.x;
      if (lastPos.x > this.x) {
        lastPos.x = stepPos.x;
        lastPos.y += stepPos.y;
      }
    }
    if (app.showCollision) {
      this.grids['surface'].show();
    }
  }

  load() {
    let index = 1;
    let data = [];

    let params = {
      qty: 2,
      type: 'arch',
      variant: null,
      start: new Point(200, 200),
      step: new Point(0, 30),
      wobble: new Point(20, 0),
    }
    index = this.addItem(index, params, data);
    
    params = {
      qty: 2,
      type: 'rock',
      variant: null,
      start: new Point(100, 170),
      step: new Point(0, 0),
      wobble: new Point(100, 100),
    }
    index = this.addItem(index, params, data);
    
    params = {
      qty: 2,
      type: 'river',
      variant: null,
      start: new Point(500, 170),
      step: new Point(0, 150),
      wobble: new Point(20, 30),
    }
    index = this.addItem(index, params, data);
    
    params = {
      qty: 2,
      type: 'tree',
      variant: null,
      start: new Point(750, 150),
      step: new Point(1, 1),
      wobble: new Point(700, 200),
    }
    index = this.addItem(index, params, data);

    
    data.forEach(item => {
      const itemInfo = assets.make(item.type, item.id, item.x, item.y, true);
      this.items[item.id] = new Item(itemInfo);
    });
  }


  /**
   * 
   * @param {*} params 
   * @returns array of items of a specific type for adding to the world
   */
  addItem(index, params, data) {
    let counter = 1;
    while (counter <= params.qty) {
      counter++;
      // make sure we start from the same point
      let pos = params.start.copy();
      let step = params.step.copy();

      const wobble = new Point(
        app.halfRnd(params.wobble.x),
        app.halfRnd(params.wobble.y)
      );

      step.multiply(counter);
      pos.add(step);
      pos.add(wobble);

      // add into the data array we passed in
      data.push({ id: index, type: params.type, variant: params.variant, x: pos.x, y: pos.y });
      index++;
    }
    return index;
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