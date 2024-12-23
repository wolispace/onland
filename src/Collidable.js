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
    //console.log('dx:', dx, 'dy:', dy);
    // Compare distance with sum of half widths and heights
    var overlapX = Math.abs(dx) < (this.w / 2 + otherRect.w / 2);
    var overlapY = Math.abs(dy) < (this.h / 2 + otherRect.h / 2);
    //console.log('overlapX:', overlapX, 'overlapY:', overlapY);

    const shift = new Point(0, 0);

    // if we overlap in the x axis, return x:0, y: -1 or 1 if we are below or above the centre line in the y axis
    if (overlapX) {
      shift.y = this.y + this.h / 2 < otherRect.y + otherRect.h / 2 ? -1 : 1;
    }
    // if we overlap in the y axis, return y: 0, x:-1 or 1 if we are left or right of the centre line in the x axis
    if (overlapY) {
      shift.x = this.x + this.w / 2 < otherRect.x + otherRect.w / 2 ? -1 : 1;
    }

    return shift; // They are not colliding
  }

  /**
   * Show this collidable rectangle
   */
  showBox() {
    const collideBox = document.querySelector('#collideBox');
    collideBox.style.top = this.y + 'px';
    collideBox.style.left = this.x + 'px';
    collideBox.style.width = this.w + 'px';
    collideBox.style.height = this.h + 'px';

    const collidePoint1 = document.querySelector('#collidePoint1');

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