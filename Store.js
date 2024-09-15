class Store {
  compression = false;
  tempList = {};
 
  constructor(type = 'localStorage') {
    this.type = type;
  }
  
  /**
   * Add all items into a temp list {'a': {id:a, x: 100, y: 200, etc..}}
   * @param {string} encodedData 'a|||100|200^etc..
   */
  addToTempList(encodedData) {
    const decodedData = this.decodeData(encodedData);
    decodedData.forEach((itemData) => {
      //add to a temp list of item info to turn into  real item
      this.tempList[itemData.id] = itemData;
    });
  }

  /**
   * Updates or adds items in our temp list {'a': {id:a, x: 150, y: 250, etc..}}
   * @param {string} encodedData 'a|||150|250^etc..

   */
  updateTempList(encodedData) {
    const decodedData = this.decodeData(encodedData);
    decodedData.forEach((itemData) => {
      //add to a temp list of item info to turn into  real item
      this.tempList[itemData.id] = itemData;
    });
  }

  /**
   * 
   * @param {array} surrounds array of land key ['0_0', '0_1', etc..] 
   */
  pruneTempList(surrounds) {
    for (const key in this.tempList) {
      const params = this.tempList[key];
      const land = app.world.layers.lands.makeKey(params);
      if (!surrounds.has(land)) {
        delete this.tempList[key];
      }
    }
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
    if (!encodedString) return [];
    let decodedData = [];
    let itemStrings = encodedString.split('^');
    for (const item of itemStrings) {
      let decoded = app.decode(item);
      decodedData.push(decoded);
    }

    return decodedData;

  }
  

 
} 
 