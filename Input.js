class Input {

    keys = []; // the keys currently held down
    touchPoint = new Vector(0, 0);  // where the user has touched
  
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
        // Set the state of the pressed key to true
        if (this.keys.includes(event.code)) {
          return;
        }
  
        //event.preventDefault();
        let direction = app.getDirection(event.code);
        if (app.isDirection(direction)) {
          this.keys.push(event.code);
          app.msg(1, this.keys, 'keyDown');
        } else if (event.code == 'Space') {
          app.me.dig();
        } else if (event.code == 'Enter') {
          app.dialog.confirm();
        } else if (event.code == 'Escape') {
          app.dialog.cancel();
        }
      });
  
      document.addEventListener("keyup", (event) => {
        //event.preventDefault();
        this.removeKey(event.code);
        this.endInput();
        app.msg(1, this.keys, 'keyUp');
      });
  
      document.addEventListener("mousemove", (event) => {
        app.world.showCursor();
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
        app.world.showCursor();
        event.preventDefault();
  
        // Check if the click target is a control button
        if (event.target.classList.contains('control')) {
          console.log('it\'s a control button');
          return;
        }
  
        this.mousedown = true;
        app.msg(1, 'Mouse Click', 'click');
  
        // Get the click coordinates
        this.setTouchPoint(event);
        app.me.move();
      });
  
      document.addEventListener("mouseup", (event) => {
        this.touchPoint.clear();
        this.endInput();
        this.mousedown = false;
  
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
        this.clearKeys();
        this.endInput();
      }
  
      // this is when the whole screen is the controller.. not great.
      // if (['touchstart', 'touchmove'].includes(event.type)) {
      //   this.touchMove(touch);
  
      // } else if (['touchend'].includes(event.type)) {
      //   this.clearKeys();
      //   this.endInput();
      // }
      // app.msg(1, this.keys, 'handleTouchEvent');
  
      // if its not something we want touched, prevent defaults
      if (!['BUTTON', 'INPUT', 'LABEL', 'DIV', 'svg', 'path', 'rect', 'ellipse', 'text'].includes(event.target.tagName)) {
        event.preventDefault();
      }
    }
  
    // the whole screen is the controller input.. not ideal
    touchMove = (touch) => {
      const buffer = 50;
      let parentDiv = app.findParentDiv(touch.target);
  
      if (parentDiv.classList.contains('controls')) {
        app.msg(1, 'controls!');
        return;
      }
  
      // Get the screen dimensions
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
  
      // Calculate the center of the screen
      const centerX = screenWidth / 2;
      const centerY = screenHeight / 2;
  
      // Determine the direction based on touch position relative to the center
      if (touch.clientX < centerX - buffer) {
        this.keys.push("keyA");
      }
      if (touch.clientX > centerX + buffer) {
        this.keys.push("keyD");
      }
      if (touch.clientY < centerY - buffer) {
        this.keys.push("keyW");
      }
      if (touch.clientY > centerY + buffer) {
        this.keys.push("keyS");
      }
      app.me.move();
      app.msg(1, this.keys, 'touch move');
    }
  
    clearKeys() {
      this.keys = [];
      app.msg(1, this.keys, 'clearKeys');
    }
  
    // Remove a key eg: "up" from the array of keys helps down
    removeKey(key) {
      //console.log('remove key', key);
      let index = this.keys.indexOf(key);
      if (index !== -1) {
        this.keys.splice(index, 1);
      }
      app.msg(1, this.keys, `removeKey ${key}`);
    }
    // returns true when no keys are pressed - then we clear the timer
    anyKeysPressed() {
      return this.keys.length > 0;
    }
  
    // key no longer presses 
    endInput() {
      if (this.anyKeysPressed()) {
        return;
      }
      app.endMovement();
    }
  
    // calculate real x, y based on touchPoint and worlds offset
    setTouchPoint(event) {
      this.touchPoint.set(
        event.clientX + app.scrollable.div.scrollLeft,
        event.clientY + app.scrollable.div.scrollTop,
      );
    }
  
    showTouchPoint() {
      const html = `<div class="ghostZone" 
      style="top:${this.touchPoint.y}px; 
      left:${this.touchPoint.x}px; 
      width: 20px;
      height: 20px; ">`;
      app.world.add(html);
    }
  
    setDirections() {
      app.directions = {
        'left': { axis: 'x', 'dir': -app.moveStep, acceleration: -1, velocity: 1 },
        'right': { axis: 'x', 'dir': app.moveStep, acceleration: 1, velocity: 1 },
        'up': { axis: 'y', 'dir': -app.moveStep, acceleration: -1, velocity: 1 },
        'down': { axis: 'y', 'dir': app.moveStep, acceleration: 1, velocity: 1 },
        'keyw': 'up',
        'keya': 'left',
        'keys': 'down',
        'keyd': 'right'
      };
    }
  }
  