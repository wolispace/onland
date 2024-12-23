const utils = {
    
  
  // randoms a random number like a dice roll, with side being the number of sides: rnd(2) is a flip of a coin, rnd(6) is a six sided dice.
  // this a zero based number so rnd(2) gives us 0 or 1, rnd(6) gives us 0...5
  rnd: function (sides) {
    return Math.floor(Math.random() * sides);
  },

  // returns the random number shifted around zero so 3 = -1, 0, 1
  halfRnd: function (sides) {
    return utils.rnd(sides) - (sides / 2);
  },

  // debug messages top-left 
  msg: function (id, msg, desc = '') {
    document.querySelector(`#msg${id}`).innerHTML = desc + JSON.stringify(msg);
  },

  // replaces the params key:value in the string 'this is %key%'
  replaceParams: function (html, params) {
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
  },
};
