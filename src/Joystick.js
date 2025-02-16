import Point from './Point.js';
import Vector from './Vector.js';
import Screen from './Screen.js';
import Rectangle from './Rectangle.js';

export default class Joystick {
  // where on the screen should pointer interactions be treated as joystick
  zone = new Rectangle({
    x: 0,
    y: 0,
    w: 200,
    h: 500,
  });

  constructor(params) {
    this.maxRadius = params.maxRadius;
    this.status = new Point();

    // Current state
    this.active = false;
    this.origin = new Point();     // Where the touch started
    this.current = new Point();     // Current touch position
    this.vector = new Vector();      // Normalized direction vector
    this.magnitude = 0;                 // Current magnitude (0-1)
    this.distance = 0;  // how far from the start is the joystick
    // prepare display of joystick
    this.stick = Screen.getElement('stick');
    this.start = Screen.getElement('start');
  }

  update(pos) {

    if (!this.active) {
      this.handleStart(pos);
    } else {
      this.handleMove(pos);
    }
  }


  // ---------- BELOW needs a rethink as we move to InputManager for mouse tracking=

  handleStart(pos) {
    this.active = true;
    this.origin = new Point(pos);
    this.current = new Point(pos);
    this.draw();
  }

  handleMove(pos) {
    if (!this.active) return;

    this.current = new Point(pos);

    // Calculate vector from origin to current position
    let dis = this.current.copy().take(this.origin);

    // Calculate distance
    this.distance = Math.sqrt(dis.x * dis.x + dis.y * dis.y);

    // Normalize the vector
    if (this.distance > 0) {
      this.vector.x = dis.x / this.distance;
      this.vector.y = dis.y / this.distance;
    }

    // Calculate magnitude (0-1)
    this.magnitude = Math.min(this.distance / this.maxRadius, 1);

    //stop drawing if past limit of joystick
    // DODO: we dont want to stop but keep moving but not outside limit
    if (this.distance > 40) return;
    this.redraw();
  }


  handleEnd() {
    if (!this.active) return;
    this.active = false;
    this.distance = 0;
    this.vector = new Vector();
    this.hide(this.start);
    this.hide(this.stick);
    // Keep the last vector direction but start reducing magnitude
  }

  draw() {
    // draw the starting point - offset by half its size
    const startPos = new Point(this.origin);
    startPos.take(new Point(50, 50));
    this.start.style.display = 'block';
    this.start.style.transform = `translate(${startPos.x}px, ${startPos.y}px)`;
    this.start.style.opacity = 1;

    // draw the stick top
    this.stick.style.display = 'block';
    this.stick.style.opacity = 1;
    this.redraw();
  }

  redraw() {
    const containerPos = this.current.copy();
    containerPos.take(new Point(10, 10));

    this.stick.style.transform = `translate(${containerPos.x}px, ${containerPos.y}px)`;
  }

  /**
   * Fade the element away
   * @param {element} element 
   */
  hide(element) {
    element.style.transition = 'opacity 0.3s ease-out';
    element.style.opacity = '0';
  }


}
