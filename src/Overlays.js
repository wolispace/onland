class Overlays {
  constructor() {
    this.overlay = { div: document.querySelector(`#overlay`) };
    this.blurOverlay = { div: document.querySelector(`#blurOverlay`) };
    this.maxBlur = 5;
    this.updateBlurOverlay();
    this.updateForPlayerPosition(100);
  }

  updateBlurOverlay(playerY = 0.5) {
    // playerY should be normalized (0 to 1, where 0 is top of screen, 1 is bottom)
    const maxBlur = this.maxBlur;
    
    this.blurOverlay.div.style.backdropFilter = `blur(${maxBlur}px)`;
    
    // Create a clear zone around the player
    const clearZoneSize = 0.5; // Size of the non-blurred area
    const playerPosition = playerY; // Normalized position (0-1)
    
    // Adjust gradient stops based on player position
    const gradientStops = [
      { offset: 0, blur: maxBlur },
      { offset: Math.max(0, playerPosition - clearZoneSize), blur: maxBlur },
      { offset: Math.max(0, playerPosition - clearZoneSize/2), blur: 0 },
      { offset: Math.min(1, playerPosition + clearZoneSize/2), blur: 0 },
      { offset: Math.min(1, playerPosition + clearZoneSize), blur: maxBlur },
      { offset: 1, blur: maxBlur }
    ];
    
    const gradient = gradientStops
    .map(stop => `rgba(0,0,0,${stop.blur / maxBlur}) ${stop.offset * 100}%`)
    .join(', ');
    
    console.log({playerY}, {gradient});
    this.blurOverlay.div.style.maskImage = `linear-gradient(to bottom, ${gradient})`;
  }

  updateDebugOverlay(playerY = 0.5) {
    // Remove the blur filter for debugging
    this.blurOverlay.div.style.backdropFilter = 'none';
    
    const clearZoneSize = 0.3; // Size of the clear area
    const playerPosition = playerY; 
    
    // Using black with opacity instead of blur
    const gradientStops = [
      { offset: 0, opacity: 0.8 },  // Top of screen
      { offset: Math.max(0, playerPosition - clearZoneSize), opacity: 0.8 },
      { offset: Math.max(0, playerPosition - clearZoneSize/2), opacity: 0 },
      { offset: Math.min(1, playerPosition + clearZoneSize/2), opacity: 0 },
      { offset: Math.min(1, playerPosition + clearZoneSize), opacity: 0.8 },
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
    console.log('Player Y:', playerY, 'Gradient:', gradient);
  }

  // Call this when player position changes and is near edges
  updateForPlayerPosition(playerY, screenHeight) {
    // Only update if player is near top or bottom edges

    if (playerY > screenHeight/2 && playerY < settings[mode].worldSize.h - (screenHeight / 2)) return;
    const normalizedY = playerY / screenHeight;
    this.updateBlurOverlay(normalizedY);

  }
}
