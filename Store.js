class Store {
  compression = false;
 
  constructor(type = 'localStorage') {
    this.type = type;
  }

  makeKey(layer, land) {
    return `${layer[0]}_${land}`;
  }

  saveLand(layer, land, encodedData) {
    this.save(this.makeKey(layer, land), encodedData);
  }

  loadLand(layer, land) {
    return this.load(this.makeKey(layer, land));
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

  encodeData(data) {
    let encodedData = [];
    for (const item of data) {
      encodedData.push(app.encode(item));
    }
    return encodedData.join('^');
  }

  decodeData(encodedString) {
    let decodedData = [];
    let itemStrings = encodedString.split('^');
    for (const item of itemStrings) {
      let decoded = app.decode(item);
      decodedData.push(decoded);
    }

    return decodedData;

  }
  

 
} 
 