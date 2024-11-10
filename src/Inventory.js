// an inventory is a uniqueSet that holds Items and ve output as html

class Inventory extends UniqueSet {
  constructor(params) {
    super(params);
  }

  show() {
    const params = {
      title: 'Inventory',
      content: this.html(),
    };
    
    this.dialog = new Dialog(params);
  }

  // perry mason
  // charlie chaplin

  html() {
    let html = '';
    const bonesList = app.layerList.get(settings.INVENTORY);
    if (!bonesList) return;
    for (const bones of Object.values(bonesList.list)) {
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

