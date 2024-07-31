class Mover extends Item {

  velocity = new Vector();
  acceleration = new Vector();
  maxSpeed = 10;
  friction = 0.7;
  precision = 1;
  lastPostcode = null;
  moveStep = 1;
  endTouchZone = 20;

  constructor(params) {
    super(params);
  }

  move() {
    this.calcAcceleration();
    this.applyMomentum();
    this.applyFriction();
    this.applyVector();
    if (app.scrollBrowser) {
      app.world.centerPlayer();
    }
  }

  calcAcceleration() {
    this.acceleration.clear();
    if (app.input.anyKeysPressed()) {
      app.input.keys.list.forEach(key => {
        let direction = app.input.directions[key];
        this.acceleration.add(direction);
        this.acceleration.multiply(this.moveStep);
        this.acceleration.round(this.precision);
        app.msg(2, this.acceleration, 'accel A ');
      });
    } else if (!app.input.touchPoint.isZero()) {
      this.acceleration = app.input.touchPoint.clone();
      this.acceleration.take(this);
      this.acceleration.normalise();
      this.acceleration.multiply(this.moveStep);
      this.acceleration.round(this.precision);
      app.msg(2, this.acceleration, 'accel M ');
    }
  }

  applyFriction() {
    if (this.velocity.isZero()) return;
    if (app.input.active) return;
    if (!app.input.touchPoint.isZero()) return;

    this.velocity.multiply(this.friction);
    if (this.velocity.magnitude() < this.friction) {
      this.velocity.clear();
    }
  }
  
  applyMomentum() {
    // Accumulate the acceleration into the velocity
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
  }
  
  applyVector() {
    if (this.velocity.isZero()) return;
    
    this.velocity.round(this.precision);
    
    app.msg(3, this.velocity, 'velocity'); 
    // add the vector to the current position
    // have we reached the touchPoint if one is set?
    if (app.input.touchPoint.isZero() == false) {
      // if the distance between this item and the touchPoint is less than a specific size then stop moving (apply friction)
      if (this.distance(app.input.touchPoint) <= this.endTouchZone) { 
          app.input.touchPoint.clear();
          this.velocity.multiply(0.5);
          this.applyFriction();
      }

      if (this.velocity.isZero()) return;
      //console.log(app.input.touchPoint.toString());
    }
    this.velocity.round(this.precision);
    this.add(this.velocity);
    this.position();
  }
}