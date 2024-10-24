// all of the events..
document.addEventListener("DOMContentLoaded", function () {
  app.start();
});

const mode = 'test';

let app = {

  suburbSize: settings[mode].suburbSize, // need a fixed suburb size as it will match data loaded from disk
  landSize: settings[mode].landSize, // how big each land (logically grouped items saved to disk) is 
  itemQty: settings[mode].itemQty,

  encodeKeys: ['id', 'type', 'variant', 'layer', 'x', 'y'],

  start() {
    app.input = new Input();
    app.uniqueId = new UniqueId();
    app.ghosted = new UniqueSet();
    app.events = new Events();
    app.store = new Store();
    app.items = new Items();
    app.inventory = new Inventory();
    app.overlays = new Overlays();


    app.scrollable = { div: document.querySelector(".scrollable") };
    app.world = new World(settings[mode].worldSize);
    app.world.div = document.querySelector(`#world`);

    let params = assets.make({ type: 'diamond', id: '_me', x: settings[mode].start.x, y: settings[mode].start.y, autoShow: true });
    params.parent = app.world;

    app.me = new Mover(params);

    // set up the overlay that holds the controls and other overlay things like dialogs
    //app.overlay = { div: document.querySelector(`#overlay`) };

    this.doTest();
    //app.world.populate();

    app.overlays.updateBlurOverlay();


    app.loadData('0_0');
    shiftSuburbsAsync(app.me);

    controls.setup();
    //app.overlay.div.style.top = "200px";

    
    setTimeout(() => {
      //this.testDialog();
      //app.world.layers.surface.show();
    }, 1000);


    app.gameLoop = new GameLoop(app.update, app.show);
    app.gameLoop.start();
    //app.world.layers.suburbs.show();
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
    const id = 'z';
    const movedItems = `${id}|rock|||50|50^a|tree|||200|50`;
    app.store.save(settings.MOVED_ITEMS, movedItems);

    // let itemInfo = assets.make('bridge', 'test', 500, 500, true, 'basic');
    // app.test = new Item(itemInfo);
    // app.world.addToLayers(app.test);
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
    const layer = 'surface';
    const surrounds = app.world.layers.lands.kingsSquare(landKey);
    const filePromises = [];
    
    surrounds.list.forEach((land => {  
      const filePromise = loadScript(`lands/${settings[mode].lands}_${land}.js`)
        .then(() => {
          // File loaded successfully, you can now use its functions/variables
          if (app.defaultData) {            
            app.store.addToTempList(app.defaultData[layer].join('^'));
          }
        })
        .catch((error) => {
          console.error('Error loading script:', error);
        });
        filePromises.push(filePromise);
    }));

    Promise.all(filePromises)
    .then(() => {
        // All files have been read from disk
        // Handle the data as a whole here
        processAllData(surrounds);
    })
    .catch((error) => {
        console.error('Error loading scripts:', error);
    });
  },

  
};

function processAllData(surrounds) {
      // now app.store.tempList has all default items in basic form
  // update with all known/moved items from local storage
  // all that are in tempList now get turned into real items and allocated into layers

  let movedItems = app.store.load(settings.MOVED_ITEMS);
  app.store.updateMovedList(movedItems);

  console.log(movedItems, app.store);
  app.store.updateTempList(movedItems);
  app.store.pruneTempList(surrounds);
  
  // now we have a list of basic objects we can turn into Item()s and fill the grids and draw on screen
  app.items.setItems(app.store.tempList);
}

async function shiftSuburbsAsync(mover) {
  mover.updateCollisionBox();
  let postcode = app.world.layers.suburbs.makeKey(mover.collisionBox);
  if (mover.postcode !== postcode) {
    // we have changed suburbs to check if we have also changed lands
    let currentLand = app.world.layers[settings.LANDS].makeKey(mover.collisionBox);
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
      let item = app.items.get(itemId);
      if (item && item.layer) {
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
            let item = app.items.get(itemId);
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
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function addToBody(html) {
  let bodyElement = document.querySelector("body");
  bodyElement.insertAdjacentHTML('beforeend', html);
}


