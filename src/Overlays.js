class Overlays {
  normalizedY = 0.5;

  constructor() {
    this.overlay = { div: document.querySelector(`#overlay`) };
    this.blurOverlay = { div: document.querySelector(`#blurOverlay`) };
    this.maxBlur = 5;
  }

  /**
   * Update the blur overlay relative to the player and the top and bottom of the world
   */
  updateBlurOverlay() {
    if (!settings.depthOfField) return;

    // playerY should be normalized (0 to 1, where 0 is top of screen, 1 is bottom)
    const maxBlur = this.maxBlur;

    this.blurOverlay.div.style.backdropFilter = `blur(${maxBlur}px)`;

    // Create a clear zone around the player
    const clearZoneSize = 0.5; // Size of the non-blurred area

    // Adjust gradient stops based on player position
    const gradientStops = [
      { offset: 0, blur: maxBlur },
      { offset: Math.max(0, this.normalizedY - clearZoneSize), blur: maxBlur },
      { offset: Math.max(0, this.normalizedY - clearZoneSize / 2), blur: 0 },
      { offset: Math.min(1, this.normalizedY + clearZoneSize / 2), blur: 0 },
      { offset: Math.min(1, this.normalizedY + clearZoneSize), blur: maxBlur },
      { offset: 1, blur: maxBlur }
    ];

    const gradient = gradientStops
      .map(stop => `rgba(0,0,0,${stop.blur / maxBlur}) ${stop.offset * 100}%`)
      .join(', ');

    this.blurOverlay.div.style.maskImage = `linear-gradient(to bottom, ${gradient})`;
  }

  /**
   * Show a faded-to-black overlay so we can easily visualise where the blur will be
   */
  updateDebugOverlay() {
    // Remove the blur filter for debugging
    this.blurOverlay.div.style.backdropFilter = 'none';

    const clearZoneSize = 0.5; // Size of the clear area

    // Using black with opacity instead of blur
    const gradientStops = [
      { offset: 0, opacity: 0.8 },  // Top of screen
      { offset: Math.max(0, this.normalizedY - clearZoneSize), opacity: 0.8 },
      { offset: Math.max(0, this.normalizedY - clearZoneSize / 2), opacity: 0 },
      { offset: Math.min(1, this.normalizedY + clearZoneSize / 2), opacity: 0 },
      { offset: Math.min(1, this.normalizedY + clearZoneSize), opacity: 0.8 },
      { offset: 1, opacity: 0.8 }   // Bottom of screen
    ];

    // Create gradient with black color and varying opacity
    const gradient = gradientStops
      .map(stop => `rgba(0, 0, 0, ${stop.opacity}) ${stop.offset * 100}%`)
      .join(', ');

    // Apply the gradient directly as background instead of mask
    this.blurOverlay.div.style.background = `linear-gradient(to bottom, ${gradient})`;

    // Remove the mask image
    this.blurOverlay.div.style.maskImage = 'none';

    // For debugging - log player position and gradient
    console.log('Player Y:', this.normalizedY, 'Gradient:', gradient);
  }

  /**
   * Clacl where the player is relative to the screen height so we can modify the overlay
   * @param {number} playerY 
   */
  updateForPlayerPosition(playerY) {
    if (!settings.depthOfField) return;
    this.updateBlurEffect(playerY);
    const screenHeight = window.innerHeight;
    const worldHeight = settings[mode].worldSize.h;
    let newNormalizedY = 0.5; // default middle of the screen most of the time
    if (playerY < screenHeight / 2) {
      // Near top of screen
      newNormalizedY = playerY / screenHeight;
    } else if (playerY > worldHeight - (screenHeight / 2)) {
      // Near bottom of play area
      newNormalizedY = (playerY - (worldHeight - screenHeight)) / screenHeight;
    }

    if (this.normalizedY === newNormalizedY) return;

    // update the normal
    this.normalizedY = newNormalizedY;
    //this.updateDebugOverlay();
    this.updateBlurOverlay();
  }

  // Function to calculate the distance and apply blur
  updateBlurEffect(playerY) {
    const maxBlur = 10; // The maximum blur amount allowed
    const blurDistance = 100; // divide the ditance by this to calculate a blur between 0 and 10
    const onScreen = app.gameLists.get(settings.SURFACE); // get current list of items
    if (!onScreen) return;

    for (const boneId in onScreen.list) {
      const bones = onScreen.list[boneId];
      //console.log(bones);
      const div = document.querySelector(`#${bones.id}`); // Replace with your div class
      if (!div) continue;
      const firstChild = div.lastElementChild;
      if (!firstChild) continue;
      //console.log(`#${bones.id}`, div);
      const distance = Math.abs(playerY - bones.y);
      const blurAmount = Math.min(distance / blurDistance, maxBlur); // Adjust the divisor and max blur as needed
      firstChild.style.filter = `blur(${blurAmount}px)`;
    };
  }



}
