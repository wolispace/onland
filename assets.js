//each asset type (like a tree) can have multiple variations (basic, maple, oak) we default to basic for everything
const assets = {
  /**
   * 
   * @param {string} type 
   * @param {*} id 
   * @param {*} x 
   * @param {*} y 
   * @param {*} autoShow 
   * @returns object defining a unique item to include in the game
   */
  make(type, id = 'unknown', x = 0, y = 0, autoShow = false) {
    let params = assets.get(type);
    params.id = id;
    params.x = x;
    params.y = y;
    params.autoShow = autoShow;

    return params;
  },

  /**
   * 
   * @param {string} type 
   * @param {string} variation 
   * @returns object with everything we need to render the item
   */
  get: function (type, variation) {
    if (!variation) {
      // get a random key from the assets[type] object
      variation = Object.keys(assets[type])[Math.floor(Math.random() * Object.keys(assets[type]).length)];
    }

    params = { type, variation, ...assets[type][variation] };
    assets.updateStyle(params);

    return params;
  },

/**
 * stuff the style into the svg
 * @param {object} params 
 */
  updateStyle: function (params) {
    params.svg = params.svg.replace('%style%', `style="left:${params.left}px; top:${params.top}px; width:${params.width}px;"`);
  },

  trees: {
    basic: {
      top: -50,
      left: -10,
      width: 60,
      onCollide: 'skim',
      collisions: [{ x: 0, y: 0, w: 30, h: 15 }], // a list of collision boxes
      ghosts: [{ x: 0, y: -45, w: 30, h: 45 }], // a list of ghost collision boxes
      svg: `<svg viewBox="0 0 104 121" %style%>
         <path d="m17.324 114.9c15.556-11.314 16.617-22.627 16.617-22.627l0.70711-41.366 23.688-0.35355s-4.9497 29.698 1.4142 42.073c6.364 12.374 16.263 19.092 16.263 19.092l-2.1213 3.182s-9.1924-7.4246-15.91-4.9497c-6.7175 2.4749-7.4246 7.4246-7.4246 7.4246l-8.4853 0.7071s6.8724-11.522-1.4142-9.8995c-3.6858 0.72165-8.7725 3.4516-11.667 6.7175z" style="fill:#572e11;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.4;stroke:#000"/>
         <path d="m28.638 54.801c-19.445 2.8284-26.87-1.7678-25.102-9.1924 1.7678-7.4246 12.728-9.1924 12.728-9.1924s-20.752-9.9146-14.849-21.213c5.3209-10.185 20.86-0.70711 20.86-0.70711s6.364-12.021 21.213-9.5459c6.5801 1.0967 9.8995 7.4246 9.8995 7.4246 6.6007-10.727 20.153-5.6569 21.213 0.35355 1.0607 6.0104 5.6569 6.0104 5.6569 6.0104s3.8891-13.789 17.324-2.8284c13.435 10.96-7.0711 27.224-7.0711 27.224s16.617 2.4749 6.0104 13.435c-10.965 11.331-22.274-4.9497-22.274-4.9497s1.5934 15.155-5.6569 14.496c-11.667-1.0607-17.324-8.4853-17.324-8.4853s1.4142 16.263-12.021 9.8995-10.607-12.728-10.607-12.728z" style="fill:#187719;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.4;stroke:#000"/>
         </svg>`,
    }
  },

  rocks: {
    basic: {
      top: -20,
      left: -5,
      width: 50,
      onCollide: 'stop',
      collisions: [{ x: 0, y: 0, w: 40, h: 10 }], // a list of collision boxes
      ghosts: [{ x: 0, y: -10, w: 40, h: 10 }], // a list of ghost collision boxes
      svg: `<svg viewBox="0 0 97 64" %style%>
         <path d="m19.208 62.032-14.8-14.485-2.5191-9.7614 5.9828-23.931 11.651-7.2423 38.416-4.0935 22.357 0.62977 12.595 10.391 2.5191 23.301-2.2042 15.744-32.118 8.8167z" style="fill:#d0bfbf;paint-order:stroke fill markers;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.6;stroke:#000"/>
         <path d="m19.05 61.875-3.6212-24.718 2.2042-10.706-1.2595-10.076-8.5018 0.31488-6.1402 21.097 2.8339 10.076z" style="fill-opacity:.60104;fill:#192050;paint-order:stroke fill markers;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.3;stroke:#050505"/>
         <path d="m18.578 26.765 42.824 5.0381 8.187 15.429-6.9274 13.225" style="fill-opacity:.39378;fill:#313238;paint-order:stroke fill markers;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.3;stroke:#000"/>
         <path d="m93.048 14.17-31.016 17.319 32.433 5.6679-23.931 9.7614-7.8721 14.012 30.544-8.187 2.2042-17.476" style="fill-opacity:.57513;fill:#080a18;paint-order:stroke fill markers;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.3;stroke:#000"/>
         <path d="m19.68 24.718 41.722 5.5105 29.442-17.319" style="fill:none;paint-order:stroke fill markers;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.3;stroke:#fff"/>
         <path d="m62.977 32.748 7.2423 13.54 21.727-8.9742z" style="fill:#fff;paint-order:stroke fill markers;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.3;stroke:#000"/>
         <path d="m2.6765 38.258 12.123-0.62977 3.1488 22.042-12.753-11.808z" style="fill-opacity:.70466;fill:#2e2e2e;paint-order:stroke fill markers;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.3;stroke:#000"/>
         </svg>`,
    }
  },

  diamonds: {
    basic: {
      name: 'basic',
      top: -32,
      left: -22,
      width: 50,
      onCollide: 'stop',
      collisions: [{ x: 0, y: 0, w: 10, h: 10 }], // a list of collision boxes
      ghosts: [{ x: -5, y: -20, w: 20, h: 20 }], // a list of ghost collision boxes
      svg: `<svg viewBox="0 0 79 68" %style%>
        <path d="m15.25 12.75 12.305-5.1342 14.771-3.403 15.924-0.96284 17 15.25-28.25 44.5-43.75-29z" style="fill:#c9f0e4;stroke-linecap:square;stroke-width:2.5;stroke:#000"/>
        <path d="m4.25 33.75 19 1 22.75-4 15-4.25 13.25-8.5" style="fill:none;stroke-linecap:square;stroke-width:2.5;stroke:#000"/>
        <path d="m18.5 16.5 7 0.75 10-1.5 11.5-3.25 7-4.25" style="fill:none;stroke-linecap:square;stroke-width:2.5;stroke:#000"/>
        <path d="m25.5 17-2.5 17.25 22.75 27.5" style="fill:none;stroke-linecap:square;stroke-width:2.5;stroke:#000"/>
        <path d="m35.5 15.5 7.25 15.75 3.75 30" style="fill:none;stroke-linecap:square;stroke-width:2.5;stroke:#000"/>
        <path d="M 48.25,12.5 60,27 47.5,61.75" style="fill:none;stroke-linecap:square;stroke-width:2.5;stroke:#000"/>
        <path d="m37.75 16.75 9.75-3.5 10 13-14 3.75" style="fill:#fbfefd"/>
        <path d="M 7.75,35.25 23.25,36 40.5,57.25" style="fill:#93cfe4"/>
        </svg>`,
    }
  },
}