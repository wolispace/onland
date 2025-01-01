const settings = {
  test: {
    suburbSize: 1000, // need a fixed suburb size as it will match data loaded from disk
    landSize: 1000, // how big each land (logically grouped items saved to disk) is 
    worldSize: { w: 3000, h: 3000 },
    start: { x: 100, y: 100 },
    itemQty: 10,
    lands: 'test',
  },
  bones: {
    suburbSize: 1000, // need a fixed suburb size as it will match data loaded from disk
    landSize: 1000, // how big each land (logically grouped items saved to disk) is 
    worldSize: { w: 2000, h: 2000 }, // needs to match files on disk
    start: { x: 100, y: 60 },
    lands: 'bones',
  },
  MOVED_ITEMS: 'moved',
  DEFAULT: 'default',
  OVERHEAD: 'overhead',
  RAISED: 'raised',
  UNDERGROUND: 'underground',
  SUBURBS: 'suburbs',
  LANDS: 'lands',
  SURFACE: 's',
  GHOSTS: 'g',
  INVENTORY: 'i',
  SHADOW: 'd',
  
  isDev: true, 
  showBoxes: false, // show collision boxes (sufrace and ghost)
  contextMenu: true, // allow the context menu
  scrollBrowser: true, // scroll the browser viewport to keep the payer in the centre
  randomItems: true, // redundant now as we load from files a known set of items
  showTouchPoint: true, // show a circle on the screen where the mouse clicks
  pickupItems: false, // auto pick up each item we collide with
  dofBlur: true, // turn off the blur effect
  dofScale: false, // make objects larger when closer to the bottom of the screen - EXPERIMENTAL!
}


