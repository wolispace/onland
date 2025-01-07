
export default class UniqueSet extends Set {
 constructor(iterable) { 
  super(iterable); } 
  
  /** * Adds all elements of another set to this set 
   * * @param {Set} otherSet - The set of elements to be added 
   * */ 
  addAll(otherSet) { 
    for (let item of otherSet) { 
      this.add(item); } 
  } 
  
  /** 
   * * Removes all elements of another set from this set 
   * * @param {Set} otherSet - The set of elements to be removed 
   * */ 
  takeAll(otherSet) { 
    for (let item of otherSet) { 
      this.delete(item); 
    } 
  } 
   
  /**
   * compares this set with newSet. return a new set where only things in the new set are present in the current set
   * @param {set} newSet 
   * @returns {set} 
   */
  same(newSet) { 
    const result = [...this].filter(item => newSet.has(item)); 
    return new UniqueSet(result); 
  }


  /**
   * everything in newSet that is not yet in this set
   * @param {set} newSet 
   * @returns {set}
   */
  notIn(newSet) { 
    const result = [...newSet].filter(item => !this.has(item)); 
    return new UniqueSet(result); 
  }
 
  /**
   * everything that is in this set that is not yet in newSet
   * @param {set} newSet 
   * @returns {set}
   */
  outside(newSet) { 
    const result = [...this].filter(item => !newSet.has(item)); 
    return new UniqueSet(result); 
  }

  toString() {
    return JSON.stringify(this.toArray());
  }

  /** 
   * * Converts the set to an array 
   * * @returns {Array} The array representation of the set 
   * */ 
  toArray() { 
    return Array.from(this); 
  }
  /**
   * run the passed in function on each item
   * @param {function} functionName 
   */
  run(functionName) {
    this.forEach((item) => functionName(item));
  }
}
