export const galleryImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export const galleryFileInputAccept = galleryImageMimeTypes.join(",");
export const galleryImageFormatLabel = "JPG, PNG, WebP, GIF, or AVIF";
export const defaultGalleryUploadLimitMb = 10;