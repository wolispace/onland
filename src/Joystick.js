import Screen from './Screen.js';
import Point from './Point.js';

export default class Joystick {
  constructor(options = {}) {
    this.maxRadius = options.maxRadius || 100; // Maximum distance the joystick can be dragged
    this.friction = options.friction || 0.95; // Friction coefficient when released

    // Current state
    this.active = false;
    this.origin = { x: 0, y: 0 };     // Where the touch started
    this.current = { x: 0, y: 0 };     // Current touch position
    this.vector = { x: 0, y: 0 };      // Normalized direction vector
    this.magnitude = 0;                 // Current magnitude (0-1)

    // Bind methods
    this.handleStart = this.handleStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);

    // Setup event listeners
    this.setupEventListeners();

    // prepare display of joystick
    this.container = Screen.getElement('joystick');
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
    this.current.x = pos.x;
    this.current.y = pos.y;
    this.draw();
  }

  handleMove(event) {
    if (!this.active) return;
    
    event.preventDefault();
    const pos = this.getEventPosition(event);
    this.current.x = pos.x;
    this.current.y = pos.y;

    // Calculate vector from origin to current position
    let dx = this.current.x - this.origin.x;
    let dy = this.current.y - this.origin.y;

    // Calculate distance
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize the vector
    if (distance > 0) {
      this.vector.x = dx / distance;
      this.vector.y = dy / distance;
    }
    
    // Calculate magnitude (0-1)
    this.magnitude = Math.min(distance / this.maxRadius, 1);
    this.redraw();
  }

  handleEnd() {
    console.log('joystick end');
    this.active = false;
    this.hide();
    // Keep the last vector direction but start reducing magnitude
  }

  draw() {
    // draw the area of the joystick
    this.container.style.display = 'block';
    const containerPos = new Point(this.origin);
    this.container.style.transform = `translate(${containerPos.x}px, ${containerPos.y}px)`;
    
    // draw the stick top
    this.stick.style.display = 'block';
    this.redraw();
    
    // draw the starting point
    this.start.style.display = 'block';
    this.start.style.transform = `translate(${this.origin.x}px, ${this.origin.y}px)`;

  }

  redraw() {
    this.stick.style.transform = `translate(${this.current.x}px, ${this.current.y}px)`;
  }

  hide() {
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

  // Optional: Draw joystick for debugging
  drawCtx(ctx) {
    if (!this.active) return;

    // Draw outer circle
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.arc(this.origin.x, this.origin.y, this.maxRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw inner circle (current position)
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.arc(this.current.x, this.current.y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Draw line connecting origin to current
    ctx.beginPath();
    ctx.moveTo(this.origin.x, this.origin.y);
    ctx.lineTo(this.current.x, this.current.y);
    ctx.stroke();
  }
}
