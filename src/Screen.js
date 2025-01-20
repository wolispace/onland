// used to add and remove things from the screen
export default class Screen {

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
}