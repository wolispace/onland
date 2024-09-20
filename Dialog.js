
/* a list of buttons [{caption: '', hint: '', onClick: function() {}}]

const buttons = [
  {caption: 'OK', hint: 'OK', onClick: () => {console.log('OK clicked');}},
  {caption: 'Cancel', hint: 'Cancel', onClick: () => {console.log('Cancel clicked');}}
];
const dlg = new Dialog('Home', buttons);


*/
class Dialog {
  // passing in buttons object updates this
  buttons = {
    ok: {
      caption: 'OK', hint: 'OK',
      closeAfter: true, onClick: () => { console.log('OK clicked') }
    },
    cancel: {
      caption: 'Cancel', hint: 'Cancel',
      closeAfter: true, onClick: () => { console.log('Cancel clicked') }
    },
  };

  constructor(params) {
    // Create a new div element
    this.dialog = document.createElement('div');

    // Set the innerHTML of the new div to the result of this.layout()
    this.dialog.innerHTML = this.layout();

    // Add the new div to the body
    document.body.appendChild(this.dialog);
    Object.values(this.buttons).forEach((buttonInfo) => {
      this.addButton(buttonInfo);
    });
    this.addDefaults();
    app.dialogShown = true;
  }

  setContent(html) {
    this.dialog.querySelector('.dialogContent').innerHTML = html;
  }

  /** 
   * if the button should close after being clicked 
   * */
  closeAfter(thisFunction) {
    if (typeof thisFunction === "function") {
      thisFunction();
    }
    this.hide();
  }

  /**
   * remove the dialog div from the document
   */
  hide() {
    this.dialog.remove();
    app.dialogShown = false;
  }

  addButton(buttonInfo) {
    const button = document.createElement('button');
    button.textContent = buttonInfo.caption;
    button.title = buttonInfo.hint;
    if (buttonInfo.closeAfter) {
      button.addEventListener('click', (event) => {
        this.closeAfter(buttonInfo.onClick);
        event.preventDefault();
        event.stopPropagation();
      });
    } else {
      if (typeof buttonInfo.onClick === "function") {
        button.addEventListener('click', (event) => {
          buttonInfo.onClick();
          event.preventDefault();
          event.stopPropagation();
        });
      }
    }
    this.dialog.querySelector('.dialogFooter').appendChild(button);
  }

  addDefaults() {
    this.dialog.querySelector('.dialogClose').addEventListener('click', () => {
      this.closeAfter(this.buttons.cancel.onClick);
    });
    // capture key presses and click relevant buttons
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeAfter(this.buttons.cancel.onClick);
      }
      if (event.key === 'Enter') {
        this.closeAfter(this.buttons.ok.onClick);
      }
    });
  }

  /**
   * 
   * @returns {string} the html layout of every dialog including the overlay
   */
  layout() {
    return `
      <div class="dialogOverlay">
        <div class="dialogContainer">
          <div class="dialogHeader">
            <div class="dialogTitle"></div>
            <div class="dialogClose">X</div>
          </div>
          <div class="dialogContent"></div>
          <div class="dialogFooter"></div>
        </div>
      </div>
    `;
  }

}