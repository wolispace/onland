// every collidable rectangle is part of an item (held in a set of collidables)

class Collidable extends Rectangle {
  onCollide = 'skim';

  constructor(params) {
    super(params);
    this.id = params.id;
    this.onCollide = params.onCollide;
    this.onCollide = params.onCollide ?? this.onCollide;
  }

  /**
   * 
   * @returns the html to insert into an items div
   */
  html() {
    return `<div class="collideZone" 
      style="top:${this.y}px; left:${this.x}px; 
      width:${this.w}px; height:${this.h}px"></div>`;
  }

}