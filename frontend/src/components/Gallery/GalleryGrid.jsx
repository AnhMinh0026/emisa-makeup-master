import { useState } from 'react';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import styles from './GalleryGrid.module.css';

/* ── Masonry breakpoints ── */
const BREAKPOINTS = {
  default: 3,   // > 900px — 3 columns
  900:     2,   // 600–900px — 2 columns
  // mobile stays 2 columns, heights shrink via CSS
};

/**
 * GalleryGrid — Reusable masonry grid with lightbox.
 *
 * @param {Array} images  Array of { id, src, alt, height } objects.
 */
export default function GalleryGrid({ images = [] }) {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <Masonry
        breakpointCols={BREAKPOINTS}
        className={styles.masonryGrid}
        columnClassName={styles.masonryColumn}
      >
        {images.map((img, i) => (
          <div
            key={img.id}
            className={styles.item}
            style={{ cursor: 'pointer' }}
            onClick={() => setIndex(i)}
          >
            <img
              className={styles.image}
              src={img.src}
              alt={img.alt}
              loading="lazy"
              style={{ height: img.height }}
            />
          </div>
        ))}
      </Masonry>

      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={images.map((img) => ({ src: img.src }))}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </>
  );
}
