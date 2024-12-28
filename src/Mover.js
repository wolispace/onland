class Mover extends Item {

  velocity = new Vector();
  acceleration = new Vector();
  accelerationRate = 0.25;
  maxSpeed = 10;
  friction = 0.5;
  precision = 1;
  postcode = '0_0';
  moveStep = 1;
  endTouchZone = 20;
  collisionSlide = 1;
  oldFacing =  {x:1, y:2};

  constructor(params) {
    super(params);
    this.setupCollideInfo();
  }

  /**
   * One off process to get the collision box for this movable item.
   * We just the the first one defined
   * Then we add this to your current position to know where the collision is
   * @returns 
   */
  setupCollideInfo() {
    if (this.collideInfo) return;
    const assetInfo = assets.get(this.type, this.variant);
    this.collideInfo = assetInfo[settings.SURFACE][0];
  }

  /**
   * Update the movable items position
   */
  update = () => {

  }

  move() {
    this.calcAcceleration();
    this.applyMomentum();
    this.applyFriction();
    this.backupPos();
    this.applyVelocity();
    // TODO: similar logic in Drawable to prevent moving something to the same x,y 
    if (this.hasNotMoved()) {
      return;
    }
    this.checkWorldBoundary();
    this.checkCollisions(settings.SURFACE);
    this.updateFacing();
    this.removeGhosts();
    this.checkGhosts();
    shiftSuburbsAsync(this);
    if (settings.scrollBrowser) {
      app.world.centerPlayer();
    }
    app.overlays.updateForPlayerPosition(this.y);
    app.world.updateBackgroundColor();
    //app.msg(1, { x: Math.round(this.x, 0), y: Math.round(this.y, 0), p: this.postcode, l: this.land }, 'pos');
  }

  calcAcceleration() {
    this.acceleration.clear();
    if (app.input.anyKeysPressed()) {
      app.input.keys.list.forEach(key => {
        let direction = app.input.directions[key];
        this.acceleration.add(direction.copy().multiply(this.accelerationRate));
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
      app.events.emit("MOVER_STOPPED", this);
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
    //this.position();
  }

  // backup the current position before applying the velocity and potentially colliding with something
  backupPos() {
    this.oldPos = new Point(this.x, this.y);
  }

  updateFacing() {
    // default facing at screen (no direction). icon = me_1_1.svg
    // 0 = -1, 1 = 0, 2 = +1 so we are +1 and don't need to worry about sign eg -1_1.svg
    this.facing = {x:1, y:1};

    if (this.oldPos.x < this.x) {
      this.facing.x = 2;
    } else if (this.oldPos.x > this.x) {
      this.facing.x = 0;
    }
    if (this.oldPos.y < this.y) {
      this.facing.y = 2;
    } else if (this.oldPos.y > this.y) {
      this.facing.y = 0;
    }
    if (this.facing.x === this.oldFacing.x && this.facing.y === this.oldFacing.y) return;
    
    const item = assets.make(this);
    this.oldFacing = this.facing;
    
    const divImg = document.querySelector(`#${this.id} img`);
    const imgSrc = `img/${this.type}_${this.variant}_${this.facing.x}_${this.facing.y}.png`;
    const imgCache = app.imageCache.get(imgSrc);
    divImg.src = imgCache.src;
    //div.innerHTML = `<img src="${imgSrc}" ${item.style}>`;
  }

  /**
   * 
   * @returns return boolean true if our old poss matches our new/current pos
   */
  hasNotMoved() {
    return this.oldPos.x === this.x && this.oldPos.y == this.y;
  }

  restorePos() {
    this.x = this.oldPos.x;
    this.y = this.oldPos.y;
  }

  updateCollisionBox() {
    if (!this.collideInfo) return;
    this.collisionBox = this.collideInfo.copy().add(this);
  }

  /**
   * Make sure this object does not move off the world boundary
   */
  checkWorldBoundary() {
    const padding = 20;
    if (this.x < padding || this.x > app.world.w - padding
      || this.y < padding || this.y > app.world.h - padding) {
      this.restorePos();
      this.velocity.clear();
    }
  }

  // check the grid to see what we are colliding with
  checkCollisions(layer) {
    // first collidable for the surface is the item we are checking against all other items
    this.updateCollisionBox();
    const inCell = app.world.layers[layer].queryShape(this.collisionBox);
    const layerBonesList = app.gameLists.get(layer);
    if (!layerBonesList) return;
    for (const itemId of inCell.list || []) {
      let item = layerBonesList.get(itemId);
      if (!item) return;
      const assetInfo = assets.get(item.type, item.variant);
      for (const otherItem of assetInfo[layer] || []) {
        let collidable = otherItem.copy().add(item);
        this.surfaceCollision(collidable, item);
      }
    }
  }

  /**
   * 
   * @param {collidable} the thing we have collided with ?? 
   * @param {bones} the thing we have collided with 
   */
  surfaceCollision(collidable, item) {
    let poss = this.collisionBox.collides(collidable);
    // if x = -1 we are on the left|top of centre, +1 is right|bottom
    if (poss.x != 0 && poss.y != 0) {
      this.restorePos();
      if (item.onCollide === 'stop') {
        this.velocity.clear();
        app.input.clearKeys();
      } else if (item.onCollide === 'bounce') {
        this.velocity.multiply(poss);
      } else {
        // Adjust velocity based on direction of travel to slide around objects
        if (this.velocity.y !== 0) {
          this.velocity.y = 0; // Stop vertical movement
          this.velocity.x += poss.x; // Adjust horizontal movement - slide up or down
        } else if (this.velocity.x !== 0) {
          this.velocity.x = 0; // Stop horizontal movement
          this.velocity.y += poss.y; // Adjust vertical movement - slide left or right
        }
      }
      this.velocity.limit(this.maxSpeed);
      this.applyVelocity();
      if (settings.pickupItems) {
        this.velocity.clear();
        app.inventory.add(item);
      }
    }
  }

  // check the ghosts grid to see what we are colliding with any ghosts
  checkGhosts() {
    const layerBonesList = app.gameLists.get(settings.SURFACE);
    if (!layerBonesList) return;
    this.updateCollisionBox();
    const inCell = app.world.layers[settings.GHOSTS].queryShape(this.collisionBox);
    if (inCell && inCell.list && inCell.list.length > 0) {
      inCell.list.forEach((itemId) => {
        const item = layerBonesList.get(itemId);
        if (!item) return;
        const assetInfo = assets.get(item.type, item.variant);
        const collideInfo = assetInfo[settings.GHOSTS];
        collideInfo.forEach((ghost) => {
          const ghostCollidable = ghost.copy().add(item);
          const poss = this.collisionBox.collides(ghostCollidable);
          if (poss.x != 0 && poss.y != 0) {
            // find the div
            const div = document.querySelector(`#${item.id}`);
            div.classList.add('ghost');
          }
        });
      });
    }
  }

  removeGhosts() {
    // remove all ghost class
    var elements = document.querySelectorAll('.ghost');
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove('ghost');
    }
  }
}