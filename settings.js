const settings = {
  test: {
    suburbSize: 500, // need a fixed suburb size as it will match data loaded from disk
    landSize: 500, // how big each land (logically grouped items saved to disk) is 
    worldSize: { w: 1000, h: 1000 },
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
  showCollision: false,
  contextMenu: true,
  scrollBrowser: true,
  randomItems: true,
  doGhosting: true,
  showTouchPoint: true,
  pickupItems: false,
  
}


