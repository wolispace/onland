/**
 *     events.emit("HERO_POSITION", this.position);
 *     events.on("HERO_POSITION", this, position => {
         // do something with the position passed in..
       })
 */
class Events {
  callbacks = [];
  nextId = 0;

  // emit event
  emit(eventName, value) {
    this.callbacks.forEach(stored => {
      if (stored.eventName === eventName) {
        stored.callback(value)
      }
    })
  }

  // subscribe to something happening
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
