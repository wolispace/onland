import Screen from './Screen.js';
import Point from './Point.js';
import Vector from './Vector.js';

export default class Joystick {
  constructor(options = {}) {
    this.maxRadius = options.maxRadius || 100; // Maximum distance the joystick can be dragged
    this.friction = options.friction || 0.95; // Friction coefficient when released

    // Current state
    this.active = false;
    this.origin = new Point();     // Where the touch started
    this.current = new Point();     // Current touch position
    this.vector = new Vector();      // Normalized direction vector
    this.magnitude = 0;                 // Current magnitude (0-1)
    this.distance = 0;  // how far from the start is the joystick

    // Bind methods
    this.handleStart = this.handleStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);

    // Setup event listeners
    this.setupEventListeners();

    // prepare display of joystick
    this.stick = Screen.getElement('stick');
    this.start = Screen.getElement('start');
  }

  setupEventListeners() {
    // Handle both mouse and touch events
    document.addEventListener('mousedown', this.handleStart);
    document.addEventListener('mousemove', this.handleMove);
    document.addEventListener('mouseup', this.handleEnd);

    document.addEventListener('touchstart', this.handleStart);
    document.addEventListener('touchmove', this.handleMove);
    document.addEventListener('touchend', this.handleEnd);
  }

  handleStart(event) {
    this.active = true;

    // Get position from either mouse or touch event
    const pos = this.getEventPosition(event);
    this.origin = new Point(pos);
    this.current = new Point(pos);
    this.draw();
  }

  handleMove(event) {
    if (!this.active) return;
    
    event.preventDefault();
    const pos = this.getEventPosition(event);
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
    this.active = false;
    this.distance = 0;
    this.hide();
    // Keep the last vector direction but start reducing magnitude
  }

  draw() {
    // draw the starting point - offset by half its size
    const startPos = new Point(this.origin);
    startPos.take(new Point(50, 50));
    this.start.style.display = 'block';
    this.start.style.transform = `translate(${startPos.x}px, ${startPos.y}px)`;
    
    // draw the stick top
    this.stick.style.display = 'block';
    this.redraw();
  }

  redraw() {
    const containerPos = this.current.copy();
    containerPos.take(new Point(10, 10));

    this.stick.style.transform = `translate(${containerPos.x}px, ${containerPos.y}px)`;
  }

  hide() {
    this.start.style.display = 'none';
    this.stick.style.display = 'none';
  }

  getEventPosition(event) {
    if (event.touches) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    }
    return {
      x: event.clientX,
      y: event.clientY
    };
  }

  update() {
    // If not active, apply friction to magnitude
    if (!this.active && this.magnitude > 0) {
      this.magnitude *= this.friction;
      if (this.magnitude < 0.01) this.magnitude = 0;
    }

    // Return current vector and magnitude for use in movement
    return {
      x: this.vector.x * this.magnitude,
      y: this.vector.y * this.magnitude,
      magnitude: this.magnitude,
      active: this.active
    };
  }

  status() {
    return {
      active: this.active,
      vector: this.vector,
      magnitude: this.magnitude
    };
  }

  
}
