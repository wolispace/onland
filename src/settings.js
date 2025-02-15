const settings = {
  test: {
    worldSize: { w: 3000, h: 3000 },
    start: { x: 100, y: 100 },
    lands: 'test',
  },
  world: {
    worldSize: { w: 20000, h: 20000 }, // needs to match files on disk
    start: { x: 100, y: 60 },
    lands: 'world',
  },

  env: 'dev',
  baseUrl: window.location.origin,

  cellArea: {x: 1000, y: 1000}, // cells in the suburb grid
  gridCellArea: {x: 50, y: 50}, // cells in the collision gridS
  MOVED_ITEMS: 'moved',
  DEFAULT: 'default',
  SUBURBS: 'suburbs',
  LANDS: 'lands',
  // default layer ids
  OVERHEAD: '_o',
  RAISED: '_r',
  UNDERGROUND: '_u',
  SURFACE: '_s',
  GHOSTS: '_g',
  INVENTORY: '_me',
  SHADOW: '_d',
  
  isDev: true, 
  showBoxes: false, // show collision boxes (sufrace and ghost)
  contextMenu: true, // allow the context menu
  scrollBrowser: true, // scroll the browser viewport to keep the payer in the centre
  randomItems: true, // redundant now as we load from files a known set of items
  showTouchPoint: true, // show a circle on the screen where the mouse clicks
  pickupItems: false, // auto pick up each item we collide with
  dofBlur: true, // turn off the blur effect
  dofScale: false, // make objects larger when closer to the bottom of the screen - EXPERIMENTAL!
};

// live server runs in a sub-folder for now
if (settings.baseUrl.includes('wolispace')) {
  settings.baseUrl += '/onland_test';
  settings.env = 'live';
} 

export default settings;


