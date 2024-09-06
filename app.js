// all of the events..
document.addEventListener("DOMContentLoaded", function () {
  app.start();
});
const settings = {
  test: {
    suburbSize: 500, // need a fixed suburb size as it will match data loaded from disk
    landSize: new Rectangle({ w: 500, h: 500 }), // how big each land (logically grouped items saved to disk) is 
    worldSize: { w: 1000, h: 1000 },
    start: { x: 100, y: 100 },
    itemQty: 10,
    lands: 'test',
  }
}

const mode = 'test';

let app = {
  isDev: true,
  suburbSize: settings[mode].suburbSize, // need a fixed suburb size as it will match data loaded from disk
  landSize: settings[mode].landSize, // how big each land (logically grouped items saved to disk) is 
  showCollision: false,
  contextMenu: true,
  scrollBrowser: true,
  randomItems: true,
  doGhosting: true,
  itemQty: settings[mode].itemQty,
  showTouchPoint: true,

  encodeKeys: ['id', 'type', 'variant', 'layer', 'x', 'y'],

  start() {
    app.input = new Input();
    app.uniqueId = new UniqueId();
    app.ghosted = new UniqueSet();
    app.events = new Events();
    app.store = new Store();

    app.scrollable = { div: document.querySelector(".scrollable") };
    app.world = new World(settings[mode].worldSize);
    app.world.div = document.querySelector(`#world`);

    let params = assets.make({ type: 'diamond', id: '_me', x: settings[mode].start.x, y: settings[mode].start.y, autoShow: true });
    params.parent = app.world;

    app.me = new Mover(params);

    // set up the overlay that holds the controls and other overlay things like dialogs
    app.overlay = { div: document.querySelector(`#overlay`) };

    //this.doTest();
    app.world.populate();

    
    //app.loadData('0_0');
    shiftSuburbsAsync(app.me);

    controls.setup();
    //app.overlay.div.style.top = "200px";


    setTimeout(app.world.extract, 2000);


    app.gameLoop = new GameLoop(app.update, app.show);
    app.gameLoop.start();
    //app.world.layers.suburbs.show();
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
    app.me.setPostcode();
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


  encode(item) {
    let encoded = [];
    app.encodeKeys.forEach((key) => {
      let value = item[key];
      if (value === null || value === undefined || value === 'basic' || value === 'surface') {
        value = '';
      }
      encoded.push(value);
    });
    return encoded.join('|');
  },

  /**
   * 
   * @param {string} encodedString 
   * @returns {object} decoded object {id, type, variant, layer, x, y}
   */
  decode(encodedString) {
    let decoded = {};
    const decodedValues = encodedString.split('|');
    app.encodeKeys.forEach((key, index) => {
      let value = decodedValues[index];
      if (value) {
        if (key === 'x' || key === 'y') {
          decoded[key] = parseInt(value);
        } else {
          decoded[key] = value;
        }
      }
    });
    return decoded;

  },

  /** when we are in a new land, clear previous item info and load the kings square of land data
   * @params {string} land key eg '0_0' or 4_6' lands are bigger than suburbs
   */
  loadData(landKey) {

    const surrounds = app.world.layers.lands.kingsSquare(landKey);

    console.log({ surrounds });

    surrounds.list.forEach((land => {
      loadScript(`lands/${settings[mode].lands}_${land}.js`)
        .then(() => {
          // File loaded successfully, you can now use its functions/variables
          console.log('Script loaded successfully');
          if (app.defaultData) {
            app.world.load(app.defaultData.surface.join('^'));
          }
        })
        .catch((error) => {
          console.error('Error loading script:', error);
        });

    }));

  }

};

async function shiftSuburbsAsync(mover) {
  mover.updateCollisionBox();
  let postcode = app.world.layers.suburbs.makeKey(mover.collisionBox);
  if (mover.postcode !== postcode) {
    // we have changed suburbs to check if we have also changed lands
    let currentLand = app.world.layers.lands.makeKey(mover.collisionBox);
    if (mover.land !== currentLand) {
      // switched lands so load and hide
      app.loadData(currentLand);
      mover.land = currentLand;
    }
    await hideSuburbsAsync(mover);
    await showSuburbsAsync(postcode, mover.collisionBox);
    mover.postcode = postcode;
  }
}

async function showSuburbsAsync(postcode, collisionBox) {

  const currentSuburbs = app.world.layers.suburbs.kingsSquare(postcode);
  let newSuburbs = null;
  // compare current suburbs with last show and only add the missing ones
  if (app.lastShown) {
    newSuburbs = app.lastShown.notIn(currentSuburbs.list);
  } else {
    newSuburbs = currentSuburbs.list;
  }

  let inSuburbs = app.world.layers.suburbs.query(newSuburbs);
  if (inSuburbs && inSuburbs.list && inSuburbs.list.length > 0) {
    for (const itemId of inSuburbs.list) {
      let item = app.world.items[itemId];
      if (item) {
        item.show();
      }
    }
  }
  app.lastShown = currentSuburbs;
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
            }
          }
        }
      }
    }
  }
}

/**
 * Loads the js file ie one that has a js data object with more world data
 * @param {string} src path to a js file
 * @returns 
 */
function loadScript(src) {
  console.log(`attempting to load`, src);

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}