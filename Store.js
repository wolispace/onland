class Store {
  compression = false;
  lastId = '`'; // the first key in our unique leys

  constructor(type = 'localStorage') {
    this.type = type;
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
  newId() {
    let id = this.lastId;
    let index = id.length - 1;
  
    while (index >= 0) {
      const charCode = id.charCodeAt(index);
      if (charCode === 122) { // 'z'
        id = id.slice(0, index) + 'a' + id.slice(index + 1);
        index--;
      } else {
        id = id.slice(0, index) + String.fromCharCode(charCode + 1) + id.slice(index + 1);
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
 