class Store {
  compression = false;
  reel = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  lastId = '9'; // the first key in our unique leys

  constructor(type = 'localStorage') {
    this.type = type;
  }

  /**
   * Returns the next char so if I pass in 'c' it gives me 'd' and if I pass in 'Z' it gives me '0' rolling around to the start
   * @param {string} char 
   * @returns {string} next char
   */
  nextInReelX(char) {
    let nextChar = this.reel[0];
    const index = this.reel.indexOf(char);
    if (index !== -1) {
      nextChar =  this.reel[index + 1];
    }
    return nextChar;
  }

  save(key, data) {
    localStorage.setItem(key, data);
    return this;
  }

  load(key) {
    return localStorage.getItem(key);
  }

  has(key) {
    return localStorage.getItem(key) !== null;
  }

  clear(key) {
    localStorage.removeItem(key);
    return this;
  }

  /**
   * increment the last ID so it is alphabetic 'a', 'b', ... 'z'
   * Next comes 'aa' , 'ab' .. 'az'
   * Next comes 'ba', 'bb', ... 'bz'
   * Then we reach 'aaa' then 'aaaa' etc..
   * This means 10,000,000 = 'uvxwj' which takes less space and can be used as a <div id="">
   */

  nextInReel(char) {
    const index = this.reel.indexOf(char);
    if (index === this.reel.length - 1) {
      return this.reel[0];
    }
    return this.reel[index + 1];
  }
  
  newId() {
    let id = this.lastId;
    let index = id.length - 1;
  
    while (index >= 0) {
      const currentChar = id[index];
      if (currentChar === 'Z') {
        id = id.slice(0, index) + this.reel[0] + id.slice(index + 1);
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
 