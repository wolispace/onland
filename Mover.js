class Mover extends Item {

  velocity = new Vector();
  acceleration = new Vector();
  maxSpeed = 10;
  friction = 0.7;
  precision = 1;
  postcode = '0_0';
  moveStep = 1;
  endTouchZone = 20;
  collisionSlide = 0.5;

  constructor(params) {
    super(params);
  }

  move() {
    this.calcAcceleration();
    this.applyMomentum();
    this.applyFriction();
    this.backupPos();
    this.applyVelocity();
    this.checkCollisions('surface');
    this.checkGhosts();
    this.removeGhosts();
    shiftSuburbsAsync(this);
    if (app.scrollBrowser) {
      app.world.centerPlayer();
    }
    app.msg(1, { x: Math.round(this.x, 0), y: Math.round(this.y, 0) }, 'pos');
  }

  recordLastSuburbs() {
    this.postcode = app.world.grids.suburbs.makeKey(this);
    // find the kings square around it
    app.lastShown = app.world.grids.suburbs.kingsSquare(suburb);
  }

  calcAcceleration() {
    this.acceleration.clear();
    if (app.input.anyKeysPressed()) {
      app.input.keys.list.forEach(key => {
        let direction = app.input.directions[key];
        this.acceleration.add(direction);
        this.acceleration.multiply(this.moveStep);
        this.acceleration.round(this.precision);
        //app.msg(2, this.acceleration, 'accel A ');
      });
    } else if (!app.input.touchPoint.isZero()) {
      this.acceleration = app.input.touchPoint.copy();
      this.acceleration.take(this);
      this.acceleration.normalise();
      this.acceleration.multiply(this.moveStep);
      this.acceleration.round(this.precision);
      //app.msg(2, this.acceleration, 'accel M ');
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

  applyVelocity() {
    if (this.velocity.isZero()) return;

    this.velocity.round(this.precision);

    //app.msg(3, this.velocity, 'velocity');
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

  // backup the current position before applying the velocity and potentially colliding with something
  backupPos() {
    this.oldPos = new Point(this.x, this.y);
  }

  restorePos() {
    this.x = this.oldPos.x;
    this.y = this.oldPos.y;
  }

  myCollisionBox(layer) {
    let rectangle = this[layer][0].copyWithPos(this);
    return rectangle;
  }

  // check the grid to see what we are colliding with
  checkCollisions(layer) {
    // first collidable for the surface is the thing we are checking.
    let thisCollision = this.myCollisionBox(layer);
    let inCell = app.world.grids[layer].queryShape(thisCollision);

    if (inCell && inCell.list && inCell.list.length > 0) {
      inCell.list.forEach((itemId) => {
        let item = app.world.items[itemId];
        if (!item) return;
        //console.log(item);

        item[layer].forEach((otherItem) => {
          let collidable = otherItem.copyWithPos(item);
          let poss = thisCollision.collides(collidable);
          // if x = -1 we are on the left|top of centre, +1 is right|bottom

          if (poss.x != 0 || poss.y != 0) {
            // we hit something so return to previous pos and modify velocity before applying it again
            this.restorePos();
            if (item.onCollide === 'stop') {
              this.velocity.clear();
              app.input.clearKeys();
            } else if (item.onCollide === 'bounce') {
              this.velocity.multiply(poss);
            } else {
              if (Math.abs(this.velocity.y) > this.friction) {
                this.velocity.x = Math.abs(this.velocity.y * this.collisionSlide) * poss.x;
                this.velocity.y = 0;
              } else if (Math.abs(this.velocity.x) > this.friction) {
                this.velocity.y = Math.abs(this.velocity.x * this.collisionSlide) * poss.y;
                this.velocity.x = 0;
              }
            }
            this.velocity.limit(this.maxSpeed);
            this.applyVelocity();
          }
        });
      });
    };
  }

  // check the ghosts grid to see what we are colliding with any ghosts
  checkGhosts() {
    const inCell = app.world.grids.ghosts.queryShape(this);
    // the first collidable part of the player
    const moverRectangle = this.surface[0].copyWithPos(this);
    app.ghosted.clear();
    app.msg(3, app.ghosted.count());
    if (inCell && inCell.list && inCell.list.length > 0) {
      inCell.list.forEach((itemId) => {
        const item = app.world.items[itemId];
        if (!item) return;
        if (!app.doGhosting) return;
        item.ghosts.forEach((ghost) => {
          const ghostRectangle = ghost.copyWithPos(item);
          const poss = moverRectangle.collides(ghostRectangle);
          if (poss.x != 0 || poss.y != 0) {
            app.ghosted.add(itemId);
            // add ghost class to this item
            if (item.it) {
              item.addClass('ghost');
            }
          }
        });
      });
    }
  }

  removeGhosts() {

    if (app.ghosted.count() < 1) {
      // remove all ghost class
      var elements = document.querySelectorAll('.ghost');
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('ghost');
      }
    }
  }
}