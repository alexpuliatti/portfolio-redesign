# Photography preparation and recovery

The published site uses AVIF q80 with 4:4:4 chroma and WebP q90 fallback. Files are generated directly from the original photographs with EXIF orientation respected and colour managed to sRGB. Images are never enlarged.

AVIF responsive versions use longest-edge targets of 960 and 1920 pixels plus a larger version capped at 3840 pixels, matching the reviewed comparison samples. Near-duplicate sizes are omitted. The browser selects a version using the image's actual width, display dimensions, and screen density. Fullscreen images are requested only when fullscreen opens. Existing JPEG blur-up thumbnails are preserved.

WebP fallback is capped at a 1920-pixel longest edge to avoid storing two complete high-resolution sets within GitHub Pages' size limit. Modern browsers use the full AVIF set; browsers without AVIF receive the smaller WebP fallback. AVIF uses quality 80, 4:4:4 chroma, 8-bit output, and encoder effort 4. A sample comparison was used to check texture and colour against the previously reviewed effort-6 encode; the quality setting is unchanged. Encoding effort controls the compression search cost.

## Local originals

The complete photography folder from before conversion is preserved at:

```
asset-archive/photography-before-avif/files/
```

This includes every original and previous JPEG derivative, not just the images currently listed in the gallery. The adjacent `manifest.json` records each file's byte count and SHA-256 hash. `asset-archive/unused-public/` contains the previously archived legacy assets. Both archives are at the repository root, outside Vite's public directory, and are ignored by Git. They are local files; keep them when moving or backing up this project. Do not use `git clean -x` on this checkout unless the archives have been copied elsewhere first.

Verify the photography backup from `portfolio_react/`:

```sh
npm run photos:verify-backup
```

## Generate and review

```sh
npm run photos:prepare
npm run build
cp dist/index.html dist/404.html
npm run verify:build
npm run preview
```

Preparation verifies the backup before encoding, writes into ignored `.photo-staging/`, and validates outputs before replacing the public photography directory. It is resumable after interrupted encoding. Existing prepared output is reused when the settings and source checksum match. The previous public folder also remains in `.photo-staging/previous-public-*` after installation.

`src/photographyImages.json` maps the original source keys from `photographyData.js` to the generated public files. `src/photographySources.json` contains a compact version for the browser, excluding verification metadata. The original source keys remain stable for project selection and fullscreen keyboard navigation. A clean clone can build from the tracked generated files without the local masters; regenerating images requires the archive.

Review the gallery, an expanded project, fullscreen navigation, and mobile layouts locally before deployment. `npm run deploy` runs the build and verification before publishing. Verification blocks builds above 900 MB, missing/malformed image variants, unlisted photography files, and accidentally included archives. `.nojekyll` keeps the output as a static site.

## Recovery

The backup is independent of `public/photography/`: replacing generated public files cannot overwrite it. To return to the original image delivery, preserve the current generated folder elsewhere in `asset-archive/`, copy `asset-archive/photography-before-avif/files/` back to `portfolio_react/public/photography/`, and restore the previous `src/pages/Photography.jsx` from Git. The responsive component and manifest will then be unused. Review the changes before rebuilding; the original 1.7 GB photography folder will intentionally fail the new deployment size check.

No preparation or verification command commits, pushes, retries a workflow, or deploys a site.
