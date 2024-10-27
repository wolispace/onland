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

  msg: function (id, msg, desc = '') {
    document.querySelector(`#msg${id}`).innerHTML = desc + JSON.stringify(msg);
  },
}