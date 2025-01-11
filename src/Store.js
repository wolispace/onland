export default class Store {
  constructor(type = 'localStorage') {
    this.type = type;
  }

  /**
   * Sets a value into the store
   * @param {string} key 
   * @param {string} data 
   * @returns 
   */
  set(key, data) {
    localStorage.setItem(key, data);
    return this;
  }

  /**
   * Gets a value from the store
   * @param {string} key 
   * @returns {string}
   */
  get(key) {
    return localStorage.getItem(key);
  }

  /**
   * Returns true if the key is set in the store already
   * @param {string} key 
   * @returns {boolean}
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Remove a value from the store
   * @param {string} key 
   * @returns 
   */
  remove(key) {
    localStorage.removeItem(key);
    return this;
  }

  /**
   * Clear all values from the store
   */
  clear() {
    localStorage.clear();
  }


}
