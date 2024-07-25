// all of the events..
document.addEventListener("DOMContentLoaded", function () {
  app.start();
});

let app = {
  isDev: true,
  suburbSize: null,
  showCollision: false,

  start() {
    app.input = new Input();

    app.scrollable = { div: document.querySelector(".scrollable") };
    app.world = new World({x: 0, y: 0, w: 5000, h: 5000});

    app.me = new Mover({ x: 100, y: 100, w: 50, h: 50 });
    this.doTest();
    
  },
  
  doTest() {
    let itemInfo = items.makeDiamond('test', 200, 300, true);
    app.test = new Item(itemInfo);
  },

  msg: function (id, msg, desc = '') {
    document.querySelector(`#msg${id}`).innerHTML = desc + JSON.stringify(msg);
  },

  endMovement() {
    console.log('endMove');
  }


};

async function shiftSuburbsAsync(mobile) {
  let postcode = app.world.suburbs.makeKey(mobile);
  if (mobile.lastPostcode !== postcode) {
    await showSuburbsAsync(mobile);
    await hideSuburbsAsync(mobile);
    mobile.lastPostcode = postcode;
  }
}

async function showSuburbsAsync(mobile) {
  let inSuburbs = await app.world.suburbs.queryKingsSquare(mobile);
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
  let postcode = app.world.suburbs.makeKey(mobile);
  let suburbs = await app.world.suburbs.kingsSquare(postcode);
  if (app.lastShown && app.lastShown.list && app.lastShown.list.length > 0) {
    let toHide = app.lastShown.outside(suburbs.list);
    await Promise.all(toHide.map(async (postcode) => {
      await app.world.suburbs.grid[postcode].forEach(async (itemId) => {
        let item = app.items[itemId];
        await item.hide();
      });
    }));
  }
  app.lastShown = suburbs;
}
