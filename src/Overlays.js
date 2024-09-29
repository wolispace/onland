class Overlays {

  constructor() {
    this.overlay = { div: document.querySelector(`#overlay`) };
    this.blurOverlay = {div: document.querySelector(`#blurOverlay`)};
    this.updateBlurOverlay();
  }
  updateBlurOverlay() {
    const maxBlur = 5; // Maximum blur in pixels
  
    this.blurOverlay.div.style.backdropFilter = `
      blur(${maxBlur}px)
    `;
  
    const gradientStops = [
      { offset: 0, blur: maxBlur },
      { offset: 0.3, blur: 0 },
      { offset: 0.7, blur: 0 },
      { offset: 1, blur: maxBlur }
    ];
  
    const gradient = gradientStops
      .map(stop => `rgba(0,0,0,${stop.blur / maxBlur}) ${stop.offset * 100}%`)
      .join(', ');
  
    this.blurOverlay.div.style.maskImage = `linear-gradient(to bottom, ${gradient})`;
  }
}