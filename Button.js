//Every UI button is an item that exists on the world
class Button extends Item {

  constructor(params) {
    super(params);
    this.type = "Button";
  }

  setup() {
    // hook into events..
  }
}