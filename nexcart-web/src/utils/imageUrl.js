
const API_URL = import.meta.env.VITE_BACK_END_URL?.replace(/\/+$/, "");

export const getImageUrl = (image) => {
  if (!image) return "";

  // Preserve complete URLs.
  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  // Remove leading slashes so paths are normalized.
  const cleanImage = image.replace(/^\/+/, "");

  // Avoid adding /images twice.
  const imagePath = cleanImage.startsWith("images/")
    ? cleanImage
    : `images/${cleanImage}`;

  return `${API_URL}/${imagePath}`;
};
