import Point from './Point.js';
import Rectangle from './Rectangle.js';
import Hood from './Hood.js';
import UniqueSet from './UniqueSet.js';

export default class SpacialHashGrid extends Rectangle {
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

  /**
   * Shows the grid on the world for debugging
   * @param {object} app contains the app.world 
   */
  show(app) {
    Object.keys(this.grid).forEach(key => {
      const hood = new Hood(key);
      hood.expandHood(this.cellSize);

      const div = `<div class="showGrid ${this.name}" 
      style="top: ${hood.y}px; left: ${hood.x}px; width:${this.cellSize.w}px; height:${this.cellSize.h}px;"></div>`;
      app.world.add(div);
    });
  }

  /**
   * Returns the row/s and col/s of the given point within the grid
   * a grid of 1000 x 1000 with a cellSize of 10 x 10 = a 100 rows x 100 cols grid
   * Pass in 23,52 and a cell size of 10,10 will results in row,col 2,5
   * @param {object} pos with {x, y} 
   * @returns {Point} with new {x, y} 
   */
  makeRowCols(pos) {
    return new Point(
      Math.floor(pos.x / this.cellSize.w),
      Math.floor(pos.y / this.cellSize.h)
    );
  }

  // the top left corner of a given cell eg '4_6'
  cellTopLeft(key) {
    const hood = new Hood(key);
    return hood.expandHood(this.cellSize);
  }

  /**
   * 
   * @param {object} params has x and y in world coords that need mapping into the grid 
   * @returns {string} key key eg x=100, y= 200 returns '1_2' if the cellSize is 100
   */
  makeKey(params) {
    const rowCols = this.makeRowCols(params, this.cellSize);
    return new Hood(rowCols).key;
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
    let [left, top] = Hood.breakKey(keys[0]);
    let [right, bottom] = Hood.breakKey(keys[2]);

    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        const hood = new Hood(x,y);
        this.addToCell(hood.key, params.id);
      }
    }
  }

  // clear the cells that fall within this rectangle
  clearShape(params) {
    let keys = [];
    // find 4 corners
    // add each to the grid, recording the keys for each cell
    params.corners().forEach((point) => {
      const corner = point.copy();
      keys.push(this.add(corner));
    });

    // read keys[0] (TL) and keys[2] (BR) to get the top, left, bottom right
    let [left, top] = Hood.breakKey(keys[0]);
    let [right, bottom] = Hood.breakKey(keys[2]);

    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        const hood = new Hood(x, y);
        this.removeIdFromCell(params.id, hood.key);
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

  //TODO: this wipes every id from the cell not just the item.id
  removeAll(item, colliders) {
    colliders.forEach((collide) => {
      let collidable = collide.copy().add(item);
      this.clearShape(collidable);
    });
  }

  // add a new item (its id) to the grid
  add(params) {
    // do we want to removeById(params.id) before adding to make sure its unique?
    const hood = new Hood(params); 
    return this.addToCell(hood.key, params.id);
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

  /**
   * 
   * @param {Object} params with id and x,y so we can remove it from its current grid 
   * @returns 
   */
  remove(params) {
    const hood = new Hood(params);
    let cell = this.grid[hood.key];
    if (!cell) return;
    this.grid[hood.key].take(params.id);
  }

  /**
   * remove the id from every cell in our grid
   * @param {string} id of the item to remove  
   */
  removeById(id) {
    for (const key in this.grid) {
      this.grid[key].take(id);
    }
  }

  removeIdFromCell(id, key) {
    if (!this.grid[key]) return;
    this.grid[key].take(id);
  }

  // pass in a Rectangle and get its 4 corners
  getCornerCells(rectangle) {
    let cells = new UniqueSet();
    rectangle.corners().forEach((corner) => {
      const hood = new Hood(corner);
      cells.add(hood.key);
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
    const hood = new Hood(key);
    return this.query(hood.list);
  }

  // return all itemIds in the grid cell
  query(cells) {
    let found = new UniqueSet();
    cells.forEach((key) => {
      //console.log('looking in ', key, this.grid[key]);
      found.add(this.grid[key]);
    });
    return found;
  }
};
