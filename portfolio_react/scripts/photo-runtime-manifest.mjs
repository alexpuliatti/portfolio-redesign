// Keep checksums, byte counts, and repeated file paths out of the browser bundle.
export function photoRuntimeManifest(manifest) {
  return Object.fromEntries(Object.entries(manifest.images).map(([source, image]) => {
    const variants = (format) => image[format].map((variant) => {
      const edge = Number(variant.src.match(/-(\d+)\.(?:avif|webp)$/)[1]);
      return [edge, variant.width];
    });
    return [source, {
      width: image.width,
      height: image.height,
      base: image.thumb.replace(/-thumb\.jpg$/, ''),
      avif: variants('avif'),
      webp: variants('webp'),
    }];
  }));
}
