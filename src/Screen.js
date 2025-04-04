import Rectangle from "./Rectangle.js";
import Point from "./Point.js";

// used to add and remove things from the screen
export default class Screen {

  constructor() {
    this.scrollableDiv = document.querySelector('.scrollable');
    this.update();
  }


  /**
   * Adds some html to the screen
   * @param {string} content html to add to the screen 
   * @param {*} parent default is 'world'
   */
  static add(content, parent = 'world') {
    parent = this.getElement(`${parent}`);
    parent.insertAdjacentHTML('beforeend', content);
  }

  /**
   * 
   * @param {Item} item with x,y so we can position it in the world div 
   */
  static position(item) {
    const div = this.getElement(item.id);
    div.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
  }

  /**
   * Returns the html element matching id="id"
   * @param {string} id 
   */
  static remove(id) {
    // find the div by this id and remove from dom
    const element = this.getElement(id);
    if (element) {
      element.remove();
    }
  }

  /**
   * Returns the html element matching id="id"
   * @param {string} id 
   * @returns {element} the html element matching the id
   */
  static getElement(id) {
    return document.querySelector(`#${id}`);
  }

  /**
   * Show the mouse pointer/cursor when moving the mouse 
   */
  static showCursor() {
    const body = document.querySelector(`body`);
    body.style.cursor = "auto";
  }

  /**
   * Hide the mouse pointer/cursor when pressing keys
   */
  static hideCursor() {
    const body = document.querySelector(`body`);
    body.style.cursor = "none";
  }

  /**
   * Update details about the screen
   */
  update() {
    this.rectangle = new Rectangle({ w: window.innerWidth, h: window.innerHeight });
  }

  /**
   * Scroll the screen so the point is in the middle of the screen
   * @param {point} point 
   */
  centerOnPoint(point) {
    const scrollPos = new Point(window.scrollX, window.scrollY);

    // Calculate the amount of scrolling
    const newScroll = point.add(scrollPos).take((this.rectangle.center));

    // // Scroll the world div
    this.scrollableDiv.scrollLeft = newScroll.x;
    this.scrollableDiv.scrollTop = newScroll.y;
  }

}