class SpacialHashGrid extends Rectangle{
  grid = {};
  rows = 0;
  cols = 0;

  constructor(rectangle) {
    super(rectangle);
    this.setup();
  }

  setup() {
    // 1000 x 1000 with a 10 cellSize gives us a 100 x 100 grid
    const rowCols = this.makeRowCols();
    this.rows = rowCols.x;
    this.cols = rowCols.y;
  }

  // show the grid
  show() {
    Object.keys(this.grid).forEach(key => {
      //const thisValue = this.surface[key];
      let parts = key.split("_");
      let left = Number(parts[0]) * this.w;
      let top = Number(parts[1]) * this.h;

      const div = `<div class="showGrid ${this.name}" style="top: ${top}px; left: ${left}px; width:${this.w}px; height:${this.h}px;"></div>`;
      app.world.add(div);
    });
  }

  makeRowCols() {
    return {
      x: Math.floor(this.x / this.w),
      y: Math.floor(this.y / this.h),
    };
  }

  // the top left corner of a given cell eg '4_6'
  cellTopLeft(key) {
    const [x, y] = key.split('_').map(Number);
    return {
      x: x * this.w,
      y: y * this.h
    };
  }

  hash(params) {
    const rowCols = this.makeRowCols(params);
    return `${rowCols.x}_${rowCols.y}`;
  }

  // returns the key and confirms the cell exists
  makeKey(params) {
    const key = this.hash(params);
    return key;
  }

  // work out the bounding box for this shape and add() points into the grid for the corners and all cells between them
  // the parmas must include a Rectangle and an id
  addShape(params) {    
    let keys = [];
    // find 4 corners
    // add each to the grid, recording the keys for each cell
    params.corners.forEach((corner) => {
      corner.id = params.id;
      keys.push(this.add(corner));
    });

    // read keys[0] (TL) and keys[2] (BR) to get the top, left, bottom right
    let [left, top] = keys[0].split('_').map(Number);
    let [right, bottom] = keys[2].split('_').map(Number);

    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        this.addToCell(`${x}_${y}`, params.id); 
      }
    }
  }

  clear() {
    this.grid = {};
  }

  addAll(collideList, id) {
    collideList.forEach((item) => {
      item.id = id;
      this.add(item);
    });
  }

  // add a new item (its id) to the grid
  add(params) {
    const key = this.makeKey(params);
    return this.addToCell(key, params.id);
  }

  // we know the key '3_4' and id of the item to add
  addToCell(key, id) {
    if (!this.grid[key]) {
      this.grid[key] = [];
    }

    if (!this.grid[key].includes(id)) {
      this.grid[key].push(id);
    }
    //console.log(this.name, key, id);
    return key;
  }

  remove(params) {
    const key = this.makeKey(params);
    if (!this.grid[key].includes(params.id)) {
      // remove the itemId from the array of this.grid[key]
      this.grid[key].remove(params.id);
    }
  }

  // update 
  update(params) {
    const key = this.makeKey(params);
  }

  // only add the item to the list if it does not exist
  addUniqueItem(list, item) {
    if (!item) {
      return list;
    }
    if (!list.includes(item)) {
      list.push(item);
    }
    return list;
  }

  // pass in a Rectangle and get its 4 corners
  getCornerCells(rectangle) {
    let cells = new UniqueSet();
    rectangle.corners.forEach((corner) => {
      const key = this.makeKey(corner);
      cells.add(key);
    });
    return cells;
  }

  // find all of the items in the 4 cells around the Rectangle's bounding box
  queryShape(rectangle) {
    let cells = this.getCornerCells(rectangle);
    return this.query(cells.list);
  }

  // return all items found in the kings square around the center suburb
  queryKingsSquare(params) {
    let suburb = app.world.suburbs.makeKey(params);
    // find the kings square around it
    let cells = app.world.suburbs.kingsSquare(suburb);
    return this.query(cells.list);
  }

  // return all itemIds in the grid cell
  query(cells) {
    let found = new UniqueSet();
    cells.forEach((key) => {
      const items = this.grid[key];
      if (items) {
        items.forEach((item) => {
          found.add(item);
        });
      }
    });
    //app.msg(1, `cells=${JSON.stringify(cells)} inCells=${JSON.stringify(found)}`);

    return found;
  }

  // return an array of kings square around and including this key
  kingsSquare(key) {
    // Split the point into row and column
    var [row, col] = key.split("_").map(Number);

    // Define the directions
    var directions = [
      [-1, -1], [-1, +0], [-1, +1], // Up-left, Up, Up-right
      [+0, -1], [+0, +0], [+0, +1], // Left,       Right
      [+1, -1], [+1, +0], [+1, +1], // Down-left, Down, Down-right
    ];

    // Initialize the result
    var cells = new UniqueSet();

    // Check each direction
    directions.forEach(([dr, dc]) => {
      var newRow = row + dr;
      var newCol = col + dc;

      // Check if the new row and column are within the grid
      if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
        var newPoint = newRow + "_" + newCol;

        // Check if the new point exists in the grid
        if (this.grid[newPoint]) {
          cells.add(newPoint);
        }
      }
    });

    return cells;
  }
}
