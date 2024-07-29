class Mover extends Item {

  velocity = new Vector();
  acceleration = new Vector();
  velocityThreshold = 0.9;
  maxSpeed = 10;
  friction = 0.9;
  lastPostcode = null;
  moveStep = 1;

  constructor(params) {
    super(params);
  }

  move() {
    this.calcAcceleration();
    this.applyMomentum();
    this.applyFriction();
    this.applyVector();
    if (app.scrollBrowser) {
      world.centerPlayer();
    }
  }

  calcAcceleration() {
    this.acceleration.clear();
    if (app.input.anyKeysPressed()) {
      app.input.keys.list.forEach(key => {
        let direction = app.input.directions[key];
        this.acceleration.add(direction);
        this.acceleration.multiply(this.moveStep);
        app.msg(2, this.acceleration, 'accel');
      });
    } else if (!app.input.touchPoint.isZero()) {
      this.acceleration = app.input.touchPoint.clone();
      this.acceleration.take(this);
      this.acceleration.round(2);
      app.msg(2, this.acceleration, 'accel');
    }
  }

  applyFriction() {
    if (this.velocity.isZero()) return;

    console.log(this.velocity, 1);
    this.velocity.multiply(this.friction);
    if (this.velocity.magnitude() < this.friction) {
      this.velocity.clear();
    }
    this.velocity.round(2);
  }
  
  applyMomentum() {
    // Accumulate the acceleration into the velocity
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
  }
  
  applyVector() {
    if (this.velocity.isZero()) return;
    
    console.log(this.velocity, 2);
    app.msg(3, this.velocity, 'velocity');
    // add the vector to the current position
    this.add(this.velocity);
    this.position();
  }
}