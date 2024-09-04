// The world is what the game is played on, its a rectangle
class World extends Drawable {
  cellSize = new Rectangle({ w: 50, h: 50 }); // size of each cell within a grid
  layers = {}; // holds all the spacialHashlayers
  items = [];

  constructor(params) {
    let drawable = { id: 'world', type: 'world', w: params.w, h: params.h, parent: document.querySelector("body") };
    super(drawable);
    this.setupWorld();
  }

  setupWorld() {
    this.div = document.querySelector("#world");
    this.styleWorld();
    this.setupLayers();

    app.events.on("MOVER_STOPPED", this, info => {
      app.msg(3, '', 'stopped');
      //console.log('mover stopped', info);
    });
  }

  layerDefinitions() {
    return {
      overhead: this.cellSize, // amove we cant bump into like clouds
      raised: this.cellSize, // obstacles we can bump into when on a bridge or top of a rock
      surface: this.cellSize, // obstacles we can bump into
      underground: this.cellSize, // things we can dig up
      ghosts: this.cellSize, // items to ghost when we move behind
      suburbs: this.suburbSize(app.suburbSize), // screen spaces/zones that are loaded dynamically
      lands: app.landSize, // 
    };
  }

  setupLayers() {
    for (const [key, cellSize] of Object.entries(this.layerDefinitions())) {
      const gridRectangle = new Rectangle(this);
      this.layers[key] = new SpacialHashGrid(key, gridRectangle, cellSize);
    }
  }

  // every item has some uniqueSets they are part of a layer 'ghosts', 'surface' etc..
  addToLayers(item) {
    const layerInfo = assets.get(item.type, item.variant);
    for (const [key, cellSize] of Object.entries(this.layerDefinitions())) {
      if (layerInfo[key]) {
        //console.log('layerInfo',key, layerInfo);
        this.layers[key].addAll(item, layerInfo[key]);
      }
    }
    // we just use the x,y of the first surface collidable to locate this within a suburb
    let location = layerInfo['surface'][0];
    if (location) {
      let collidable = location.copy().add(item);
      collidable.id = item.id;
      this.layers['suburbs'].add(collidable);
    }
    //console.log('location', location );

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
    // make sure scrollable are is op, left as mobile tends to remember previous scroll offset
    app.scrollable.div.scrollLeft = 0;
    app.scrollable.div.scrollTop = 0;
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
      let key = app.store.newId();

      let itemType = 'rock';
      if (app.rnd(20) == 1) {
        itemType = 'arch';
      } else {
        if (app.rnd(2) == 1) {
          itemType = 'tree';
        }
      }
      let itemParams = { id: key, type: itemType, x: x, y: y, autoShow: true };
      const itemInfo = assets.make(itemParams);
      itemInfo.parent = this;
      this.items[key] = new Item(itemInfo);
      // increment pos grid
      lastPos.x += stepPos.x;
      if (lastPos.x > this.x) {
        lastPos.x = stepPos.x;
        lastPos.y += stepPos.y;
      }
    }
    if (app.showCollision) {
      this.layers['surface'].show();
    }
  }

  /**
   * decodes a string of data (a set of 9 suburbs) and adds them to the world
   * also populating app.world.items
   * 
   */
  load(encodedData) {
    if (!encodedData) return;
    let decodedData = this.decodeDate(encodedData);
    decodedData.forEach(item => {
      item.autoShow = true;
      const itemInfo = assets.make(item);
      itemInfo.parent = this;
      this.items[item.id] = new Item(itemInfo);
    });
  }

  extract() {
    //loop through all suburbs and build an array of exportable data
    let exportData = {};
    for (const [key, items] of Object.entries(app.world.layers.suburbs.grid)) {
      let suburbContents = [];
      items.list.forEach(itemId => {
        const item = app.world.items[itemId];
        if (item) {
          suburbContents.push(app.encode(item));
        }
      }); 
      exportData[key] = suburbContents.join('^');

    }
    console.log({exportData});
  }


  /**
   * build up some item to put on the world. can extract this as encoded data
   */
  generateSampleItems() {
    let index = 1;
    let data = [];

    let params = {
      qty: 1,
      type: 'arch',
      variant: null,
      start: new Point(200, 200),
      step: new Point(0, 100),
      wobble: new Point(20, 0),
    }
    index = this.addItem(index, params, data);

    params = {
      qty: 2,
      type: 'rock',
      variant: null,
      start: new Point(50, 150),
      step: new Point(100, 0),
      wobble: new Point(0, 0),
    }
    index = this.addItem(index, params, data);

    params = {
      qty: 3,
      type: 'river',
      variant: null,
      start: new Point(500, 170),
      step: new Point(0, 150),
      wobble: new Point(20, 30),
    }
    index = this.addItem(index, params, data);

    params = {
      qty: 4,
      type: 'tree',
      variant: null,
      start: new Point(750, 150),
      step: new Point(1, 1),
      wobble: new Point(700, 200),
    }
    index = this.addItem(index, params, data);


    data.forEach(item => {
      item.autoShow = true;
      const itemInfo = assets.make(item);
      itemInfo.parent = this;
      this.items[item.id] = new Item(itemInfo);
    });

    let encodedData = this.encodeData(data);
    console.log('encodedData', encodedData);

    let decodedData = this.decodeDate(encodedData);
    console.log(decodedData);
  }

  encodeData(data) {
    let encodedData = [];
    for (const item of data) {
      encodedData.push(app.encode(item));
    }
    return encodedData.join('^');
  }

  decodeDate(encodedString) {
    let decodedData = [];
    let itemStrings = encodedString.split('^');
    for (const item of itemStrings) {
      let decoded = app.decode(item);
      decodedData.push(decoded);
    }

    return decodedData;

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

      let key = app.store.newId();

      // add into the data array we passed in
      data.push({ id: key, type: params.type, variant: params.variant, x: pos.x, y: pos.y });
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