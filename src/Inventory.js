// an inventory is a uniqueSet that holds Items and ve output as html

class Inventory extends UniqueSet {
  constructor(params) {
    super(params);
  }

  add(item) {
    // add the bone to the inventory bonelist and remove from all other lists?
    app.gameLists.add(settings.INVENTORY, item);
    app.gameLists.remove(settings.SURFACE, item.id);
    app.store.save(settings.MOVED_ITEMS, app.gameLists.encode(settings.MOVED_ITEMS));
  }

  // place an item ad the users current x/y
  use() {
    const params = {
      x: app.me.x,
      y: app.me.y,
      type: 'rock',
      parent: 'world',
    };
    const newItem = new Bones(params);
    app.gameLists.add(settings.SURFACE, newItem);
    const thing = new Drawable(newItem);
    thing.show();
    app.store.save(settings.MOVED_ITEMS, app.gameLists.encode(settings.MOVED_ITEMS));
  }

  show() {
    const params = {
      title: 'Inventory',
      content: this.html(),
    };
    
    this.dialog = new Dialog(params);
  }

  // names heard called for in a drs clinic:
  // - perry mason
  // - charlie chaplin

  html() {
    let html = '';
    const bonesList = app.gameLists[settings.MOVED_ITEMS].get(settings.INVENTORY);
    if (!bonesList) return 'Nothing in your inventory';
    for (const bones of Object.values(bonesList.list)) {
      bones.style = ' '; // override default svg style
      const item = assets.make(bones);
      html += `${this.buttonHtml(item)}`;
    }

    return `<div class="itemList">${html}</div>`;
  }

  buttonHtml(item) {
    let html = '';
    html += `<div class="buttonize inventoryItem" data-item-id="${item.id}">${item.html}</div>`;

    return html

  }

}

