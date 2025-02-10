/**
 * Handls keyboard, mouse and joystick inputs
 */
export default class InputManager {
  constructor() {
    this.activeInputType = null; // 'keyboard', 'joystick', 'mouse'
    this.inputState = {
      keyboard: new Map(),
      joystick: { x: 0, y: 0, active: false },
      mouse: { x: 0, y: 0, active: false }
    };
  }

  // Switch input mode and cancel others
  setActiveInput(type) {
    if (this.activeInputType !== type) {
      this.cancelCurrentInput();
      this.activeInputType = type;
    }
  }

  cancelCurrentInput() {
    switch (this.activeInputType) {
      case 'joystick':
        this.inputState.joystick = { x: 0, y: 0, active: false };
        // Trigger joystick reset event
        break;
      case 'mouse':
        this.inputState.mouse = { x: 0, y: 0, active: false };
        // Trigger mouse reset event
        break;
      case 'keyboard':
        this.inputState.keyboard.clear();
        // Trigger key reset event
        break;
    }
  }

  // Input handlers
  handleKeyboard(event) {
    this.setActiveInput('keyboard');
    this.inputState.keyboard.set(event.key, event.type === 'keydown');
  }

  handleJoystick(x, y) {
    this.setActiveInput('joystick');
    this.inputState.joystick = { x, y, active: true };
  }

  handleMouse(x, y) {
    this.setActiveInput('mouse');
    this.inputState.mouse = { x, y, active: true };
  }

  /**
   * Get current input vector regardless of source
   * TODO: convert to objects Points and Vectors
   */
  getInputVector() {
    switch (this.activeInputType) {
      case 'keyboard':
        return this.getKeyboardVector();
      case 'joystick':
        return {
          x: this.inputState.joystick.x,
          y: this.inputState.joystick.y
        };
      case 'mouse':
        return {
          x: this.inputState.mouse.x,
          y: this.inputState.mouse.y
        };
      default:
        return { x: 0, y: 0 };
    }
  }

  /**
   * one or more keys pressed are added to the list of keys down 
   * TODO: add more keys and set of keys down
   * @returns {Point}
   */
  getKeyboardVector() {
    let x = 0;
    let y = 0;
    if (this.inputState.keyboard.get('ArrowLeft')) x -= 1;
    if (this.inputState.keyboard.get('ArrowRight')) x += 1;
    if (this.inputState.keyboard.get('ArrowUp')) y -= 1;
    if (this.inputState.keyboard.get('ArrowDown')) y += 1;
    return { x, y };
  }
}
