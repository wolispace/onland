/**
 * The game loop of updateing and showing those changes
 */
export default class GameLoop {
  constructor(update, render) {
    this.update = update; 
    this.render = render;

    this.animationFrameId = null;
    this.isRunning = false;
    this.lastFrameTime = 0;
    this.accumulatedFrameTime = 0;
    this.timeStep = 1000 / 60; // 60fps

    // Bind mainLoop to the instance
    //this.mainLoop = this.mainLoop.bind(this);
  }

  mainLoop = (timestamp) => {

    if (!this.isRunning) return;

    let deltaTIme = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    // accumulate all the time since the last frame
    this.accumulatedFrameTime += deltaTIme;

    // Fixed time step updates
    // if there's enough accumulated time to run one or more fixed updates
    while (this.accumulatedFrameTime >= this.timeStep) {
      this.update(this.timeStep);
      this.accumulatedFrameTime -= this.timeStep;
    }

    // renter
    this.render();
    this.animationFrameId = requestAnimationFrame(this.mainLoop);
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animationFrameId = requestAnimationFrame(this.mainLoop);
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.isRunning = false;
  }
}