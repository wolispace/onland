import Point from './Point.js';
import Hood from './Hood.js';
import Area from './Area.js';
import UniqueSet from './UniqueSet.js';
import IndexList from './IndexList.js';

export default class SpacialHashGrid extends IndexList {
  grid = {};

  /**
   * 
   * @param {string} id 
   * @param {Area} area how large the grid is eg 2000x2000
   * @param {Area} size how large each cell is eg 100x100
   */
  constructor(id, area, size) {
    super('grid');
    this.id = id;
    this.area = area;
    this.size = size;
    this.setup();
  }

  setup() {
    // make a point that represents the size of each cell in x,y 
    this.areaPoint = new Point(this.area.w, this.area.h);
    // make a point that is the total rows and columns in this grid
    this.rowCols = this.makeRowCols(this.areaPoint);
  }

  /**
 * Returns the row/s and col/s of the given point within the grid
 * a grid of 1000 x 1000 with a cellSize of 10 x 10 = a 100 rows x 100 cols grid
 * Pass in 23,52 and a cell size of 10,10 will results in row,col 2,5
 * @param {Point} point with {x, y} 
 * @returns {Point} with new {x, y} 
 */
  makeRowCols(point) {
    return new Point(
      Math.floor(point.x / this.size.w),
      Math.floor(point.y / this.size.h)
    );
  }

  /**
   * 
   * Shows the grid on the world for debugging
   * @param {object} app contains the app.world 
   */
  show(app) {
    //TODO: update this to forOf()
    Object.keys(this.grid).forEach(key => {
      const hood = new Hood(key);
      hood.expandHood(this.cellSize);

      const div = `<div class="showGrid ${this.name}" 
      style="top: ${hood.y}px; left: ${hood.x}px; width:${this.cellSize.x}px; height:${this.cellSize.y}px;"></div>`;
      app.world.add(div);
    });
  }



  // the top left corner of a given cell eg '4_6'
  cellTopLeft(key) {
    const hood = new Hood(key);
    return hood.expandHood(this.cellSize);
  }

  /**
   * TODO: is this obsolete now?
   * @param {object} params has x and y in world coords that need mapping into the grid 
   * @returns {string} key key eg x=100, y= 200 returns '1_2' if the cellSize is 100
   */
  makeKey(params) {
    const hood = this.makeHood(params);
    return hood.key;
  }

  /**
   * Returns the neigbourhood this item lives in given its x and y
   * @param {object} params has x and y in world coords that need mapping into the grid 
   * @returns {Hood}  eg x=100, y= 200 returns a hood '1_2' if the cellSize is 100
   */
  makeHood(params) {
    const rowCols = this.makeRowCols(params);
    return new Hood(rowCols);
  }

  // work out the bounding box for this shape and add() points into the grid for the corners and all cells between them
  // the params must include a Rectangle and an id
  addShape(params) {
    let keys = [];
    // add each to the grid, recording the keys for each cell
    params.corners().forEach((point) => {
      
      const hood = new Hood(point);
      // record a list of keys for the corners
      keys.push(hood.key);
    });

    // read keys[0] (TL) and keys[2] (BR) to get the top, left, bottom right
    let [left, top] = Hood.breakKey(keys[0]);
    let [right, bottom] = Hood.breakKey(keys[2]);

    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        const hood = new Hood(x, y);
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

  /**
   * An item has one or more collidable objects so use each to add the item.id into the matching grid cells
   * @param {object} item with an id 
   * @param {array} colliders add the id into each cell of the grid for each collidable rectangle
   */
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

  /**
   * Adds an object with x,y and id into the cell of the grid based on its x,y position
   * @param {object} params {x,y,id}  
   * @returns key of the cell we added it into
   */
  add(params) {
    // do we want to removeById(params.id) before adding to make sure its unique?
    const hood = new Hood(params);
    return this.addToCell(hood.key, params.id);
  }

  // we know the key '3_4' and id of the item to add
  /**
   * Adds the id into the grid cell matching the key
   * @param {string} key 
   * @param {string} id 
   * @returns {string} key of the cell we added into
   */
  addToCell(key, id) {
    // TODO: convert this to an IndexList
    if (!this.grid[key]) {
      this.grid[key] = new UniqueSet();
    }
    this.grid[key].add(id);

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
    const hood = this.makeHood(params);
    let cell = this.grid[hood.key];
    if (!cell) return;
    this.grid[hood.key].delete(params.id);
  }

  /**
   * remove the id from every cell in our grid
   * @param {string} id of the item to remove  
   */
  removeById(id) {
    for (const key in this.grid) {
      this.grid[key].delete(id);
    }
  }

  removeIdFromCell(id, key) {
    if (!this.grid[key]) return;
    this.grid[key].delete(id);
  }

  // pass in a Rectangle and get its 4 corners
  getCornerCells(rectangle) {
    let cells = new UniqueSet();
    rectangle.corners().forEach((corner) => {
      const hood = new Hood(corner);
      cells.add(hood.key);
    });
    return cells.toArray();
  }

  // find all of the items in the 4 cells around the Rectangle's bounding box
  queryShape(rectangle) {
    let cells = this.getCornerCells(rectangle);
    return this.query(cells);
  }

  /**
   * 
   * @param {string} key eg '1_1' 
   * @returns {UniqueSet} of ids found in the neigbourhood (kings square) of the key
   */
  queryKingsSquare(key) {
    const hood = new Hood(key);
    return this.query(hood.list);
  }

  /**
   * Finds all ids in all cells passed in
   * @param {array} cells ['1_1', '1_2' etc..] 
   * @returns {UniqueSet} of ids found on those cells
   */
  query(cells) {
    let found = new UniqueSet();
    for (let key of cells) {
      found.addAll(this.grid[key]);
    }
    return found;
  }

  toString() {
    const expanded = {};
    for (const key in this.grid) {
      expanded[key] = this.grid[key].toArray();
    }
    return expanded;
  }
};
