// for testing our classes
import settings from './settings.js';
import Clock from './Clock.js';
import Asset from './Asset.js';
import Utils from './Utils.js';
import Vector from "./Vector.js";
import Point from './Point.js';
import Rectangle from './Rectangle.js';
import Store from './Store.js';
import SpacialHashGrid from './SpacialHashGrid.js';
import UniqueId from './UniqueId.js';
import UniqueSet from './UniqueSet.js';
import Hood from './Hood.js';
import Area from "./Area.js";
import ImageCache from './ImageCache.js';
import Item from './Item.js';
import ItemList from './ItemList.js';
import LayerList from './LayerList.js';
import IndexList from './IndexList.js';
import Event from './Event.js';
import Screen from './Screen.js';

console.log('testing');
// all of the events..
document.addEventListener("DOMContentLoaded", function () {
  app.start();
});

const mode = 'test';

const app = {

  start() {
    app.setup();
    // app.testUniqueId();
    // app.testUniqueSet();
    // app.testHood();
    // app.testArea();
    // app.testSpatialHashGrid();
    // app.testImageCache();
    // app.testItem();
    // app.testItemList();
    // app.testLayerList();
    // app.testStore();
    // app.testPoint();
    // app.testVector();
    app.testEvent();
    //app.testScreen();
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
  testUniqueId() {
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

  testHood() {
    app.compare('hood numbers', '2_3', new Hood(2, 3).key);
    app.compare('hood string', '2_3', new Hood('2_3').key);
    app.compare('hood Point', '2_3', new Hood(new Point(2,3)).key);
    app.compare('hood any', '2_3', new Hood({x:2, y:3}).key);

    const hoodOne = new Hood(2, 3);
    const hoodList = ['1_2', '1_3', '1_4', '2_2', '2_3', '2_4', '3_2', '3_3', '3_4'];
    app.compare('getList', hoodList, hoodOne.list);

    const hoodTwo = new Hood(-3, -1);
    app.compare('addHood', '-1_2', hoodOne.addHood(hoodTwo).key);

    app.compare('breakKey', [-3, 6], Hood.breakKey('-3_6'));

    const cellSize = new Area(settings.cellSize);
    hoodOne.set(2,5);
    hoodOne.setCoords(cellSize);
    app.compare('set coords', {x:2000,y:5000}, hoodOne.coords);
    
  


  },

  testArea() {
    const area1 = new Area(1000, 1000);
    //app.compare('multiply', {x:2000,y:5000}, area1.expand({x:2,y:5}));


  },

  testUniqueSet() {
    const set1 = new UniqueSet([1, 2, 3, 4]);
    const set2 = new UniqueSet([3, 4, 5, 6]);
    const sameSet = set1.same(set2);
    app.compare('same', '[3,4]', sameSet.toString());
    const notInSet = set1.notIn(set2);
    app.compare('notIn', '[5,6]', notInSet.toString());
    const outsideSet = set1.outside(set2);
    app.compare('outside', '[1,2]', outsideSet.toString());
  },

  testSpatialHashGrid() {
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

  testImageCache() {
    app.imageCache.addImage('img/rock_02.png');
    app.compare('addImage', ['http://localhost:88/img/rock_02.png'], app.imageCache.toString());

    app.imageCache.addDirectional('cubeface');
    app.compare('addImage', ['http://localhost:88/img/rock_02.png', 'http://localhost:88/img/cubeface_0_0.png', 'http://localhost:88/img/cubeface_0_1.png', 'http://localhost:88/img/cubeface_0_2.png', 'http://localhost:88/img/cubeface_1_0.png', 'http://localhost:88/img/cubeface_1_1.png', 'http://localhost:88/img/cubeface_1_2.png', 'http://localhost:88/img/cubeface_2_0.png', 'http://localhost:88/img/cubeface_2_1.png', 'http://localhost:88/img/cubeface_2_2.png'], app.imageCache.toString());
    
  },

  testItem() {
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

  testItemList() {
    const list1 = new ItemList('list1');
    let newItem = new Item('b,rock_02,tree_02,,50,60');
    list1.add(newItem);
    let foundItem = list1.get('b');
    app.compare('add', foundItem, newItem);
    newItem = new Item('c,,rock_02,,30,90');
    list1.add(newItem);
    app.compare('encode', 'list1|b,rock_02,tree_02,,50,60;c,,rock_02,,30,90', list1.encode());

    const encodedString = '_s|x,,tree_02,,50,60;y,,rock_02,,30,90';
    const list2 = new ItemList('_s');
    list2.decode(encodedString);
    foundItem = list2.get('x');
    app.compare('decode', 'tree_02', foundItem.type);

  },

  testLayerList() {
    const list1 = new LayerList('test');
    let newItem = new Item('a,,rock_02,,20,30');
    let layerId = '_s';
    list1.addItem(layerId, newItem);
    let foundItem = list1.getItem(layerId, 'a');
    app.compare('add', foundItem, newItem);
    app.compare('decode', 'test:_s|a,,rock_02,,20,30',list1.encode());
    list1.clear();
    app.compare('clear', {}, list1.list);

    let encodedString = `moved:
_s|a,,tree_02,,50,60;b,,rock_02,,30,90/
_u|x,,coal_02,,50,60;y,,gem_02,,30,90
`;

    list1.decode(encodedString);
    // so we are compared the same formatted/cleaned encoded strings
    encodedString = IndexList.cleanEncodedString(encodedString);
    let encodedAgain = list1.encode();
    app.compare('decoded', encodedString, encodedAgain);

    // expand the x,y of items in this layerList for world coords
    list1.expand('1_3');
    encodedAgain = list1.encode();

    encodedString = `moved:
_s|a,,tree_02,,1050,3060;b,,rock_02,,1030,3090/
_u|x,,coal_02,,1050,3060;y,,gem_02,,1030,3090
    `;
    encodedString = IndexList.cleanEncodedString(encodedString);
    app.compare('expand', encodedString, encodedAgain);
    
  },

  testStore() {
    app.store = new Store();
    const key1 = 'a';
    const value1 = 'bingo';
    app.store.set(key1, value1);
    app.compare('get/set store', value1, app.store.get(key1));
    const key2 = 'b';
    const value2 = 'bongo';
    app.store.set(key2, value2);
    app.compare('get/set store', value2, app.store.get(key2));
    app.store.remove(key1);
    app.compare('remove', null, app.store.get(key1));
    app.store.clear();
    app.compare('clear', null, app.store.get());
  },

  testScreen() {
    Screen.add('<div class="log" id="_test1">Screen add ok</div>', 'overlay');
    Screen.add('<div class="log" id="_test2">Screen remove fail</div>', 'overlay');

    app.compare('screen add', {}, Screen.getElement('_test1'));
    Screen.remove('_test2');
    app.compare('screen remove', null , Screen.getElement('_test2'));

  },

  testDialog() {
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

  testPoint() {
    const point1 = new Point(1, 1);
    const point2 = new Point(2, 2);
    const point3 = point1.copy().add(point2);
    app.compare('point add', 3, point3.x);
    app.compare('point add', {x:1, y:4}, point3.add({x:-2, y:1}));
    point2.backup();
    point2.take(point1);
    app.compare('take', 1, point2.x);
    app.compare('equals', true, point1.equals(point2));
    point2.restore();
    app.compare('restore', 2, point2.x);
    const dist = point1.distance(point2);
    app.compare('distance', 1.4142135623730951, dist);

  },

  testVector() {
    const vec1 = new Vector(1,1);
    const vec2 = new Vector(100,100);

    app.compare('vector mag', 1.4142135623730951, vec1.magnitude());
    vec1.normalise();
    app.compare('vector norm', 0.9999999999999999, vec1.magnitude());
    app.compare('vector x', 0.7071067811865475, vec1.x);
    
    vec2.limit(50);
    app.compare('limit', {"x":35.35533905932737,"y":35.35533905932737}, vec2);

  },

  testEvent() {
    app.event = new Event();

    // emit events when key up or down are triggered
    // anything listening to these
    document.addEventListener("keydown", (event) => {
      app.event.emit('KEY_DOWN', event.key);
    });
    document.addEventListener("keyup", (event) => {
      app.event.emit('KEY_UP', event.key);
    });

    const mainPoint = new Point(1, 1);
    const point2 = new Point(2, 2);

    // we will add point2 into mainPoint
    app.event.on('ADD_POINTS', mainPoint, (pointToAdd) => {
      mainPoint.add(pointToAdd);
      app.compare('event add', {x:3,y:3}, mainPoint);
    });

    app.compare('before event?', {x:1, y:1}, mainPoint);
    app.event.emit('ADD_POINTS', point2);
    app.compare('after event?', {x:3, y:3}, mainPoint);
    
    // put a div on the screen for testing keypresses
    Screen.add('<div class="log" id="_key">KEY??</div>', 'overlay');
    const screenKey = Screen.getElement('_key');
    
    // a test object with functions that respond to events 
    const testObj = {
      keyDown: (eventKey) => {
        screenKey.innerHTML = `${eventKey} down`;
      },
      keyUp: (eventKey) => {
        screenKey.innerHTML = `${eventKey} up`;
      }   
    };
    
    // when the events are fired, run the relevent functions
    app.event.on('KEY_DOWN', testObj, testObj.keyDown);
    app.event.on('KEY_UP', testObj, testObj.keyUp);

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
      this.log(`${name} fail: expected <br/>${expected}, but got <br/>${result}`);
    }
  },

  /**
   * Logs the string to the browser
   * @param {string} message 
   */
  log(message) {
    Screen.add(`<p class="log">${message}</p>`, 'overlay');
  }


}
