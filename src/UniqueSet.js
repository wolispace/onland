class UniqueSet {
  list = [];

  constructor(params) {
    this.list = params || [];
  }

  copy() {
    return new UniqueSet([...this.list]);
  }

  addAll(newList) {
    newList.forEach((key => {
      this.add(key);
    }))
  }

  takeAll(newList) {
    newList.forEach((key => {
      this.take(key);
    }))
  }
  
  // only add the item to the list if it does not exist
  add(item) {
    if (!item) {
      return this.list;
    }
    if (!this.list.includes(item)) {
      this.list.push(item);
    }
    return this.list;
  }

  // removes an item from the list
  take(item) {
    this.list = this.list.filter(i => i !== item);
    return this.list;
  }

  has(item) {
    return this.list.includes(item);
  }

  clear() {
    this.list = [];
    return this.list;
  }

  count() {
    return this.list.length;
  }

  // adds the new list into the list making sure there are not duplicates
  join(newList) {
    if (newList && newList.length > 0) {
      newList.forEach(item => this.add(item));
    }
    return this.list;
  }

  // merge two uniqueSets together
  merge(newSet) {
    if (!newSet) return;
    return this.join(newSet.list);
  }

  // compares this.list with newList. return an object {same: [], toAdd: [], toTake: [] }
  // where same is all that match in both lists
  same(newList) {
    return this.list.filter(item => newList.includes(item));
  }

  // everything in newList that is not yet in this.list
  notIn(newList) {
    return newList.filter(item => !this.list.includes(item));
  }

  // everything that is in this.list that is not yet in newList
  outside(newList) {
    return this.list.filter(item => !newList.includes(item));
  }

  // run the passed in function on each item
  run(functionName) {
    this.list.forEach((item) => functionName(item));
  }
}
