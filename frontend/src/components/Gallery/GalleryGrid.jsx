import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import styles from './GalleryGrid.module.css';

/**
 * GalleryGrid — Uniform CSS Grid with lightbox.
 *
 * Accepts the MongoDB/Cloudinary data shape:
 *   { _id, imageUrl, title, category, isFeatured, isHidden }
 *
 * Also accepts legacy local shape for backward compat:
 *   { id, src, alt }
 *
 * @param {Array} images
 */
export default function GalleryGrid({ images = [] }) {
  const [index, setIndex] = useState(-1);

  // Normalise both data shapes so the grid & lightbox work with either
  const normalised = images.map((img) => ({
    key: img._id   ?? img.id,
    src: img.imageUrl ?? img.src,
    alt: img.title    ?? img.alt ?? '',
  }));

  return (
    <div className={styles.gridWrapper}>
      <div className={styles.grid}>
        {normalised.map((img, i) => (
          <div
            key={img.key ?? i}
            className={styles.item}
            onClick={() => setIndex(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setIndex(i)}
            aria-label={`Open ${img.alt || 'image'} in lightbox`}
          >
            <img
              className={styles.image}
              src={img.src}
              alt={img.alt}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={normalised.map((img) => ({ src: img.src, alt: img.alt }))}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </div>
  );
}
