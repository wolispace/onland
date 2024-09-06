class Store {
  compression = false;
 
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
  

 
} 
 