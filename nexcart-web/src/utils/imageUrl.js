export const getImageUrl = (image) => {
  if (!image) return "";

  // Already a complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Already starts with /images/
  if (image.startsWith("/images/")) {
    return `${import.meta.env.VITE_BACK_END_URL}${image}`;
  }

  // Just a filename, e.g. laptop.jpg
  return `${import.meta.env.VITE_BACK_END_URL}/images/${image}`;
};