const items = {
  make(type, id = 'unknown', x = 0, y = 0, autoShow = false) {
    let params = assets.get(type);
    params.id = id;
    params.x = x;
    params.y = y;
    params.autoShow = autoShow;

    return params;
  },

};
