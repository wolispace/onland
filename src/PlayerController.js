import Vector from "./Vector.js";
import Point from "./Point.js";

// handles interactions between Player and InputManager classes
export default class PlayerController {
  constructor(params) {
    this.screen = params.screen;
    this.player = params.player;
    this.inputManager = params.inputManager;
  }

  update(dTimePerSecond) {
    // Scale the direction by delta time and a base speed
    const unitSpeed = this.player.baseSpeed * dTimePerSecond;
    if (!this.inputManager.isInputActive) {
      // apply friction
      if (this.player.velocity.magnitude() > 0.1) {
        //this.player.velocity.multiply((1 - (this.player.friction * dTimePerSecond)));
        this.player.velocity.multiply((this.player.friction * dTimePerSecond));
      } else {
        this.inputManager.joystick.handleEnd();
        this.player.velocity.clear();
      }
    } else {
      // keyboard or pointer is active
      if (this.inputManager.isPointerActive) {
        // get the current mouse or touch x,y
        const pointer = this.inputManager.pointer;
        if (this.inputManager.joystick.zone.contains(pointer)) {
          // Update joystick state with info from the inputManager
          this.inputManager.joystick.update(pointer);
          // if there is some joystick movement then apply it to the players velocity
          if (this.inputManager.joystick.vector.magnitude() > 0.1) {
            // Scale the joystick vector by baseSpeed and delta time
            this.player.velocity = this.inputManager.joystick.vector
              .scale(unitSpeed);
          }
        } else {
          /* if the pointers possition is outside of the "joystick zone" then
          calculate a vector from players current position to the pointer's possition 
          */
          // Create a vector from player position to pointer position
          const targetVector = new Vector(
            pointer.x - this.player.x,
            pointer.y - this.player.y
          );
          // Normalize and scale the vector by baseSpeed and delta time
          this.player.velocity = targetVector.normalise()
            .scale(unitSpeed);
        }
      } else {
        this.inputManager.joystick.handleEnd();
      }

      if (this.inputManager.isInputActive) {
        // add any preyprsses


        this.inputManager.keys.forOf((key) => {
          const direction = this.inputManager.directionKey(key);
          if (direction) {
            //console.log(direction);
            direction.multiply(unitSpeed);
            this.player.velocity.add(direction);
            this.player.velocity.limit(unitSpeed);
            //console.log(key, direction);
          }
        })
      } else {
        this.player.velocity.clear();
      }

    }

    this.player.applyVelocity();
    this.player.checkCollisions();


  }



  /**
   * scroll the world div so the player is in the middle of the screen if possible 
   */
  centerPlayer() {
    // // Get the player's coordinates
    const playerPos = new Point(this.player.x, this.player.y);

    this.screen.centerOnPoint(playerPos);
  }
}