import Clock from './Clock.js';
import Asset from './Asset.js';
import settings from './settings.js';
import Utils from './Utils.js';
import Rectangle from './Rectangle.js';
import SpacialHashGrid from './SpacialHashGrid.js';

// all of the events..
document.addEventListener("DOMContentLoaded", function () {
    app.start();
  });
  
  const mode = 'test';
  
  const app = {
    start() {
      app.clock = new Clock('app');
      app.asset = new Asset();
      app.clock.test();
          const cellSize = new Rectangle({ w: 100, h: 200 });
          const gridRectangle = new Rectangle({ w: 1000, h: 2000 });
      app.testGrid = new SpacialHashGrid('test', gridRectangle, cellSize);
      console.log(Utils.rnd(5));
    },
  };

  console.log('app:', settings.isDev);

