class UniqueId {
  reel = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  constructor(lastId) {
    this.lastId = lastId || '9'; // '9' is the first key in our unique keys so we start at 'a'
  }

  /**
   * 
   * @param {string} id sets the last ID to this one so the next call to .next() increments and returns the next  
   */
  set(id) {
    this.lastId = id;
  }

  /**
   * returns the current last id defined.
   */
  get() {
    this.lastId;
  }
  
  /**
   * Returns the next char so if I pass in 'c' it gives me 'd' and if I pass in 'Z' it gives me '0' rolling around to the start
   * @param {string} char 
   * @returns {string} next char
   */
  nextInReel(char) {
    const index = this.reel.indexOf(char);
    if (index === this.reel.length - 1) {
      return this.reel[0];
    }
    return this.reel[index + 1];
  }

  /**
   * increment the last ID so it is alphabetic 'a', 'b', ... 'z'
   * Next comes 'a0' , 'a9' .. 'az'
   * Next comes 'b0', 'b9', ... 'bz'
   * Then we reach 'a00' then 'a000' etc..
   * This means 100,000,000 = 'fUJIn' which takes less space and can be used as a <div id="">
   */
  next() {
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