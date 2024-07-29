class Input {

  keys = new UniqueSet(); // the direction keys currently held down
  touchPoint = new Rectangle({ x: 0, y: 0, w: 20, h: 20 });  // where the user has touched
  active = false;

  constructor() {
    this.setupEvents();
    this.setDirections();
  }

  setupEvents() {
    // prevent context menus - does this prevent mobile selecting text
    // so we need the user-select: none; css?
    document.addEventListener('contextmenu', event => {
      if (!app.contextMenu) {
        event.preventDefault();
      }
    });

    document.addEventListener("keydown", (event) => {
      app.world.hideCursor();
      event.preventDefault();
      let keyCode = this.normaliseKey(event.code);
      // Set the state of the pressed key to true
      if (this.keys.has(keyCode)) return;

      let directionVector = this.directions[keyCode];
      if (directionVector) {
        this.keys.add(keyCode);
        this.active = true;
        app.msg(1, this.keys, 'keyDown');
      } else if (event.code == 'Space') {
        console.log('digging');
      } else if (event.code == 'Enter') {
        console.log('confirm dialog');
      } else if (event.code == 'Escape') {
        console.log('cancel dialog');
      }
    });

    document.addEventListener("keyup", (event) => {
      //event.preventDefault();
      let keyCode = this.normaliseKey(event.code);
      this.keys.take(keyCode);

      this.endInput();
      app.msg(1, this.keys, 'keyUp');
    });

    // if they touched something
    ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(eventName => {
      document.addEventListener(eventName, this.handleTouchEvent, { passive: false });
    });

    window.addEventListener("resize", (event) => {
      clearTimeout(app.debounceTimeout);
      app.debounceTimeout = setTimeout(() => {
        console.log("resize");
        // if (!dialog.hasInput) {
        //   location.reload();
        // }
      }, 200); // 200ms delay
    });

    document.addEventListener("mousedown", (event) => {
      this.mousedown = true;
      this.active = true;
      app.world.showCursor();
      event.preventDefault();

      // Check if the click target is a control button
      if (event.target.classList.contains('control')) {
        console.log('it\'s a control button');
        return;
      }

      // Get the click coordinates
      this.setTouchPoint(event);
      app.msg(1, this.touchPoint, 'mousedown');
      app.me.move();
    });

    document.addEventListener("mouseup", (event) => {
      this.mousedown = false;
      this.touchPoint.clear();
      this.endInput();
      app.msg(1, this.touchPoint, 'mouseup');
    });

    document.addEventListener("mousemove", (event) => {
      if (!this.mousedown) return;
      this.touchPoint.clear();
      this.endInput();
      this.setTouchPoint(event);
      app.me.move();
    });
  }

  // use () => {} so we can access this.
  handleTouchEvent = (event) => {
    let touch = event.touches[0];

    if (touch) {
      if (touch.target.classList.contains('control')) {
        console.log('its a control button');
        return;
      }
    }

    if (['touchend'].includes(event.type)) {
      this.endInput();
    }

    // if its not something we want touched, prevent defaults
    if (!['BUTTON', 'INPUT', 'LABEL', 'DIV', 'svg', 'path', 'rect', 'ellipse', 'text'].includes(event.target.tagName)) {
      event.preventDefault();
    }
  }

  // the whole screen is the controller input.. not ideal
  touchMove = (touch) => {
    let parentDiv = app.findParentDiv(touch.target);

    if (parentDiv.classList.contains('controls')) {
      app.msg(1, 'controls!');
      return;
    }

    app.me.move();
    app.msg(1, this.keys, 'touch move');
  }

  // returns true when no keys are pressed - then we clear the timer
  anyKeysPressed() {
    return this.keys.count() > 0;
  }

  // key no longer presses 
  endInput() {
    if (this.anyKeysPressed()) {
      return;
    }
    this.active = false;
    app.endMovement();
  }

  // calculate real x, y based on touchPoint and worlds offset
  setTouchPoint(event) {
    this.mousedown = true;
    this.touchPoint.set(
      event.clientX + app.scrollable.div.scrollLeft,
      event.clientY + app.scrollable.div.scrollTop,
    );
    this.showTouchPoint();
  }

  // us is no longer mouse down or touching/dragging
  clearTouchPoint() {
    this.mousedown = false;
    this.touchPoint.clear();
  }

  showTouchPoint() {
    if (!this.touchPointDiv) {
      app.world.add(`<div id="touchId">`);
      this.touchPointDiv = document.querySelector('#touchId');
    }
    const touchPos = this.touchPoint.clone();
    const centre = this.touchPoint.center();
    touchPos.take(centre);
    app.world.setPos(this.touchPointDiv, touchPos);
  }

  /**
   * 
   * @param {string} keyCode 
   * @returns normalised key code
   * eg: ArrowUp => up
   * eg: KeyW => up
   * eg: Space => space
   */
  normaliseKey(keyCode) {
    const key = keyCode.toLowerCase().replace('arrow', '');
    return this.oneKey(key);
  }

  /**
   * Some keys do the same thing eg keyw and up 
   * @param {*} key 
   * @returns {string} the one key we know all similar keys by eg 'up' from 'keyw'
   */
  oneKey(key) {
    const keyMap = {
      'keyw': 'up',
      'keya': 'left',
      'keys': 'down',
      'keyd': 'right',
    };
    return keyMap[key] || key;
  }

  /**
   * Keys translate to vectors we add together
   */
  setDirections() {
    this.directions = {
      'left': new Vector(-1, 0),
      'right': new Vector(1, 0),
      'up': new Vector(0, -1),
      'down': new Vector(0, 1),
    }
  }

}
