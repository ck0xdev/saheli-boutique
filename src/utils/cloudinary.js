/**
 * Appends Cloudinary transformation params for auto-optimized images.
 * @param {string} url - raw Cloudinary URL
 * @param {number} width - desired width in px
 * @returns {string} - transformed URL
 */
export function getCloudinaryUrl(url, width = 600) {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
}
