// every collidable rectangle is part of an item (held in a set of collidables)

class Collidable extends Rectangle {
  onCollide = 'skim';

  constructor(params) {
    super(params);
    this.id = params.id;
    this.onCollide = params.onCollide ?? this.onCollide;
  }

  copy() {
    return new Collidable(this);
  }
  /**
 * 
 * @param {Rectangle} otherRect 
 * @returns Point(x,y) where x is -1,0,1 indicating left,centre,right and y is -1,0,1 indicating above,centre,below
 * 
 */
  collides(otherRect) {
    // Calculate the distance between the two rectangles' centers
    var dx = (this.x + this.w / 2) - (otherRect.x + otherRect.w / 2);
    var dy = (this.y + this.h / 2) - (otherRect.y + otherRect.h / 2);
    // Compare distance with sum of half widths and heights
    if (Math.abs(dx) < (this.w / 2 + otherRect.w / 2) && Math.abs(dy) < (this.h / 2 + otherRect.h / 2)) {
      return new Point(
        this.x + this.w / 2 < otherRect.x + otherRect.w / 2 ? -1 : 1,
        this.y + this.h / 2 < otherRect.y + otherRect.h / 2 ? -1 : 1);
    }
    return new Point(0, 0); // They are not colliding
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