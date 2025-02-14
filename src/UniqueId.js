
export default class UniqueId {
  static reel = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  constructor(lastId) {
    this.lastId = lastId || '9'; // '9' is the first key in our unique keys so we start at 'a'
  }

  /**
   * 
   * @param {string} id sets the last ID to this one so the next call to .next() increments and returns the next  
   */
  set(id) {
    if (id.length > this.lastId.length || (id.length === this.lastId.length && id.localeCompare(this.lastId) > 0)) {
      this.lastId = id;
    }
  }

  /**
   * Getter returns the current last id defined.
   */
  get last() {
    return this.lastId;
  }
  
  /**
   * Returns the next char so if I pass in 'c' it gives me 'd' and if I pass in 'Z' it gives me '0' rolling around to the start
   * @param {string} char 
   * @returns {string} next char
   */
  nextInReel(char) {
    const index = UniqueId.reel.indexOf(char);
    if (index === UniqueId.reel.length - 1) {
      return UniqueId.reel[0];
    }
    return UniqueId.reel[index + 1];
  }

  /**
   * getter for the next id - increment the last ID so it is alphabetic 'a', 'b', ... 'z'
   * Next comes 'a0' , 'a9' .. 'az'
   * Next comes 'b0', 'b9', ... 'bz'
   * Then we reach 'a00' then 'a000' etc..
   * This means 100,000,000 = 'fUJIn' which takes less space and can be used as a <div id="">
   */
  get next() {
    let id = this.lastId;
    let index = id.length - 1;
  
    while (index >= 0) {
      const currentChar = id[index];
      if (currentChar === 'z') {
        id = id.slice(0, index) + UniqueId.reel[0] + id.slice(index + 1);
        index--;
      } else {
        const nextChar = this.nextInReel(currentChar);
        id = id.slice(0, index) + nextChar + id.slice(index + 1);
        break;
      }
    }
  
    if (index < 0) {
      id = 'a' + id;
    }
  
    this.lastId = id;
 
    return id;
  }
  

}