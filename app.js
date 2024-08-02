// all of the events..
document.addEventListener("DOMContentLoaded", function () {
  app.start();
});

let app = {
  isDev: true,
  suburbSize: null,
  showCollision: true,
  contextMenu: true,
  gameLoopSpeed: 50,
  scrollBrowser: true,
  randomItems: false,
  itemQty: 3,

  start() {
    app.input = new Input();

    app.scrollable = { div: document.querySelector(".scrollable") };
    app.world = new World({ x: 0, y: 0, w: 300, h: 300 });

    const params = items.makeDiamond('me', 100, 100, true);
    app.me = new Mover(params);
    this.doTest();
    app.world.populate();
    app.gameLoop();
  },

  gameLoop() {
    app.gameTimer = setInterval(() => {
      // find all the movable items and move them.
      app.me.move();
    }, app.gameLoopSpeed);
  },

  doTest() {
    let itemInfo = items.makeDiamond('test', 200, 300, true);
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

async function shiftSuburbsAsync(mobile) {
  let postcode = app.world['suburbs'].makeKey(mobile);
  if (mobile.lastPostcode !== postcode) {
    await showSuburbsAsync(mobile);
    await hideSuburbsAsync(mobile);
    mobile.lastPostcode = postcode;
  }
}

async function showSuburbsAsync(mobile) {
  let inSuburbs = await app.world['suburbs'].queryKingsSquare(mobile);
  if (inSuburbs && inSuburbs.list && inSuburbs.list.length > 0) {
    await Promise.all(inSuburbs.list.map(async (itemId) => {
      let item = app.items[itemId];
      if (item) {
        await item.show();
      }
    }));
  }
}

async function hideSuburbsAsync(mobile) {
  let postcode = app.world['suburbs'].makeKey(mobile);
  let suburbs = await app.world['suburbs'].kingsSquare(postcode);
  if (app.lastShown && app.lastShown.list && app.lastShown.list.length > 0) {
    let toHide = app.lastShown.outside(suburbs.list);
    await Promise.all(toHide.map(async (postcode) => {
      await app.world['suburbs'].grid[postcode].forEach(async (itemId) => {
        let item = app.items[itemId];
        await item.hide();
      });
    }));
  }
  app.lastShown = suburbs;
}
