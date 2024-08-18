class SpacialHashGrid extends Rectangle {
  grid = {};

  constructor(name, rectangle, cellSize) {
    super(rectangle);
    this.name = name;
    this.cellSize = cellSize;
    this.setup();
  }

  setup() {
    // the whole area divided up into a cellSize grid given as a point of x,y rows and cols
    const area = new Point(this.w, this.h);
    this.rowCols = this.makeRowCols(area);
  }

  // show the grid
  show() {
    Object.keys(this.grid).forEach(key => {
      //const thisValue = this.surface[key];
      let parts = this.breakKey(key);
      let left = Number(parts[0]) * this.cellSize.w;
      let top = Number(parts[1]) * this.cellSize.h;

      const div = `<div class="showGrid ${this.name}" 
      style="top: ${top}px; left: ${left}px; width:${this.cellSize.w}px; height:${this.cellSize.h}px;"></div>`;
      app.world.add(div);
    });
  }

  // 1000 x 1000 with a 10 x 10 cellSize gives us a 100 rows x 100 cols grid
  // a rectangles x, y given a cell size results in the rows and cols to that point
  makeRowCols(pos) {
    return new Point(
      Math.floor(pos.x / this.cellSize.w), 
      Math.floor(pos.y / this.cellSize.h)
    );
  }

  // the top left corner of a given cell eg '4_6'
  cellTopLeft(key) {
    const [x, y] = this.breakKey(key);
    return new Point(
      x * this.cellSize.w,
      y * this.cellSize.h
    );
  }

  /**
   * 
   * @param {int} x 
   * @param {int} y 
   * @returns {string} has being a combination of x and y to make a unique key for a grid cell
   */
  buildKey(x, y) {
    return `${x}_${y}`;
  }

  /**
   * 
   * @param {object} params has x and y in world coords that need mapping into the grid 
   * @returns {string} key key eg x=100, y= 200 returns [1,2] if the cellSize is 100
   */
  makeKey(params) {
    const rowCols = this.makeRowCols(params, this.cellSize);
    return this.buildKey(rowCols.x, rowCols.y);
  }

  /**
   * 
   * @param {string} key 
   * @returns {array} if key = '4-6' return [4,6]
   */
  breakKey(key) {
    return key.split('_').map(Number);
  }

  // work out the bounding box for this shape and add() points into the grid for the corners and all cells between them
  // the params must include a Rectangle and an id
  addShape(params) {
    let keys = [];
    // find 4 corners
    // add each to the grid, recording the keys for each cell
    params.corners().forEach((point) => {
      let corner = point.copy();
      corner.id = params.id;
      keys.push(this.add(corner));
    });

    // read keys[0] (TL) and keys[2] (BR) to get the top, left, bottom right
    let [left, top] = this.breakKey(keys[0]);
    let [right, bottom] = this.breakKey(keys[2]);

    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        this.addToCell(this.buildKey(x, y), params.id);
      }
    }
  }

  // clear the cells that fall within this rectangle
  clearShape(params) {
    let keys = [];
    // find 4 corners
    // add each to the grid, recording the keys for each cell
    params.corners().forEach((point) => {
      let corner = point.copy();
      keys.push(this.add(corner));
    });

    // read keys[0] (TL) and keys[2] (BR) to get the top, left, bottom right
    let [left, top] = this.breakKey(keys[0]);
    let [right, bottom] = this.breakKey(keys[2]);

    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        this.clearCell(this.buildKey(x, y));
      }
    }
  }

  clear() {
    this.grid = {};
  }

  addAll(item, colliders) {
    colliders.forEach((collide) => {
      let collidable = collide.copy().add(item);
      collidable.id = item.id;
      this.addShape(collidable);
    });
  }

  clearAll(item, colliders) {
    colliders.forEach((collide) => {
      let collidable = collide.copy().add(item);
      this.clearShape(collidable);
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
      this.grid[key] = new UniqueSet();
    }
    this.grid[key].add(id);

    //console.log(this.grid[key], key, id);
    return key;
  }

  // remove all ids from this cell (eg clear a path through some collidables)
  clearCell(key) {
    this.grid[key].clear();
  }

  remove(params) {
    const key = this.makeKey(params);
    let cell = this.grid[key];
    if (!cell) return;
    this.grid[key].take(params.id);
  }

  // update 
  update(params) {
    const key = this.makeKey(params);
  }

  // pass in a Rectangle and get its 4 corners
  getCornerCells(rectangle) {
    let cells = new UniqueSet();
    rectangle.corners().forEach((corner) => {
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
  queryKingsSquare(key) {
    let cells = this.kingsSquare(key);
    return this.query(cells.list);
  }

  // return all itemIds in the grid cell
  query(cells) {
    let found = new UniqueSet();
    cells.forEach((key) => {
      //console.log('looking in ', key, this.grid[key]);
      found.merge(this.grid[key]);
    });
    return found;
  }

  // return an array of kings square around and including this key
  kingsSquare(key) {
    // Split the point into row and column
    var [col, row] = this.breakKey(key);

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
      if (newRow >= 0 && newRow < this.rowCols.y && newCol >= 0 && newCol < this.rowCols.x) {
        var newPoint = this.buildKey(newCol, newRow);
        cells.add(newPoint);
      }
    });

    return cells;
  }
}
