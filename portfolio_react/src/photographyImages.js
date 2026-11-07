import manifest from './photographySources.json';

const images = Object.fromEntries(Object.entries(manifest).map(([source, image]) => {
    const variants = (format) => image[format].map(([edge, width]) => ({
        src: `${image.base}-${edge}.${format}`,
        width,
    }));
    return [source, {
        width: image.width,
        height: image.height,
        thumb: `${image.base}-thumb.jpg`,
        avif: variants('avif'),
        webp: variants('webp'),
    }];
}));

export function getPhoto(source) {
    const photo = images[source];
    if (!photo) throw new Error(`Missing prepared photograph: ${source}`);
    return photo;
}

export function photoUrl(source) {
    return `${import.meta.env.BASE_URL}${source}`;
}

export function photoSrcSet(variants) {
    return variants.map((variant) => `${photoUrl(variant.src)} ${variant.width}w`).join(', ');
}

export function photoSizes(photo, usage) {
    const ratio = photo.width / photo.height;
    const heightLimit = (vh) => `${(vh * ratio).toFixed(3)}vh`;
    switch (usage) {
        case 'gallery':
            return `(max-width: 900px) min(90vw, ${heightLimit(85)}), min(85vw, 1400px, ${heightLimit(85)})`;
        case 'project':
            return `(max-width: 900px) min(94vw, ${heightLimit(75)}), min(41vw, ${heightLimit(75)})`;
        case 'detail':
            return `(max-width: 900px) min(94vw, ${heightLimit(50)}), min(25vw, ${heightLimit(50)})`;
        case 'fullscreen':
            return `min(90vw, ${heightLimit(90)})`;
        default:
            throw new Error(`Unknown photograph usage: ${usage}`);
    }
}
