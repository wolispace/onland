import Clock from './Clock.js';
import Asset from './Asset.js';
import settings from './settings.js';
import Utils from './Utils.js';
import Rectangle from './Rectangle.js';
import SpacialHashGrid from './SpacialHashGrid.js';
import GameLoop from './GameLoop.js';

// all of the events..
document.addEventListener("DOMContentLoaded", function () {
  app.start();
});

const mode = 'test';

const app = {
  start() {
    app.clock = new Clock('app');
    app.asset = new Asset();
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

