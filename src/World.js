import Area from "./Area.js";
import IndexList from "./IndexList.js";

/**
 * The world has an area w,h and holds multiple layers of SHGs (surface, ghosts, underground)
 */
export default class World extends Area{

  constructor(w,h){
      super(w,h);
      this.setup();
  }

/**
 * Prepare the world and its layers and suburbs
 * @param {object} app 
 */
  setup(app) {
    // 

  }


}