// all of the events..
document.addEventListener("DOMContentLoaded", function () {
  app.start();
});

let app = {
  isDev: true,
  suburbSize: null,
  showCollision: false,
  contextMenu: true,
  gameLoopSpeed: 50,
  scrollBrowser: true,
  randomItems: true,
  doGhosting: true,
  itemQty: 1000,

  start() {
    app.input = new Input();
    app.ghosted = new UniqueSet();

    app.scrollable = { div: document.querySelector(".scrollable") };
    app.world = new World({ x: 0, y: 0, w: 3000, h: 3000 });

    const params = assets.make('diamond', 'me', 100, 100, true);
    app.me = new Mover(params);
    //this.doTest();
    app.world.populate();
    showSuburbsAsync(app.me);
    app.gameLoop();
    //app.world.grids.suburbs.show();
  },

  gameLoop() {
    app.gameTimer = setInterval(() => {
      // find all the movable items and move them.
      app.me.move();
    }, app.gameLoopSpeed);
  },

  doTest() {
    let itemInfo = assets.make('arch', 'test', 200, 300, true);
    app.test = new Item(itemInfo);
  },

  // randoms a random number like a dice roll, with side being the number of sides: rnd(2) is a flip of a coin, rnd(6) is a six sided dice.
  // this a zero based number so rnd(2) gives us 0 or 1, rnd(6) gives us 0...5
  rnd: function (sides) {
    return Math.floor(Math.random() * sides);
  },

  msg: function (id, msg, desc = '') {
    document.querySelector(`#msg${id}`).innerHTML = desc + JSON.stringify(msg);
  },

  endMovement: function () {
    // do something when we have stopped moving..
  },

  // given a event, work out the key code and return up, down left right or undefined
  getDirection: function (code) {
    let keyCode = code.toLowerCase().replace('arrow', '');
    return typeof app.directions[keyCode] === 'string' ? app.directions[keyCode] : keyCode;
  },

  // return true if the key code is a valid direction (otherwise its space, esc, enter etc..)
  isDirection: function (keyCode) {
    return typeof app.directions[keyCode] === 'object';
  },
};

async function shiftSuburbsAsync(mover) {
  let postcode = app.world.grids.suburbs.makeKey(mover);
  if (mover.postcode !== postcode) {
    await hideSuburbsAsync(mover);
    await showSuburbsAsync(mover);
    mover.postcode = postcode;
  }
}

async function showSuburbsAsync(mover) {
  let suburb = app.world.grids.suburbs.makeKey(mover);
  // find the kings square around it
  app.lastShown = app.world.grids.suburbs.kingsSquare(suburb);

  let inSuburbs = app.world.grids.suburbs.queryKingsSquare(mover);
  if (inSuburbs && inSuburbs.list && inSuburbs.list.length > 0) {
    for (const itemId of inSuburbs.list) {
      let item = app.world.items[itemId];
      if (item) {
        item.show();
      }
    }
  }
}

async function hideSuburbsAsync(mover) {
  let postcode = app.world.grids.suburbs.makeKey(mover);
  let suburbs = app.world.grids.suburbs.kingsSquare(postcode);
  if (app.lastShown && app.lastShown.list && app.lastShown.list.length > 0) {
    let toHide = app.lastShown.outside(suburbs.list);
    if (toHide && toHide.length > 0) {
      for (const postcode of toHide) {
        const oneSuburb = app.world.grids.suburbs.grid[postcode];
        for (const itemId of oneSuburb.list) {
          let item = app.world.items[itemId];
          if (item) {
            item.hide();
          }
        }
      }
    }
  }
}
