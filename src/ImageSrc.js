class ImageSrc {
   
    imageUrls = [ 'image1.jpg', 'image2.jpg', 'image3.jpg' ]; 
    
    preloadedImages = []; 
    // Preload images 
    imageUrls.forEach((url) => { const img = new Image(); 
        img.src = url; preloadedImages.push(img); }); 
        // Function to switch image function 
        switchImage(index) { 
            const mainImage = document.getElementById('main-image');
             if (preloadedImages[index]) { mainImage.src = preloadedImages[index].src; }
}