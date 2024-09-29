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

  html() {
    let html = '';
    this.list.forEach(itemId => {
      const item = app.items.get(itemId);
      html += `<li>${item.type}</li>`;
    });
    return `<ul>${html}</ul>`;
  }

}

