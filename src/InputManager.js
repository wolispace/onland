import UniqueSet from "./UniqueSet.js";
import Screen from "./Screen.js";
import Vector from "./Vector.js";

export default class InputManager {
  directionKeys = {
    "ArrowRight": {x:1, y:0},
    "ArrowLeft": {x:-1, y:0},
    "ArrowUp": {x:0, y:-1},
    "ArrowDown": {x:0, y:1},
    "KeyD": {x:1, y:0},
    "KeyA": {x:-1, y:0},
    "KeyW": {x:0, y:-1},
    "KeyS": {x:0, y:1},
    "KeyQ": {x:-1, y:-1},
    "KeyE": {x:1, y:-1},
    "KeyZ": {x:-1, y:1},
    "KeyC": {x:1, y:1},
  };

  constructor(joystick) {
    this.joystick = joystick;
    this.activeInputType = '';
    this.keys = new UniqueSet();
    this.pointer = { x: 0, y: 0, active: false, buttons: new Map() };


    // Bind event handlers
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);

    // Add event listeners
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    // Mouse events
    window.addEventListener('mousedown', this.handlePointerDown);
    window.addEventListener('mousemove', this.handlePointerMove);
    window.addEventListener('mouseup', this.handlePointerUp);

    // Touch events
    window.addEventListener('touchstart', this.handlePointerDown);
    window.addEventListener('touchmove', this.handlePointerMove);
    window.addEventListener('touchend', this.handlePointerUp);
  }

  /**
   * 
   * @returns {Vector} for the x,y direction a key maps to
   */
  directionKey(key) {
    const dir = this.directionKeys[key];
    return new Vector(dir.x, dir.y);
  }

  handleKeyDown(event) {
    this.setActiveInput('keyboard');
    this.keys.add(event.code);
    Screen.hideCursor();
  }

  handleKeyUp(event) {
    this.clearActiveInput();
    this.keys.delete(event.code);
  }

  handlePointerDown(event) {
    event.preventDefault();
    const pos = this.getPointerPosition(event);

    this.setActiveInput(event.type.startsWith('mouse') ? 'mouse' : 'touch');
    this.pointer.active = true;
    this.pointer.x = pos.x;
    this.pointer.y = pos.y;

    if (event.type.startsWith('mouse')) {
      this.pointer.buttons.set(event.button, true);
    }
  }

  handlePointerMove(event) {
    event.preventDefault();
    const pos = this.getPointerPosition(event);
    Screen.showCursor();
    this.pointer.x = pos.x;
    this.pointer.y = pos.y;
  }

  handlePointerUp(event) {
    event.preventDefault();
    this.pointer.active = false;
    this.clearActiveInput();

    if (event.type.startsWith('mouse')) {
      this.pointer.buttons.set(event.button, false);
    }
  }

  getPointerPosition(event) {
    // Handle both mouse and touch events
    if (event.type.startsWith('touch')) {
      const touch = event.touches[0] || event.changedTouches[0];
      return {
        x: touch.clientX,
        y: touch.clientY
      };
    }
    return {
      x: event.clientX,
      y: event.clientY
    };
  }

  setActiveInput(type) {
    if (this.activeInputType !== type) {
      this.activeInputType = type;
    }
  }

  clearActiveInput() {
    this.activeInputType = '';
  }

  // Get current input position
  getInputPosition() {
    return {
      x: this.pointer.x,
      y: this.pointer.y,
      active: this.pointer.active
    };
  }

  get isKeyboardActive() {
    return this.activeInputType === 'keyboard';
  }

  get isInputActive() {
    return this.activeInputType !== '';
  }

  // Check if a specific key is pressed
  isKeyPressed(keyCode) {
    return this.inputState.keyboard.get(keyCode) || false;
  }

  // Check if pointer is active (mouse button or touch)
  get isPointerActive() {
    return this.pointer.active;
  }

  // Check if a mouse button is pressed
  isMouseButtonPressed(button) {
    return this.pointer.buttons.get(button) || false;
  }

  // Clean up method to remove event listeners
  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousedown', this.handlePointerDown);
    window.removeEventListener('mousemove', this.handlePointerMove);
    window.removeEventListener('mouseup', this.handlePointerUp);
    window.removeEventListener('touchstart', this.handlePointerDown);
    window.removeEventListener('touchmove', this.handlePointerMove);
    window.removeEventListener('touchend', this.handlePointerUp);
  }
}
