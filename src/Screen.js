// used to add and remove things from the screen
export default class Screen {

  static add(content, parent = 'world') {
    parent = this.getElement(`${parent}`);
    parent.insertAdjacentHTML('beforeend', content);
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