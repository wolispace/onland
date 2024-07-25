class Mover extends Item {
  constructor(params) {
    super(params);
  }

  setup() {
    console.log('setup', this);
  }

  move() {
    console.log('move', this);
  }
}
