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
      surface: this.cellSize, // obstacles we can bump into
      underground: this.cellSize, // things we can dig up
      overhead: this.cellSize, // amove we cant bump into
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
        //console.log(item);
        this.grids[key].addAll(item, key);
      }
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


    let maxItems = index + 20;
    while(index < maxItems) {
      const wobble = app.rnd(20) - 10;
      data.push({ id: index, type: 'arch', x: 200 + wobble, y: 200 + index * 30 });
      index++;
    }

    maxItems = index + 20;
    while(index < maxItems) {
      const centre = {
        x: 100,
        y: 170
      }
      const wobble = {
        x: app.rnd(100) - 50, 
        y: app.rnd(100) - 50};
      data.push({ id: index, type: 'rock', x: centre.x + wobble.x, y: centre.y + wobble.y });
      index++;
    }

    maxItems = index + 20;
    while(index < maxItems) {
      const centre = {
        x: 550,
        y: 150
      }
      const wobble = {
        x: app.rnd(500) - 250, 
        y: app.rnd(200) - 100};
      data.push({ id: index, type: 'tree', x: centre.x + wobble.x, y: centre.y + wobble.y });
      index++;
    }


    data.forEach(item => {
      const itemInfo = assets.make(item.type, item.id, item.x, item.y, true);
      this.items[item.id] = new Item(itemInfo);
    });
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