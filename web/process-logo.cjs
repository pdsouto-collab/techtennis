const Jimp = require('jimp');

Jimp.read('src/assets/techtennis-logo.png').then(image => {
  const bgColors = Jimp.intToRGBA(image.getPixelColor(0, 0));
  const bgR = bgColors.r;
  const bgG = bgColors.g;
  const bgB = bgColors.b;
  const bgSum = bgR + bgG + bgB;

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    var r = this.bitmap.data[idx + 0];
    var g = this.bitmap.data[idx + 1];
    var b = this.bitmap.data[idx + 2];
    
    var sum = r + g + b;
    // ratio is exactly 1 for background, 0 for pure black
    var ratio = sum / bgSum;
    if (ratio > 1) ratio = 1;
    
    // Alpha should be 1 for pure black (ratio 0), and 0 for background (ratio 1)
    // Add pow function to tighten the curve so edges are sharp but still antialiased
    var alphaVal = 255 * Math.pow((1 - ratio), 1.2); 
    if (alphaVal > 255) alphaVal = 255;
    if (alphaVal < 0) alphaVal = 0;
    
    // Additional thresholding to completely remove artifacts of the blue background
    if (ratio > 0.8) {
       alphaVal = 0;
    }

    // Set everything to black, but vary the alpha
    this.bitmap.data[idx + 0] = 0;
    this.bitmap.data[idx + 1] = 0;
    this.bitmap.data[idx + 2] = 0;
    this.bitmap.data[idx + 3] = alphaVal;
  });
  
  // Crop empty transparent space if possible
  image.autocrop();

  image.write('src/assets/techtennis-logo-transparent.png');
  console.log("Image processed successfully!");
}).catch(err => {
  console.error(err);
});
