// all of the events..
document.addEventListener("DOMContentLoaded", function () {
  app.start();
});

let app = {
  isDev: true,
  suburbSize: 200,
  showCollision: false,
  contextMenu: true,
  scrollBrowser: true,
  randomItems: true,
  doGhosting: true,
  itemQty: 3,
  showTouchPoint: true,

  start() {
    app.input = new Input();
    app.ghosted = new UniqueSet();
    app.events = new Events();

    app.scrollable = { div: document.querySelector(".scrollable") };
    app.world = new World({ x: 0, y: 0, w: 50000, h: 50000 });

    const params = assets.make('diamond', 'me', 100, 100, true);
    app.me = new Mover(params);
    //this.doTest();
    //app.world.populate();
    app.world.load();
    shiftSuburbsAsync(app.me);

    app.gameLoop = new GameLoop(app.update, app.show);
    app.gameLoop.start();
    app.world.layers.suburbs.show();
    //app.world.layers.surface.show();
  },


  /**
   * Update the position and state of everything in the world
   * @param {int} deltaTime 
   */
  update(deltaTime) {
    //console.log('deltaTime', deltaTime);
    app.me.move();
  },

  /**
   * Show the world and all of its children
   */
  show() {
    app.me.position();
  },

  doTest() {
    let itemInfo = assets.make('bridge', 'test', 500, 500, true, 'basic');
    app.test = new Item(itemInfo);
    app.world.addToLayers(app.test);
  },

  // randoms a random number like a dice roll, with side being the number of sides: rnd(2) is a flip of a coin, rnd(6) is a six sided dice.
  // this a zero based number so rnd(2) gives us 0 or 1, rnd(6) gives us 0...5
  rnd: function (sides) {
    return Math.floor(Math.random() * sides);
  },

  // returns the random number shifted around zero so 3 = -1, 0, 1
  halfRnd: function (sides) {
    return app.rnd(sides) - (sides / 2);
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

  // remember to wrap functions in functions before passing them as onEnd
  animate: (element, type, duration, onEnd) => {
    if (element && element.style) {
      element.style.animation = `${type} ${duration}s ease-in-out 0s 1 normal forwards`;
      element.addEventListener("animationstart", function handler() {
        this.removeEventListener("animationstart", handler);
      });

      element.addEventListener("animationend", function handler() {
        element.style.animation = "";
        if (typeof onEnd == "function") {
          onEnd();
        }
        this.removeEventListener("animationend", handler);
      });
    }
  },
};

async function shiftSuburbsAsync(mover) {
  mover.updateCollisionBox();
  let postcode = app.world.layers.suburbs.makeKey(mover.collisionBox);
  if (mover.postcode !== postcode) {
    //await hideSuburbsAsync(mover);
    await showSuburbsAsync(postcode, mover.collisionBox);
    mover.postcode = postcode;
  }
}

async function showSuburbsAsync(postcode, collisionBox) {
  app.lastShown = app.world.layers.suburbs.kingsSquare(postcode);

  let inSuburbs = app.world.layers.suburbs.queryKingsSquare(postcode);
  console.log('inSuburbs', inSuburbs, collisionBox);
  if (inSuburbs && inSuburbs.list && inSuburbs.list.length > 0) {
    for (const itemId of inSuburbs.list) {
      let item = app.world.items[itemId];
      if (item) {
        item.show();
        console.log('show', item);
      }
    }
  }
}

async function hideSuburbsAsync(mover) {
  mover.updateCollisionBox();
  let postcode = app.world.layers.suburbs.makeKey(mover.collisionBox);
  let suburbs = app.world.layers.suburbs.kingsSquare(postcode);
  if (app.lastShown && app.lastShown.list && app.lastShown.list.length > 0) {
    let toHide = app.lastShown.outside(suburbs.list);
    if (toHide && toHide.length > 0) {
      for (const postcode of toHide) {
        const oneSuburb = app.world.layers.suburbs.grid[postcode];
        if (oneSuburb && oneSuburb.list) {
          for (const itemId of oneSuburb.list) {
            let item = app.world.items[itemId];
            if (item) {
              item.hide();
              console.log('hide', item);
            }
          }
        }
      }
    }
  }
}
