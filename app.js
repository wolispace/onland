// all of the events..
document.addEventListener("DOMContentLoaded", function () {
  app.start();
});

let app = {
  isDev: true,
  suburbSize: null,
  showCollision: false,

  start() {
    app.scrollable = { div: document.querySelector(".scrollable") };
    app.world = new World({x: 0, y: 0, w: 5000, h: 5000});

    app.me = new Rectangle({ x: 100, y: 100, w: 50, h: 50 });
    this.doTest();
    
  },
  
  doTest() {
    let itemInfo = items.makeDiamond('test', 200, 300, true);

    app.test = new Item(itemInfo);

  }
}
