import Utils from './Utils.js';
import IndexList from './IndexList.js';

export default class Asset extends IndexList {
  constructor() {
    super('asset');
    this.loadAssets();
  }

  /**
   * Returns a fleshed-out item with html string and collision collideList etc..
   * @param {Item} item 
   * @returns {object} itemInfo
   */
  make(item) {
    let itemInfo = this.get(item.type);
    itemInfo = { ...itemInfo, ...item };
    const set = this.getSet(item);
    itemInfo.html = this.htmlSets[set];
    itemInfo.html = Utils.replaceParams(itemInfo.html, itemInfo);
    return itemInfo;
  }

  /**
   * Based on the type, get different wrapping html (item, button etc..)
   * @param {object} itemInfo 
   * @returns {string} set
   */
  getSet(item) {
    const set = 'item';
    if (item.type.includes('button')) {
      set = 'button';
    } else if (item.type.includes('control')) {
      set = 'control';
    }
    return set;
  }

  htmlSets = {
    item: `<div id="%id%" class="%type% item" style="width: %w%px; height: 1px;">%shadows%%content%</div>`,
    control: `<div id="%id%" class="%type%" style="left:%x%px; bottom:%y%px; width: %w%px; height: %h%px;">%content%</div>`,
    button: `<div id="%id%" class="%type%" style="left:%x%px; top:%y%px; width: %w%px; height: %h%px;">%content%</div>`
  }

  /**
 * 
 * @param {object} params with a .qty 
 * @returns {string} the html for showing a qty for a button
 */
  buildQty(params) {
    return `<div class="qty">${params.qty}</div>`;
  }

  /**
* Buids the img or dvg for display in an inv button
* 
* @param {object} params 
* @returns 
*/
  buildInvHtml(params) {
    let html = Utils.replaceParams(params.content, params);
    html += assets.buildQty(params);
    return html;
  }

  loadAssets() {
    this.list = {
      cubeface: {
        onCollide: 'skim',
        top: -30, // raise this so bottom of image is at bottom of collision y: 0 + h:15
        left: -10, // compensate for left padding around image (if any)
        w: 50, // width of image including padding, height is auto
        // collision boxes, first is matching the parent div x,y then whatever height and width for the collision box (can be more than one)
        // ghost boxes are shifted y to close to the top of the image and extend down to top of collision box s
        // shadows arre wider versions of the collision box/s but will be drawn into the png using a transparent layer
        collideList: {
          s: [{ x: 0, y: 0, w: 30, h: 15 }], // a list of collision boxes
          g: [{ x: 0, y: -20, w: 30, h: 20 }], // a list of ghost collision boxes
        },
        content: `<img src="img/cube_basic_1_2.png" %style%>`,
      },
      tree_01: {
        onCollide: 'skim',
        top: -60,
        left: -15,
        w: 70,
        collideList: {
          s: [{ x: 0, y: 0, w: 30, h: 15 }], // a list of collision boxes
          g: [{ x: 0, y: -45, w: 30, h: 45 }], // a list of ghost collision boxes
        }, content: `<img src="img/tree_01.png" %style%>`,
      },
      tree_02: {
        top: -80,
        left: -30,
        w: 70,
        collideList: {
          s: [{ x: 0, y: 0, w: 20, h: 15 }], // a list of collision boxes
          g: [{ x: 0, y: -50, w: 20, h: 50 }], // a list of ghost collision boxes
        }, content: `<img src="img/tree_02.png" %style%>`,
      },

      rock_01: {
        top: -20,
        left: -5,
        w: 50,
        onCollide: 'stop',
        collideList: {
          s: [{ x: 0, y: 0, w: 40, h: 10 }], // a list of collision boxes
        }, content: ``,
      },
      rock_02: {
        top: -20,
        left: -5,
        w: 50,
        onCollide: 'stop',
        collideList: {
          s: [{ x: 0, y: 0, w: 40, h: 10 }], // a list of collision boxes
        }, content: `<img src="img/rock_02.png" %style%>`,
      },
      world: {
        name: 'world',
        w: 5000,
        h: 5000,
        html: '',
        content: '',
      },
      controls: {
        name: 'controls',
        w: 200,
        h: 200,
        content: '',
      },
      button_up: {
        name: 'up',
        w: 50,
        h: 50,
        content: `UP`,
      },
      button_down: {
        name: 'down',
        w: 50,
        h: 50,
        content: `DOWN`,

      },
      button_left: {
        name: 'left',
        w: 50,
        h: 50,
        content: `LEFT`,
      },
      button_right: {
        name: 'right',
        w: 50,
        h: 50,
        content: `RIGHT`,
      },
      button_lu: {
        name: 'lu',
        w: 50,
        h: 50,
        content: `LU`,
      },
      button_ld: {
        name: 'ld',
        w: 50,
        h: 50,
        content: `LD`,
      },
      button_ru: {
        name: 'ru',
        w: 50,
        h: 50,
        content: `RU`,
      },
      button_rd: {
        name: 'rd',
        w: 50,
        h: 50,
        content: `RD`,
      },
      button_inv: {
        name: 'inv',
        w: 50,
        h: 50,
        content: `Inv`,
      },
      button_use: {
        name: 'use',
        w: 50,
        h: 50,
        content: `Use`,
      },
      button_dof: {
        name: 'dof',
        w: 50,
        h: 50,
        content: `DOF`,
      },
      button_pick: {
        name: 'dof',
        w: 50,
        h: 50,
        content: `Pickup`,
      },
    }
  }
}