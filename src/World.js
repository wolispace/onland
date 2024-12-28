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
      //app.msg(3, '', 'stopped');
      //console.log('mover stopped', info);
    });
  }

  /**
   * 
   * @returns array of info about layers
   */
  layerDefinitions() {
    const layerDefs = {};
    layerDefs[settings.OVERHEAD] = this.cellSize;
    layerDefs[settings.RAISED] = this.cellSize;
    layerDefs[settings.SURFACE] = this.cellSize;
    layerDefs[settings.SURFACE] = this.cellSize;
    layerDefs[settings.UNDERGROUND] = this.cellSize;
    layerDefs[settings.GHOSTS] = this.cellSize;
    layerDefs[settings.SUBURBS] = this.gridSize(app.suburbSize);
    layerDefs[settings.LANDS] = this.gridSize(app.landSize);

    return layerDefs;
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
    let location = layerInfo[settings.SURFACE][0];
    if (location) {
      let collidable = location.copy().add(item);
      collidable.id = item.id;
      this.layers[settings.SUBURBS].add(collidable);
    }
    //console.log('location', location );

  }

  removeFromLayers(item) {
    const layerInfo = assets.get(item.type, item.variant);
    for (const [key, cellSize] of Object.entries(this.layerDefinitions())) {
      if (layerInfo[key]) {
        //console.log('layerInfo',key, layerInfo);
        this.layers[key].clearShape(item);
      }
    }
  }

  removeFromLayersById(id) {
    for (const [key, cellSize] of Object.entries(this.layerDefinitions())) {
      this.layers[key].removeById(id);
    }
  }


  /**
   * Returns a rectangle: square x/y
   * @param {int} defaultSize 
   * @returns 
   */
  gridSize(defaultSize) {
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
    this.div.style.backgroundColor = '#63957d'; //'seagreen';
    this.div.style.transition = 'background-color 0.5s ease';

    // make sure scrollable are is op, left as mobile tends to remember previous scroll offset
    app.scrollable.div.scrollLeft = 0;
    app.scrollable.div.scrollTop = 0;
  }

  updateBackgroundColor() {
    const colourGrid = [
      ['seagreen', 'green', 'red'],
      ['seagreen', 'white', 'seagreen'],
      ['yellow', 'maroon', 'wheat']
    ];
  
    const cellSize = app.suburbSize;
    const halfCellSize = cellSize / 2;
    const playPos = { x: app.me.x, y: app.me.y };
  
    // Calculate the player's current cell
    const currentCell = {
      x: Math.floor(playPos.x / cellSize),
      y: Math.floor(playPos.y / cellSize)
    };
  
    // Calculate the player's position within the current cell
    const playerXInCell = (playPos.x % cellSize) - halfCellSize;
    const playerYInCell = (playPos.y % cellSize) - halfCellSize;
  
    // Calculate progress (0-1) for both x and y axes
    const xProgress = (playerXInCell + halfCellSize) / cellSize;
    const yProgress = (playerYInCell + halfCellSize) / cellSize;
  
    // Get the colors of the current cell and adjacent cells
    const startColor = colourGrid[currentCell.y] && colourGrid[currentCell.y][currentCell.x] ? colourGrid[currentCell.y][currentCell.x] : 'black';
    const horizontalColor = colourGrid[currentCell.y] && colourGrid[currentCell.y][currentCell.x + 1] ? colourGrid[currentCell.y][currentCell.x + 1] : 'black';
    const verticalColor = colourGrid[currentCell.y + 1] && colourGrid[currentCell.y + 1][currentCell.x] ? colourGrid[currentCell.y + 1][currentCell.x] : 'black';
    const diagonalColor = colourGrid[currentCell.y + 1] && colourGrid[currentCell.y + 1][currentCell.x + 1] ? colourGrid[currentCell.y + 1][currentCell.x + 1] : 'black';
  
    // Convert color names to RGB values
    const colorMap = {
      red: { r: 255, g: 0, b: 0 },
      green: { r: 0, g: 255, b: 0 },
      seagreen: { r: 99, g: 149, b: 125 },
      blue: { r: 0, g: 0, b: 255 },
      yellow: { r: 255, g: 255, b: 0 },
      maroon: { r: 128, g: 0, b: 0 },
      wheat: { r: 245, g: 222, b: 179 },
      white: { r: 255, g: 255, b: 255 },
      black: { r: 0, g: 0, b: 0 }
    };
  
    const startRGB = colorMap[startColor];
    const horizontalRGB = colorMap[horizontalColor];
    const verticalRGB = colorMap[verticalColor];
    const diagonalRGB = colorMap[diagonalColor];
  
    // Interpolate between all four colors
    // First, interpolate horizontally
    const topRowColor = {
      r: startRGB.r + (horizontalRGB.r - startRGB.r) * xProgress,
      g: startRGB.g + (horizontalRGB.g - startRGB.g) * xProgress,
      b: startRGB.b + (horizontalRGB.b - startRGB.b) * xProgress
    };
  
    const bottomRowColor = {
      r: verticalRGB.r + (diagonalRGB.r - verticalRGB.r) * xProgress,
      g: verticalRGB.g + (diagonalRGB.g - verticalRGB.g) * xProgress,
      b: verticalRGB.b + (diagonalRGB.b - verticalRGB.b) * xProgress
    };
  
    // Then interpolate vertically between the results
    const r = Math.round(topRowColor.r + (bottomRowColor.r - topRowColor.r) * yProgress);
    const g = Math.round(topRowColor.g + (bottomRowColor.g - topRowColor.g) * yProgress);
    const b = Math.round(topRowColor.b + (bottomRowColor.b - topRowColor.b) * yProgress);
  
    // Set the new background color
    this.div.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
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

      let x = settings.randomItems ? utils.utils(app.world.w) : lastPos.x;
      let y = settings.randomItems ? utils.utils(app.world.h) : lastPos.y;
      let key = app.uniqueId.next();

      let itemType = 'rock';
      if (utils.utils(20) == 1) {
        itemType = 'arch';
      } else {
        if (utils.utils(2) == 1) {
          itemType = 'tree';
        }
      }
      let itemParams = { id: key, type: itemType, x: x, y: y, autoShow: true };
      const itemInfo = assets.make(itemParams);
      itemInfo.parent = this;
      const tempItem = new Item(itemInfo);
      app.items.set(tempItem);
      // increment pos grid
      lastPos.x += stepPos.x;
      if (lastPos.x > this.x) {
        lastPos.x = stepPos.x;
        lastPos.y += stepPos.y;
      }
    }
  }


  extract() {
    //loop through all suburbs and build an array of exportable data
    let exportData = {};
    for (const [key, items] of Object.entries(app.world.layers.suburbs.grid)) {
      let suburbContents = [];
      items.list.forEach(itemId => {
        const item = app.items.get(itemId);
        if (item) {
          suburbContents.push(app.encode(item));
        }
      });
      exportData[key] = suburbContents.join('^');

    }
    console.log({ exportData });
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
      const tempItem = new Item(itemInfo);
      app.items.add(tempItem);
    });

    let encodedData = app.store.encodeData(data);
    console.log('encodedData', encodedData);

    let decodedData = app.store.decodeData(encodedData);
    console.log(decodedData);
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
        utils.halfRnd(params.wobble.x),
        utils.halfRnd(params.wobble.y)
      );

      step.multiply(counter);
      pos.add(step);
      pos.add(wobble);

      let key = app.uniqueId.next();

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