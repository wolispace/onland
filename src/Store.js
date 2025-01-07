export default class Store {
  constructor(type = 'localStorage') {
    this.type = type;
  }

  updateMovedList(encodedData) {
    const decodedData = this.decodeData(encodedData);
    decodedData.forEach((itemData) => {
      //add to a temp list of item info to turn into  real item
      this.movedList[itemData.id] = itemData;
    });
  }

  addToMovedList(item) {
    this.movedList[item.id] = item;
  }

  getEncodedMovedList() {
    return this.encodeData(Object.values(this.movedList));
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
