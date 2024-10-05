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
    this.list.forEach(itemId => {
      let item = app.items.get(itemId);
      item.left = 0;
      item.top = 0;
      item.html = assets.buildHtml(item);
      console.log(item);
      html += `${this.buttonHtml(item)}`;
    });
    return `<div class="itemList">${html}</div>`;
  }

  buttonHtml(item) {
    let html = '';
    html += `<div class="buttonize inventoryItem" data-item-id="${item.id}">${item.html}</div>`;

    return html

  }

}

