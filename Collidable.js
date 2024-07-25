// every collidable rectangle is part of an item (held in a set of collidables)

class Collidable extends Rectangle {
  onCollide = 'skim';

  constructor(params) {
    super(params);
    this.id = params.id;
    this.onCollide = params.onCollide;
  }

}