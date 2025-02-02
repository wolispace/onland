export default class Utils {
  /**
   * randoms a random number like a dice roll, with side being the number of sides: rnd(2) is a flip of a coin, rnd(6) is a six sided dice.
   * this a zero based number so rnd(2) gives us 0 or 1, rnd(6) gives us 0...5
   * @param {number} sides of a dice eg (2 for a coin, 6 for a dice) 
   * @returns {number} a random number between 0 and sides - 1
   */
  static rnd (sides) {
    return Math.floor(Math.random() * sides);
  }

  /**
   * returns the random number shifted around zero so 3 = -1, 0, 1
   * @param {number} sides 
   * @returns {number} a random number between -sides/2 and sides/2
   */
  static halfRnd (sides) {
    return this.rnd(sides) - (sides / 2);
  }

  /** TODO: move this to the world class as it puts things on the screen
   * debug messages top-left 
   * @param {number} id of the msg (1, 2 or 3)
   * @param {any} params will be converted into a json string 
   * @param {string} desc 
   */
  static msg (id, params, desc = '') {
    document.querySelector(`#msg${id}`).innerHTML = desc + JSON.stringify(params);
  }

  /**
   * replaces the params key:value in the string 'this is %key%'
   * @param {string} html eg 'Hello %name% you are id %id%'
   * @param {object} params eg {id: 1, name: "bob"} 
   * @returns {string} with params replaces
   */
  static replaceParams (html, params) {
    let match;
    const regex = /%(\w+)%/;
    // keep checking for a match as the last replaced param may have added more
    while ((match = regex.exec(html)) !== null) {
      const [fullMatch, paramName] = match;
      if (params[paramName] === '' || params[paramName]) {
        html = html.replace(fullMatch, params[paramName]);
      } else {
        // If the parameter is not found in params, move past this match
        html = html.slice(0, match.index) + html.slice(match.index + fullMatch.length);
      }
    }
    return html;
  }
  

  /**
   * Pause the game for a number of milliseconds
   * @param {number} ms 
   * @returns {Promise} 
   */
  pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));
};
