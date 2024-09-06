// for testing our classes
document.addEventListener("DOMContentLoaded", function () {
  app.start();
});

let app = {

  start() {
    app.setup();
    //app.runLocationTests();
    app.runStorageTests();
  },

  setup() {
    // const cellSize = new Rectangle({ w: 100, h: 200 });
    // const gridRectangle = new Rectangle({ w: 1000, h: 2000 });
    
    // app.testGrid = new SpacialHashGrid('test', gridRectangle, cellSize);
    app.store = new Store();
    app.uniqueId = new UniqueId();
  },

  runTests() {
    let params = null;
    let expected = new Point(10, 10);
    let result = app.testGrid.rowCols;
    if (result.equals(expected)) {
      console.log('rowCols ok');
    } else {
      console.log(expected, app.testGrid.rowCols);
    }

    params = { x: 4, y: 6 };
    expected = '4_6';
    app.compare('buildKey', expected, app.testGrid.buildKey(params.x, params.y));
  
    params = { x: 14, y: 4 };
    expected = '14_4';
    app.compare('buildKey', expected, app.testGrid.buildKey(params.x, params.y));

    params = { x: 0, y: 0 };
    expected = '0_0';
    app.compare('makeKey', expected, app.testGrid.makeKey(params));
    
    params = { x: 80, y: 250 };
    expected = '0_1';
    app.compare('makeKey', expected, app.testGrid.makeKey(params));

    params = { x: 1010, y: 420 };
    expected = '10_2';
    app.compare('makeKey', expected, app.testGrid.makeKey(params));

    params = '4_6';
    expected = [4, 6];
    app.compare('breakKey', expected, app.testGrid.breakKey(params));
  
    let key = '4_6';
    let id = 'test_001';
    let placedKey = app.testGrid.addToCell(key, id);
    app.compare(`addToCell`, key, placedKey);

    result = app.testGrid.grid[key];
    expected = {list:["test_001"]}; 
    app.compare(`addToCell`, expected, app.testGrid.grid[key]);

    id = 'test_002';
    placedKey = app.testGrid.addToCell(key, id);
    expected = {list:["test_001","test_002"]};
    app.compare(`addToCell`, expected, app.testGrid.grid[key]);

    key = ["4_6"];
    app.compare('query', expected, app.testGrid.query(key));


    params = {id: 'test_001', x: 410, y: 1210};
    key = '4_6';
    expected = {list:["test_001","test_002"]};
    app.compare('queryKingsSquare', expected, app.testGrid.queryKingsSquare(key));


    expected = {list:["test_002"]};
    app.testGrid.remove(params);
    app.compare(`remove`, expected, app.testGrid.grid[key]);

    params = {id: 'test_002', x: 410, y: 1210};
    expected = {list:[]};
    app.testGrid.remove(params);
    app.compare(`remove`, expected, app.testGrid.grid[key]);

    expected = {list:["3_5","4_5","5_5","3_6","4_6","5_6","3_7","4_7","5_7"]};
    app.compare('kingsSquare', expected, app.testGrid.kingsSquare(key));

    key = '0_0';
    expected = {list:["0_0","1_0","0_1","1_1"]};
    app.compare('kingsSquare', expected, app.testGrid.kingsSquare(key));

    key = '4_6';
    expected = {list:[]};
    app.compare('queryKingsSquare', expected, app.testGrid.queryKingsSquare(key));

    
  },
  
  // 51 = 'Z', 3275 = 'ZZ', 100,000,000 = 'fUJIn' 1B = 'aeP2Pp'

  runStorageTests() {
    for (let i = 0; i < 100000; i++) {
      app.uniqueId.next();

      //console.log(app.uniqueId.lastId, i);
    }
    console.log(app.uniqueId.lastId);

  },

  compare(name, expected, result) {
    result = JSON.stringify(result);
    expected = JSON.stringify(expected);
    if (expected === result) {
      console.log(`${name} ok`);
    } else {
      console.log(`${name} fail`, expected, result);
    }
  },

  msg (key, msg) {
    //console.log(`${key}, ${msg}`);
  }

}
