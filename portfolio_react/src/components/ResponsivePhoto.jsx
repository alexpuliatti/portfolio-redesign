import { getPhoto, photoSizes, photoSrcSet, photoUrl } from '../photographyImages';

export function ResponsivePhoto({ src, usage, alt, loading = 'lazy', style, ...imageProps }) {
    const photo = getPhoto(src);
    const sizes = photoSizes(photo, usage);
    const fallback = photo.webp.find((variant) => variant.width >= 1000) ?? photo.webp.at(-1);

    return (
        <picture className="responsive-photo">
            <source type="image/avif" srcSet={photoSrcSet(photo.avif)} sizes={sizes} />
            <img
                {...imageProps}
                src={photoUrl(fallback.src)}
                srcSet={photoSrcSet(photo.webp)}
                sizes={sizes}
                width={photo.width}
                height={photo.height}
                style={{ aspectRatio: `${photo.width} / ${photo.height}`, ...style }}
                alt={alt}
                loading={loading}
                decoding="async"
            />
        </picture>
    );
}
