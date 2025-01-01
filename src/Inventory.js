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
    const offset = {
      x: -10,
      y: -20,
    };
    const params = {
      id: app.uniqueId.next(),
      x: parseInt(app.me.x + offset.x),
      y: parseInt(app.me.y + offset.y),
      type: 'tree',
      variant: '001a',
      parent: 'world',
    };
    const newItem = new Bones(params);
    newItem.allocate();

    app.gameLists.add(settings.SURFACE, newItem);
    const thing = new Drawable(newItem);
    thing.show();
    thing.position();
    app.store.save(settings.MOVED_ITEMS, app.gameLists.encode(settings.MOVED_ITEMS));
    app.overlays.updateBlurEffect(app.me.y)
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

  /**
   * 
   * @returns {string} the html for the inventory
   */
  html() {
    let html = '';

    html += this.heldItems();

    return html;
  }

  /**
   * 
   * @returns {string} the html for the items in the inventory
   */
  heldItems() {
    let html = '';
    const bonesList = app.gameLists[settings.MOVED_ITEMS].get(settings.INVENTORY);
    if (!bonesList) return 'Nothing in your inventory';
    for (const bones of Object.values(bonesList.compact())) {
      const itemInfo = assets.make(bones);
      itemInfo.style = ' '; // override default svg style
      itemInfo.html = assets.buildInvHtml(itemInfo);

      html += this.buttonHtml(itemInfo);
    }

    return `<div class="itemList">${html}</div>`;
  }

  buttonHtml(item) {
    let html = '';
    html += `<div class="buttonize inventoryItem" data-item-id="${item.id}">${item.html}</div>`;

    return html

  }

}

