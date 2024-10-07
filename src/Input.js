class Input {

  keys = new UniqueSet(); // the direction keys currently held down
  touchPoint = new Rectangle({ x: 0, y: 0, w: 20, h: 20 });  // where the user has touched
  active = false;
  ignoreClasses = ['controls', 'buttons'];

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
    });

    window.addEventListener('resize', (event) => {
      clearTimeout(app.debounceTimeout);
      app.debounceTimeout = setTimeout(() => {
        console.log('resize');
        app.overlays.updateBlurOverlay();
        // if (!dialog.hasInput) {
        //   location.reload();
        // }
      }, 200); // 200ms delay
    });

    /** handle both mouse and touch events as one */
    document.addEventListener('pointerdown', (event) => {
      if (app.dialogShown) return;
      if (this.pointerdown) return;
      if (event.button === 2) return;
      this.active = true;
      app.world.showCursor();
      event.preventDefault();

      const targetClassList = event.target.classList;
      // ignore the event if the target has one of the ignore classes 
      if (this.ignoreClasses.some(className => targetClassList.contains(className))) {
        return;
      }

      // Get the click coordinates
      this.setTouchPoint(event);
    });

    document.addEventListener('pointerup', (event) => {
      this.mousedown = false;
      this.endInput();
    });

    document.addEventListener('pointermove', (event) => {
      app.world.showCursor();
      if (!this.mousedown) return;
      this.endInput();
      this.setTouchPoint(event);
    });
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
    //this.clearTouchPoint();
    app.endMovement();
  }

  // calculate real x, y based on touchPoint and worlds offset
  setTouchPoint(event) {
    if (this.mousedown) return;

    this.mousedown = true;
    this.touchPoint.set(
      event.clientX + app.scrollable.div.scrollLeft,
      event.clientY + app.scrollable.div.scrollTop,
    );
    this.touchPoint.round(2);
    this.showTouchPoint();
  }

  // no longer mouse down or touching/dragging
  clearTouchPoint() {
    this.mousedown = false;
    this.touchPoint.clear();
  }

  showTouchPoint() {
    if (!app.showTouchPoint) return;
    if (!this.touchPointDiv) {
      app.world.add(`<div id="touchId">`);
      this.touchPointDiv = document.querySelector('#touchId');
    }
    this.touchPointDiv.style.display = 'block';
    const touchPos = this.touchPoint.copy();
    const centre = this.touchPoint.center();
    touchPos.take(centre);
    app.world.setPos(this.touchPointDiv, touchPos);
    app.animate(this.touchPointDiv, 'shrink', 1, () => { this.touchPointDiv.style.display = 'none'; });
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
