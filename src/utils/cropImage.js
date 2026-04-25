/**
 * Crops an image using canvas based on pixel coordinates from react-easy-crop.
 * @param {string} imageSrc - base64 data URL of the original image
 * @param {object} croppedAreaPixels - { x, y, width, height }
 * @returns {Promise<Blob>} - cropped image as a Blob ready for upload
 */
export async function getCroppedImg(imageSrc, croppedAreaPixels) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
}
