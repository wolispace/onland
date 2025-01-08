// for testing our classes
import Clock from './Clock.js';
import Asset from './Asset.js';
import settings from './settings.js';
import Utils from './Utils.js';

import Point from './Point.js';
import Rectangle from './Rectangle.js';
import Store from './Store.js';
import SpacialHashGrid from './SpacialHashGrid.js';
import UniqueId from './UniqueId.js';
import UniqueSet from './UniqueSet.js';
import Hood from './Hood.js';
import ImageCache from './ImageCache.js';
import Item from './Item.js';

console.log('testing');
// all of the events..
document.addEventListener("DOMContentLoaded", function () {
  app.start();
});

const mode = 'test';

const app = {

  start() {
    app.setup();
    // app.runUniqueIdTests();
    // app.runUniqueSetTests();
    // app.runHoodTests();
    // app.runSpatialHashGridTests();
    app.runImageCacheTests();
    app.runItemTests();
    app.clock.test();
  },

  setup() {
    app.clock = new Clock('app');
    app.imageCache = new ImageCache();
    app.uniqueId = new UniqueId();
    // for testing we want to scroll the overlay
    document.querySelector('#overlay').style.overflow = 'scroll';
    document.querySelector('body').style.userSelect = 'auto';

  },

  /**
   * Test the uniqueId class can create and read unique ids as expected
  */
  runUniqueIdTests() {
    app.uniqueId.set('W');
    for (let i = 0; i < 10; i++) {
      app.uniqueId.next;
    }
    app.compare('W + 10 = g', 'g', app.uniqueId.last);

    for (let i = 0; i < 10; i++) {
      const next = app.uniqueId.next;
      this.compare(next, next, next);
    }
    app.uniqueId.set('aZ');
    app.uniqueId.next;
    app.compare('aZ + 1 = aa', 'aa', app.uniqueId.last);

    app.uniqueId.set('az');
    app.uniqueId.next;
    app.compare('az + 1 = b0', 'b0', app.uniqueId.last);

    // we cant set a previous value so get should return the last id b0
    app.uniqueId.set('x');
    app.compare('set x ignored', 'b0', app.uniqueId.last);

    for (let i = 0; i < 100_000; i++) {
      app.uniqueId.next;
    }
    app.compare('b0 + 100_000 = zbu', 'zbu', app.uniqueId.last);

    for (let i = 0; i < 100_000; i++) {
      app.uniqueId.next;
    }
    app.compare('zbu + 100_000 = aPoc', 'aPco', app.uniqueId.last);
  },

  runHoodTests() {
    app.compare('hood numbers', '2_3', new Hood(2, 3).key);
    app.compare('hood string', '2_3', new Hood('2_3').key);
    app.compare('hood Point', '2_3', new Hood(new Point(2,3)).key);

    const hoodOne = new Hood(2, 3);
    const hoodList = ['1_2', '1_3', '1_4', '2_2', '2_3', '2_4', '3_2', '3_3', '3_4'];
    app.compare('getList', hoodList, hoodOne.list);

    const hoodTwo = new Hood(-3, -1);
    app.compare('addHood', '-1_2', hoodOne.addHood(hoodTwo).key);

    app.compare('breakKey', [-3, 6], Hood.breakKey('-3_6'));

  },

  runUniqueSetTests() {
    const set1 = new UniqueSet([1, 2, 3, 4]);
    const set2 = new UniqueSet([3, 4, 5, 6]);
    const sameSet = set1.same(set2);
    app.compare('same', '[3,4]', sameSet.toString());
    const notInSet = set1.notIn(set2);
    app.compare('notIn', '[5,6]', notInSet.toString());
    const outsideSet = set1.outside(set2);
    app.compare('outside', '[1,2]', outsideSet.toString());
  },

  runSpatialHashGridTests() {
    // a grid 1000x1000 with 10x10 rows/cols cells of 100x100 each
    const cellSize = new Rectangle({ w: 100, h: 200 });
    const gridRectangle = new Rectangle({ w: 1000, h: 2000 });
    app.testGrid = new SpacialHashGrid('test', gridRectangle, cellSize);

    let params = null;
    let expected = new Point(10, 10);
    app.compare('rowCols', expected, app.testGrid.rowCols);

    let key = '4_6';
    let id = 'test_001';
    let placedKey = app.testGrid.addToCell(key, id);
    app.compare(`addToCell_1`, key, placedKey);

    expected = ["test_001"];
    app.compare(`addToCell_2`, expected, app.testGrid.grid[key].toArray());

    id = 'test_002';
    placedKey = app.testGrid.addToCell(key, id);
    expected = ["test_001", "test_002"];
    app.compare(`addToCell_3`, expected, app.testGrid.grid[key].toArray());
    
    key = ["4_6"];
    app.compare('query', expected, app.testGrid.query(key).toArray());

    key = '4_6';
    expected = ["test_001", "test_002"];
    app.compare('queryKingsSquare', expected, app.testGrid.queryKingsSquare(key).toArray());
    
    params = { id: 'test_001', x: 420, y: 1220 };
    expected = ["test_002"];
    app.testGrid.remove(params);
    app.compare(`remove`, expected, app.testGrid.grid[key].toArray());

    params = { id: 'test_002', x: 410, y: 1210 };
    expected = [];
    app.testGrid.remove(params);
    app.compare(`remove`, expected, app.testGrid.grid[key].toArray());

    app.testGrid.grid = { '0_0': new UniqueSet(['a', 'b', 'c']), '0_1': new UniqueSet(['d', 'a', 'c']) };
    expected = { "0_0": ["b", "c"], "0_1": ["d", "c"] };
    app.testGrid.removeById("a");
    app.compare('removeById', expected, app.testGrid.toString());
  },

  runImageCacheTests() {
    app.imageCache.addImage('img/rock_02.png');
    app.compare('addImage', ['http://localhost:88/img/rock_02.png'], app.imageCache.toString());

    app.imageCache.addDirectional('cubeface');
    app.compare('addImage', ['http://localhost:88/img/rock_02.png', 'http://localhost:88/img/cubeface_0_0.png', 'http://localhost:88/img/cubeface_0_1.png', 'http://localhost:88/img/cubeface_0_2.png', 'http://localhost:88/img/cubeface_1_0.png', 'http://localhost:88/img/cubeface_1_1.png', 'http://localhost:88/img/cubeface_1_2.png', 'http://localhost:88/img/cubeface_2_0.png', 'http://localhost:88/img/cubeface_2_1.png', 'http://localhost:88/img/cubeface_2_2.png'], app.imageCache.toString());
    
  },

  runItemTests() {
    app.imageCache.clear();
    const params = {
      id: 'a',
      type: 'rock_02',
      parent: '',
      qty: 1,
      x: 50,
      y: 50,
    };
    let newItem = new Item(params);
    newItem.setup(app);
    app.compare('newItem', 'rock_02', newItem.type);
    app.compare('encode', 'a,,rock_02,,50,50', newItem.encode());
    newItem = new Item('b,rock_02,tree_02,,50,60');
    newItem.setup(app);
    app.compare('newItem 2', 'tree_02', newItem.type);
    app.compare('newItem qty', 1, newItem.qty);
    app.compare('newItem parent', 'rock_02', newItem.parent);
    app.compare('imgCache ', ["http://localhost:88/img/rock_02.png","http://localhost:88/img/tree_02.png"], app.imageCache.toString());
  },

  runDialogTests() {
    const dialogParams = {
      title: 'Welcome to Onland',
      content: `
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      This is a test of the emergency broadcast system<br/>
      `,
      buttons: [
        { text: 'OK', action: () => { console.log('OK pressed'); } },
        { text: 'Cancel', action: () => { console.log('Cancel pressed'); } }
      ]
    };
    app.dlg = new Dialog(dialogParams);
  },

  /**
   * Logs output to the screen if the test is OK or a fail (expected != result)
   * @param {string} name 
   * @param {any} expected 
   * @param {any} result 
   */
  compare(name, expected, result) {
    result = JSON.stringify(result);
    expected = JSON.stringify(expected);

    if (expected === result) {
      this.log(`${name} ok`);
    } else {
      this.log(`${name} fail: expected ${expected}, but got ${result}`);
    }
  },

  /**
   * Logs the string to the browser
   * @param {string} message 
   */
  log(message) {
    document.querySelector('#overlay').innerHTML += `<p class="log">${message}</p>`;
  }


}
