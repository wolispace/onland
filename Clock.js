class Clock {
  startTime = null;
  clockName = "thing";

  constructor(name) {
    this.clockName = name;
    this.reset();
  };

  duration() {
    const endTime = Date.now();
    let timeTaken = endTime - this.startTime; // Time taken in milliseconds    
    console.log(`${this.clockName} took ${timeTaken} milliseconds.`); 
  };

  reset() {
    this.startTime = Date.now();
  }
};
