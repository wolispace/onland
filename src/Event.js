/**
 *     event.emit("HERO_POSITION", this.position);
 *     event.on("HERO_POSITION", this, position => {
         // do something with the position passed in..
       })
 */
export default class Event {
  callbacks = [];
  nextId = 0;

  /**
   * Emit an event stating the event name 
   * and all the values of interest to any listeners
   * @param {string} eventName 
   * @param {any} value eg adding to a point would pass in the point to add
   */
  emit(eventName, value) {
    this.callbacks.forEach(stored => {
      if (stored.eventName === eventName) {
        stored.callback(value)
      }
    })
  }

  /**
   * Listen for a specific event and execute the function when it happens
   * @param {string} eventName 
   * @param {object} caller 
   * @param {function} callback 
   * @returns 
   */
  on(eventName, caller, callback) {
    this.nextId += 1;
    this.callbacks.push({
      id: this.nextId,
      eventName,
      caller,
      callback,
    });
    return this.nextId;
  }

  // remove the subscription
  off(id) {
    this.callbacks = this.callbacks.filter((stored) => stored.id !== id);
  }

  unsubscribe(caller) {
    this.callbacks = this.callbacks.filter(
        (stored) => stored.caller !== caller,
    );
  }


}
