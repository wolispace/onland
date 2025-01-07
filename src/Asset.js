import Utils from './Utils.js';

import Collidable from './Collidable.js';
export default class Asset {
  constructor() {
    this.loadAssets();
  }

  make(type) {
    const item = this.list[type];
    return item;
  }

  htmlSets = {
    items: `<div id="%id%" class="%type% item" style="width: %w%px; height: 1px;">%shadows%%content%</div>`,
    controls: `<div id="%id%" class="%type%" style="left:%x%px; bottom:%y%px; width: %w%px; height: %h%px;">%content%</div>`,
    buttons: `<div id="%id%" class="%type%" style="left:%x%px; top:%y%px; width: %w%px; height: %h%px;">%content%</div>`
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
        s: [new Collidable({ x: 0, y: 0, w: 30, h: 15 })], // a list of collision boxes
        g: [new Collidable({ x: 0, y: -20, w: 30, h: 20 })], // a list of ghost collision boxes
        d: [new Collidable({ x: -15, y: -10, w: 50, h: 35 })], // a list of shadows
        content: `<img src="img/cube_basic_1_2.png" %style%>`,
      },
      tree_01: {
        onCollide: 'skim',
        top: -60,
        left: -15,
        w: 70,
        s: [new Collidable({ x: 0, y: 0, w: 30, h: 15 })], // a list of collision boxes
        g: [new Collidable({ x: 0, y: -45, w: 30, h: 45 })], // a list of ghost collision boxes
        d: [new Collidable({ x: -10, y: -10, w: 50, h: 35 })], // a list of shadow boxes
        content: `<img src="img/tree_basic.png" %style%>`,
      },
      tree_02: {
        top: -80,
        left: -30,
        w: 70,
        s: [new Collidable({ x: 0, y: 0, w: 20, h: 15 })], // a list of collision boxes
        g: [new Collidable({ x: 0, y: -50, w: 20, h: 50 })], // a list of ghost collision boxes
        content: `<img src="img/tree_001a.png" %style%>`,
      },

      rock_01: {
        top: -20,
        left: -5,
        w: 50,
        onCollide: 'stop',
        s: [new Collidable({ x: 0, y: 0, w: 40, h: 10 })], // a list of collision boxes
        g: [], // no need for ghosting small slow objects
        d: [new Collidable({ x: -20, y: -5, w: 60, h: 20 })], // a list of shadow boxes
        content: ``,
      },
      rock_002: {
        top: -20,
        left: -5,
        w: 50,
        onCollide: 'stop',
        s: [new Collidable({ x: 0, y: 0, w: 40, h: 10 })], // a list of collision boxes
        g: [], // no need for ghosting small slow objects
        content: `<img src="img/rock_001a.png" %style%>`,
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