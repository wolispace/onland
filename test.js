// for testing our classes
document.addEventListener("DOMContentLoaded", function () {
  app.start();
});

let app = {

  start() {
    app.setup();
    app.runTests();
  },

  setup() {
    const cellSize = new Rectangle({ w: 100, h: 200 });
    const gridRectangle = new Rectangle({ w: 1000, h: 2000 });

    app.testGrid = new SpacialHashGrid('test', gridRectangle, cellSize);
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


    params = {id: 'test_001', x: 410, y: 1210};
    expected = {list:["test_002"]};
    app.testGrid.remove(params);
    app.compare(`remove`, expected, app.testGrid.grid[key]);

    params = {id: 'test_002', x: 410, y: 1210};
    expected = {list:[]};
    app.testGrid.remove(params);
    app.compare(`remove`, expected, app.testGrid.grid[key]);


  },

  compare(name, expected, result) {
    result = JSON.stringify(result);
    expected = JSON.stringify(expected);
    if (expected === result) {
      console.log(`${name} ok`);
    } else {
      console.log(`${name} fail`, expected, result);
    }
  }

}
