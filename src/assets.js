//each asset type (like a tree) can have multiple variants (basic, maple, oak) we default to basic for everything
const assets = {

  /**
   * 
   * @param {string} type 
   * @param {string} id 
   * @param {int} x where to place this item relative to its parent
   * @param {int} y 
   * @param {boolean} autoShow show as soon as it has been created
   * @param {string} variant if undefined returns a random variant of this type
   * @returns object defining a unique item to include in the game
   */
  make(params) {
    const defaultParams = assets.get(params.type, params.variant);
    params = {...params, ...defaultParams};
    // no style defined so build one based on the params
    if (!params.style) {
      params.style = `style="left:${params.left}px; top:${params.top}px;" width="100%"`;
    }
    params.html = assets.buildHtml(params);
    return params;
  },

  /**
   * 
   * @param {string} type 
   * @param {string} variant 
   * @returns object with all the bits we need to render the item
   */
  get: function (type, variant) {
    if (!variant) {
      // get a random key from the assets[type] object
      variant = Object.keys(assets.items[type])[Math.floor(Math.random() * Object.keys(assets.items[type]).length)];
    }
    params = { type, variant, ...assets.items[type][variant] };

    return params;
  },

  /**
   * 
   * @returns array of all the keys in the assets.items object
   * which are the different types of assets we can create
   * like 'tree', 'rock', 'bush', etc
   */
  keys: function () {
    return Object.keys(assets.items);
  },

  /**
   * Replace all tokens in the html with the values from this object
   * so <div id="i%x%"></div> becomes <div id="i10"></div> if x:10
   * @param {object} params 
   */
  buildHtml(params) {
    let html = assets.html ?? assets.htmlSets[params.type] ?? assets.htmlSets['items'];
    
    let match;
    const regex = /%(\w+)%/;
    // keep checking for a match as the last replaced param may have added more
    while ((match = regex.exec(html)) !== null) {
      const [fullMatch, paramName] = match;
      if (params[paramName] === '' || params[paramName]) {
        html = html.replace(fullMatch, params[paramName]);
      } else {
        // If the parameter is not found in params, move past this match
        html = html.slice(0, match.index) + html.slice(match.index + fullMatch.length);
      }
    }
    
    return html;
  },

  htmlSets: {
    items: `<div id="%id%" class="%type% item" style="width: %w%px; height: %h%px;">%content%</div>`,
    controls: `<div id="%id%" class="%type%" style="left:%x%px; bottom:%y%px; width: %w%px; height: %h%px;">%content%</div>`,
    buttons: `<div id="%id%" class="%type%" style="left:%x%px; top:%y%px; width: %w%px; height: %h%px;">%content%</div>`
  },


  // all the items
  items: {
    cube: {
      basic: {
        top: -10,
        left: -10,
        width: 30,
        w: 50,
        h: 50,
        onCollide: 'skim',
        s: [new Collidable({ x: 0, y: 10, w: 30, h: 30 })], // a list of collision boxes
        g: [new Collidable({ x: 0, y: 10, w: 30, h: 30 })], // a list of ghost collision boxes
        content: `<img src="work/cube_1_2.png" %style%>`,
      }
    },
    tree: {
      basic: {
        top: -60,
        left: -10,
        width: 60,
        w: 70,
        h: 100,
        onCollide: 'skim',
        gXhosts: [new Collidable({ x: 0, y: -45, w: 30, h: 45 })], // a list of ghost collision boxes
        s: [new Collidable({ x: 0, y: 0, w: 30, h: 15 })], // a list of collision boxes
        g: [new Collidable({ x: 0, y: -45, w: 30, h: 45 })], // a list of ghost collision boxes
        content: `<svg viewBox="0 0 104 121" %style%>
           <path d="m17.324 114.9c15.556-11.314 16.617-22.627 16.617-22.627l0.70711-41.366 23.688-0.35355s-4.9497 29.698 1.4142 42.073c6.364 12.374 16.263 19.092 16.263 19.092l-2.1213 3.182s-9.1924-7.4246-15.91-4.9497c-6.7175 2.4749-7.4246 7.4246-7.4246 7.4246l-8.4853 0.7071s6.8724-11.522-1.4142-9.8995c-3.6858 0.72165-8.7725 3.4516-11.667 6.7175z" style="fill:#572e11;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.4;stroke:#000"/>
           <path d="m28.638 54.801c-19.445 2.8284-26.87-1.7678-25.102-9.1924 1.7678-7.4246 12.728-9.1924 12.728-9.1924s-20.752-9.9146-14.849-21.213c5.3209-10.185 20.86-0.70711 20.86-0.70711s6.364-12.021 21.213-9.5459c6.5801 1.0967 9.8995 7.4246 9.8995 7.4246 6.6007-10.727 20.153-5.6569 21.213 0.35355 1.0607 6.0104 5.6569 6.0104 5.6569 6.0104s3.8891-13.789 17.324-2.8284c13.435 10.96-7.0711 27.224-7.0711 27.224s16.617 2.4749 6.0104 13.435c-10.965 11.331-22.274-4.9497-22.274-4.9497s1.5934 15.155-5.6569 14.496c-11.667-1.0607-17.324-8.4853-17.324-8.4853s1.4142 16.263-12.021 9.8995-10.607-12.728-10.607-12.728z" style="fill:#187719;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.4;stroke:#000"/>
           </svg>`,
      }
    },

    rock: {
      basic: {
        top: -20,
        left: -5,
        width: 50,
        w: 50,
        h: 50,
        onCollide: 'stop',
        gXhosts: [new Collidable({ x: 0, y: -10, w: 40, h: 10 })], // a list of ghost collision boxes
        s: [new Collidable({ x: 0, y: 0, w: 40, h: 10 })], // a list of collision boxes
        g: [new Collidable({ x: 0, y: -10, w: 40, h: 10 })], // a list of ghost collision boxes
        content: `<svg viewBox="0 0 97 64" %style%>
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

    diamond: {
      basic: {
        name: 'basic',
        top: -32,
        left: -22,
        width: 50,
        w: 50,
        h: 50,
        onCollide: 'stop',
        surface: [new Collidable({ x: 0, y: 0, w: 10, h: 10 })], // a list of collision boxes
        ghosts: [new Collidable({ x: -5, y: -20, w: 20, h: 20 })], // a list of ghost collision boxes
        s: [new Collidable({ x: 0, y: 0, w: 10, h: 10 })], // a list of collision boxes
        g: [new Collidable({ x: -5, y: -20, w: 20, h: 20 })], // a list of ghost collision boxes
        content: `<svg viewBox="0 0 79 68" %style%>
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

    arch: {
      basic: {
        name: 'basic',
        top: -130,
        left: -10,
        width: 150,
        w: 150,
        h: 200,
        onCollide: 'skim',
        surface: [new Collidable({ x: 0, y: 0, w: 22, h: 16 }), new Collidable({ x: 96, y: 0, w: 22, h: 16 })], // a list of collision boxes
        ghosts: [new Collidable({ x: 0, y: -130, w: 20, h: 130 }), new Collidable({ x: 96, y: -130, w: 20, h: 130 }), new Collidable({ x: 0, y: -130, w: 100, h: 20 })], // a list of ghost collision boxes
        s: [new Collidable({ x: 0, y: 0, w: 22, h: 16 }), new Collidable({ x: 96, y: 0, w: 22, h: 16 })], // a list of collision boxes
        g: [new Collidable({ x: 0, y: -130, w: 20, h: 130 }), new Collidable({ x: 96, y: -130, w: 20, h: 130 }), new Collidable({ x: 0, y: -130, w: 100, h: 20 })], // a list of ghost collision boxes
        content: `<svg viewBox="0 0 200 200" %style%>
          <path d="m16.617 185.97s7.0711 11.314 17.678 11.314c10.607 0 19.092-10.96 19.092-10.96l-8.1317-168.29-21.92-0.35355z" style="fill:#541010;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.4;stroke:#000"/>
          <path d="m29.345 184.91 2.1213-157.68v0" style="fill:#541010;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.4462;stroke-width:3.3;stroke:#fff"/>
          <path d="m143.4 186.39s7.0711 11.314 17.678 11.314 19.092-10.96 19.092-10.96l-8.1317-168.29-21.92-0.35355z" style="fill:#541010;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.4;stroke:#000"/>
          <path d="m156.12 185.33 2.1213-157.68v0" style="fill:#541010;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.4462;stroke-width:3.3;stroke:#fff"/>
          <path d="m1.4142 0.70711 1.7678 9.8995 12.728 12.374 166.17 0.35355 15.91-14.496-0.35355-7.4246z" style="fill:#541010;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:3.3;stroke:#000"/>
          <path d="m7.0711 8.8388-0.35355-4.9497 182.43 1.7678v0" style="fill:#541010;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.39557;stroke-width:3.3;stroke:#fff"/>
          </svg>`,
      }
    },

    river: {
      basic: {
        name: 'basic',
        top: 0,
        left: 0,
        width: 139,
        w: 139,
        h: 200,
        onCollide: 'skim',
        surface: [new Collidable({ x: 0, y: 0, w: 120, h: 200 })], // a list of collision boxes
        ghosts: [new Collidable({ x: 0, y: 0, w: 0, h: 0 })], // a list of ghost collision boxes
        s: [new Collidable({ x: 0, y: 0, w: 120, h: 200 })], // a list of collision boxes
        g: [new Collidable({ x: 0, y: 0, w: 0, h: 0 })], // a list of ghost collision boxes
        content: `<svg viewBox="0 0 139 200" %style%>
          <path d="m18.031 10.253s-16.263 17.324-16.971 37.123c-0.70711 19.799 6.364 38.184 7.4246 57.276 1.0607 19.092 0.70711 51.619-0.70711 66.822-1.4142 15.203 24.749 21.567 24.749 21.567 39.598 12.728 64.7 1.7678 87.328-5.3033 0 0 17.678-9.5459 18.031-35.002 0.35356-25.456-13.789-46.316-18.385-67.175-4.5962-20.86 0.35355-45.608-0.35356-59.043-0.7071-13.435-19.092-24.395-19.092-24.395s-62.579-8.4853-82.024 8.1317z" style="fill:#3537d8;paint-order:fill markers stroke"/>
          <path d="m38.052 31.244c7.8166-1.1364 9.1193-6.9806 9.1193-6.9806 1.2389 3.3558 3.291 5.1276 10.236 5.8443" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.39557;stroke-width:1.6224;stroke:#fff"/>
          <path d="m71.378 55.256c7.8166-1.1364 9.1193-6.9806 9.1193-6.9806 1.2389 3.3558 3.291 5.1276 10.236 5.8443" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.39557;stroke-width:1.6224;stroke:#fff"/>
          <path d="m29.652 77.707c7.8459-1.0331 9.1535-6.3461 9.1535-6.3461 1.2436 3.0508 3.3033 4.6615 10.274 5.313" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.39557;stroke-width:1.5498;stroke:#fff"/>
          <path d="m51.539 128.29c7.8166-1.1364 9.1193-6.9806 9.1193-6.9806 1.2389 3.3558 3.291 5.1276 10.236 5.8443" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.39557;stroke-width:1.6224;stroke:#fff"/>
          <path d="m75.933 141.81c7.8166-1.1364 9.1193-6.9806 9.1193-6.9806 1.2389 3.3558 3.291 5.1276 10.236 5.8443" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.39557;stroke-width:1.6224;stroke:#fff"/>
          <path d="m21.929 172.41c7.8166-1.1364 9.1193-6.9806 9.1193-6.9806 1.2389 3.3558 3.291 5.1276 10.236 5.8443" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.39557;stroke-width:1.6224;stroke:#fff"/>
          </svg>`,
      },
      one: {
        name: 'one',
        top: 0,
        left: 0,
        width: 139,
        w: 139,
        h: 200,
        onCollide: 'skim',
        surface: [new Collidable({ x: 0, y: 0, w: 120, h: 200 })], // a list of collision boxes
        ghosts: [], // a list of ghost collision boxes
        s: [new Collidable({ x: 0, y: 0, w: 120, h: 200 })], // a list of collision boxes
        g: [], // a list of ghost collision boxes
        content: `<svg viewBox="0 0 139 200" %style%>
          <path d="m7.7782 17.324s-3.5355 27.577-4.2426 47.376c-0.70711 19.799 8.8388 45.255 9.8995 64.347s-2.1213 32.173-5.6569 46.316c-3.7031 14.813 8.4853 19.092 8.4853 19.092 41.366 9.5459 79.196 5.3033 97.581-0.35355 11.314-5.3033 12.728-38.184 13.081-63.64 0.35356-25.456-13.851-44.077-12.728-65.407 1.0606-20.153 1.4142-28.991 3.8891-43.487 2.2642-13.262-10.607-18.385-10.607-18.385s-89.449-12.728-99.702 14.142z" style="fill:#3537d8;paint-order:fill markers stroke"/>
          <path d="m41.588 53.518c7.8166-1.1364 9.1193-6.9806 9.1193-6.9806 1.2389 3.3558 3.291 5.1276 10.236 5.8443" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.39557;stroke-width:1.6224;stroke:#fff"/>
          <path d="m67.842 79.298c7.8166-1.1364 9.1193-6.9806 9.1193-6.9806 1.2389 3.3558 3.291 5.1276 10.236 5.8443" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.39557;stroke-width:1.6224;stroke:#fff"/>
          <path d="m23.288 90.081c7.8459-1.0331 9.1535-6.3461 9.1535-6.3461 1.2436 3.0508 3.3033 4.6615 10.274 5.313" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.39557;stroke-width:1.5498;stroke:#fff"/>
          <path d="m51.539 142.08c7.8166-1.1364 9.1193-6.9806 9.1193-6.9806 1.2389 3.3558 3.291 5.1276 10.236 5.8443" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.39557;stroke-width:1.6224;stroke:#fff"/>
          <path d="m87.953 126.61c7.8166-1.1364 9.1193-6.9806 9.1193-6.9806 1.2389 3.3558 3.291 5.1276 10.236 5.8443" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.39557;stroke-width:1.6224;stroke:#fff"/>
          <path d="m22.282 154.03c7.8166-1.1364 9.1193-6.9806 9.1193-6.9806 1.2389 3.3558 3.291 5.1276 10.236 5.8443" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.39557;stroke-width:1.6224;stroke:#fff"/>
          </svg>`,
      },
    },
    bridge: {
      basic: {
        name: 'basic',
        top: 0,
        left: 0,
        width: 150,
        w: 50,
        h: 50,
        onCollide: 'skim',
        // if we collide with a transition rectangle the moving item's layer is changed
        // each move checks if we are still colliding with
        transitions: [{}],
        surface: [new Collidable({ x: 0, y: 0, w: 150, h: 210 })], // a list of collision boxes
        ghosts: [new Collidable({ x: 0, y: 0, w: 0, h: 0 })], // a list of ghost collision boxes
        s: [new Collidable({ x: 0, y: 0, w: 150, h: 210 })], // a list of collision boxes
        g: [new Collidable({ x: 0, y: 0, w: 0, h: 0 })], // a list of ghost collision boxes
        content: `<svg viewBox="0 0 212 108" style="left:%left%px; top:%top%px; width:%width%px;">
          <rect x="2.125" y="36.773" width="207.53" height="68.936" style="fill:#79642a;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.9073;stroke:#000"/>
          <path d="m25.875 9.419 0.35355 31.466v0" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.8;stroke:#1d1909"/>
          <path d="m24.107 19.319 0.35355 22.627" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.27848;stroke-width:2.9;stroke:#fff"/>
          <path d="m87.41 8.2058 0.35355 31.466v0" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.8;stroke:#1d1909"/>
          <path d="m85.643 18.105 0.35355 22.627" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.27848;stroke-width:2.9;stroke:#fff"/>
          <path d="m56.046 7.8419 0.35355 31.466v0" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.8;stroke:#1d1909"/>
          <path d="m54.279 17.741 0.35355 22.627" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.27848;stroke-width:2.9;stroke:#fff"/>
          <path d="m120.19 8.2873 0.35355 31.466v0" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.8;stroke:#1d1909"/>
          <path d="m118.42 18.187 0.35355 22.627" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.27848;stroke-width:2.9;stroke:#fff"/>
          <path d="m153.15 9.2665 0.35355 31.466v0" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.8;stroke:#1d1909"/>
          <path d="m151.38 19.166 0.35355 22.627" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.27848;stroke-width:2.9;stroke:#fff"/>
          <path d="m185.68 8.166 0.35355 31.466v0" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.8;stroke:#1d1909"/>
          <path d="m183.92 18.065 0.35355 22.627" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.27848;stroke-width:2.9;stroke:#fff"/>
          <path d="m202.23 7.0711-195.52-1.4142" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.9;stroke:#1d1909"/>
          <path d="m5.6569 4.2426 191.27 0.70711h-1.0607" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.2;stroke:#5c594d"/>
          <path d="m27.117 70.919 0.35355 31.466v0" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.8;stroke:#1d1909"/>
          <path d="m25.349 80.819 0.35355 22.627" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.27848;stroke-width:2.9;stroke:#fff"/>
          <path d="m88.652 69.706 0.35355 31.466v0" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.8;stroke:#1d1909"/>
          <path d="m86.884 79.606 0.35355 22.627" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.27848;stroke-width:2.9;stroke:#fff"/>
          <path d="m57.288 69.342 0.35355 31.466v0" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.8;stroke:#1d1909"/>
          <path d="m55.52 79.242 0.35355 22.627" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.27848;stroke-width:2.9;stroke:#fff"/>
          <path d="m121.43 69.788 0.35355 31.466v0" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.8;stroke:#1d1909"/>
          <path d="m119.66 79.687 0.35355 22.627" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.27848;stroke-width:2.9;stroke:#fff"/>
          <path d="m154.39 70.767 0.35355 31.466v0" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.8;stroke:#1d1909"/>
          <path d="m152.62 80.666 0.35355 22.627" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.27848;stroke-width:2.9;stroke:#fff"/>
          <path d="m186.93 69.666 0.35355 31.466v0" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.8;stroke:#1d1909"/>
          <path d="m185.16 79.566 0.35355 22.627" style="fill:none;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:.27848;stroke-width:2.9;stroke:#fff"/>
          <path d="m203.47 68.571-195.52-1.4142" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:8.9;stroke:#1d1909"/>
          <path d="m6.8987 65.743 191.27 0.70711h-1.0607" style="fill:#1d1909;paint-order:fill markers stroke;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.2;stroke:#5c594d"/>
          </svg>`,
      },
    },
    world: {
      basic: {
        name: 'world',
        w: 5000,
        h: 5000,
        html: '',
        content: '',
      },
    },
    controls: {
      basic: {
        name: 'controls',
        w: 200,
        h: 200,
        content: '',
      },
    },
    buttons: {
      up: {
        name: 'up',
        w: 50,
        h: 50,
        content: `UP`,
      },
      down: {
        name: 'down',
        w: 50,
        h: 50,
        content: `DOWN`,

      },
      left: {
        name: 'left',
        w: 50,
        h: 50,
        content: `LEFT`,
      },
      right: {
        name: 'right',
        w: 50,
        h: 50,
        content: `RIGHT`,
      },
      lu: {
        name: 'lu',
        w: 50,
        h: 50,
        content: `LU`,
      },
      ld: {
        name: 'ld',
        w: 50,
        h: 50,
        content: `LD`,
      },
      ru: {
        name: 'ru',
        w: 50,
        h: 50,
        content: `RU`,
      },
      rd: {
        name: 'rd',
        w: 50,
        h: 50,
        content: `RD`,
      },
      inv: {
        name: 'inv',
        w: 50,
        h: 50,
        content: `Inv`,
      },
      use: {
        name: 'use',
        w: 50,
        h: 50,
        content: `Use`,
      }      
    }
  }

};


