import settings from './settings.js';
import Clock from './Clock.js';
import Asset from './Asset.js';
import Utils from './Utils.js';
import Rectangle from './Rectangle.js';
import SpacialHashGrid from './SpacialHashGrid.js';
import GameLoop from './GameLoop.js';
import GameList from "./GameList.js";
import Hood from './Hood.js';

// all of the events..
document.addEventListener("DOMContentLoaded", function () {
  app.start();
});

const mode = 'test';

const app = {
  start() {
    app.clock = new Clock('app');
    app.asset = new Asset();
    app.gameList = new GameList();
    app.gameLoop = new GameLoop(app.update, app.render);
    app.clock.test();

    // testing stuff
    const cellSize = new Rectangle({ w: 100, h: 200 });
    const gridRectangle = new Rectangle({ w: 1000, h: 2000 });
    app.testGrid = new SpacialHashGrid('test', gridRectangle, cellSize);
    console.log(Utils.rnd(5));



    app.gameLoop.start();
  },

  /**
  * Update the position and state of everything in the world
  * @param {int} deltaTime 
  */
  update(deltaTime) {
    //console.log('deltaTime', deltaTime);
    // find all items that can move, griw change and update them
    //app.me.move();
  },

  /**
   * Show the world and all of its children
   */
  render() {
    // find all items that have moved or changed and render them
    //console.log('render');
    //app.me.position();
    //app.me.setPostcode();
  },

};

console.log('app:', settings.isDev);


//------------ functions that have to be at the app top-level for promises


/** when we are in a new land, clear previous item info and load the kings square of land data
   * @params {string} land key eg '0_0' or 4_6' lands are bigger than suburbs
   */
function loadData(hoodKey) {
  // clear all previous background colours ready to setup a new set of 9 suburbs
  app.backgroundColors = {};
  const hood = new Hood(hoodKey);

  const layer = settings.SURFACE;
  const filePromises = [];
  for (const hoodKey in hood.list) {

    const filePromise = loadScript(hoodKey)
      .then(() => {
        // File loaded successfully, you can now use its functions/variables
        if (app.defaultData) {
          if (typeof (app.defaultData) == "string") {
            const layerList = app.gameList.get(settings.DEFAULT);
            layerList.decode(app.defaultData);
            layerList.expand(hoodKey);
          }
        }
        // if no background colour defined the default to sea green
        if (!app.backgroundColor) {
          app.backgroundColor = { r: 99, g: 149, b: 125 }; // seagreen
        }
        app.backgroundColors[land] = app.backgroundColor;
      })
      .catch((error) => {
        console.error('Error loading script:', error);
      });
    filePromises.push(filePromise);
  }

  Promise.all(filePromises)
    .then(() => {
      // All files have been read from disk
      // Handle the data as a whole here
      processAllData(hood.list);
    })
    .catch((error) => {
      console.error('Error loading scripts:', error);
    });
};

function processAllData(hoodList) {
  // now app.gameLists has all default items in basic form (read from js files)
  // update with all known/moved items from local storage
  let movedItems = app.store.load(settings.MOVED_ITEMS);
  app.gameList.get('moved').decode(movedItems);
  // remove all that are not in the current surround lands
  app.gameList.prune(hoodList);
  // allocate them all to layers
  app.gameList.allocate();
  // draw everything on the surface
  app.gameList.render(settings.SURFACE);
  app.overlays.updateForPlayerPosition(app.me.y);
  app.world.updateBackgroundColor();
}

// TODO: this needs to be run when the player moves
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
    mover.postcode = postcode;
  }
}

/**
* Loads the js file ie one that has a js data object with more world data
* @param {string} src path to a js file
* @returns 
*/
function loadScript(hoodKey) {
  const landName = settings[mode].lands || 'land';
  const filePath = `lands/${landName}_${hoodKey}.js`;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = filePath;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// make these accessible via DevTools
window.app = app;
window.settings = settings;
