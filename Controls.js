// a set of controls for user input
const controls = {

  buttonList: {
    left: { x: 0, y: 30, keys: ['left'] },
    up: { x: 30, y: 0, keys: ['up'] },
    down: { x: 30, y: 60, keys: ['down'] },
    right: { x: 60, y: 30, keys: ['right'] },
    lu: { x: 0, y: 0, keys: ['left', 'up'] },
    ld: { x: 0, y: 60, keys: ['left', 'down'] },
    ru: { x: 60, y: 0, keys: ['right', 'up'] },
    rd: { x: 60, y: 60, keys: ['right', 'down'] },
    inv: {x: 160, y:60, keys: ['inv'], onClick: () => {
      app.inventory.show();
    } }
  },
  

  setup: function () {
    // add the holder of the buttons
    const params = assets.make({
      type: 'controls',
      id: 'controls',
      x: 10, y: 10,
      autoShow: true,
      variant: 'basic',
    });
    params.parent = app.overlay;
    app.controls = new Drawable(params);
    app.controls.show();
    app.controls.div.style.zIndex = 999999999;

    app.controls.div.addEventListener('pointermove', handleMove);
    app.controls.div.addEventListener('touchmove', handleMove, { passive: false });

    function handleMove(e) {
      e.preventDefault(); // Prevent scrolling on touch devices

      if (!app.input.active) return;
      const buttonName = e.target.id.replace(/^i/, '');

      if (buttonName == controls.lastButton) return;

      // if we move off the button, end its input
      const oldButtonInfo = controls.buttonList[controls.lastButton];
      app.input.keys.takeAll(oldButtonInfo.keys);

      if (['controls', 'inv'].includes(buttonName)) return;

      // select new button
      const buttonInfo = controls.buttonList[buttonName];
      if (buttonInfo.onClick) return;
      
      controls.lastButton = buttonName;
      app.input.keys.addAll(buttonInfo.keys);
      app.input.active = true;
      // app.msg(2, `move ${buttonName}`);
    }

    // app.controls.div.addEventListener('pointermove', (e) => {
    //   if (!app.input.active) return;
    //   const buttonName = e.target.id.replace(/^i/, ''); 

    //   if (buttonName == controls.lastButton) return;

    //   // if we move off the button, end its input
    //   const oldButtonInfo = controls.buttonList[controls.lastButton];
    //   app.input.keys.takeAll(oldButtonInfo.keys);

    //   if (buttonName == 'controls') return;

    //   // select new button
    //   const buttonInfo = controls.buttonList[buttonName];
    //   controls.lastButton = buttonName;
    //   app.input.keys.addAll(buttonInfo.keys);
    //   app.input.active = true;
    //   app.msg(2, `move ${buttonName}`);
    // });

    // all child buttons..
    // hold buttons for movement
    Object.keys(controls.buttonList).forEach(buttonName => {
      let buttonInfo = controls.buttonList[buttonName];
      let params = assets.make({
        type: 'buttons',
        id: buttonName,
        x: buttonInfo.x,
        y: buttonInfo.y,
        autoShow: true,
        variant: buttonName,
      });
      if (buttonInfo.onClick) {
        params.onclick = (e) => {
          if (e.button === 2) return;
          buttonInfo.onClick();
        };
      } else {
        params.onpointerdown = (e) => {
          if (e.button === 2) return;
          controls.lastButton = buttonName;
          app.input.keys.addAll(buttonInfo.keys);
          app.input.active = true;
          //app.msg(2, `move ${buttonName}`);
        };
        params.onpointerup = (e) => {
          if (e.button === 2) return;
          app.input.keys.takeAll(buttonInfo.keys);
          app.input.endInput();
          //app.msg(2, `stop ${buttonName}`);
        };
      }
      app.controls.addChild(new Drawable(params));
    });

  },

};
