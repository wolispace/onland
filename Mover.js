class Mover extends Item {
  constructor(params) {
    super(params);
  }

  move() {
    let newVector = new Vector();
    if (app.input.anyKeysPressed()) {
      app.input.keys.list.forEach(key => {
        let direction = app.input.directions[key];
        newVector.add(direction); 
      });
      app.msg(2, newVector);
    } else if (app.input.mouseDown) {
      console.log(`move to touchPoint`, touchPoint); 
    }
    if (!newVector.isZero()) {
      // add the vector to the current position
      this.add(newVector);
      this.position();
    }
  }
}