import { useParams } from 'react-router-dom';
import GalleryGrid from '../../components/Gallery/GalleryGrid.jsx';
import { ALL_MOCKUP_IMAGES } from '../Home/Home.jsx';
import styles from './StyleGallery.module.css';

/* ── Map URL slug → human-readable label ── */
const CATEGORY_LABELS = {
  editorial: 'Editorial Makeup',
  bridal:    'Bridal Makeup',
  fashion:   'Fashion & Runway',
  creative:  'Creative & Avant-Garde',
};

export default function StyleGallery() {
  const { categorySlug } = useParams();

  /* Friendly display name — fall back gracefully for unknown slugs */
  const categoryLabel =
    CATEGORY_LABELS[categorySlug] ??
    categorySlug
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) ??
    'Gallery';

  /* Filter images to only those matching the slug */
  const filteredImages = ALL_MOCKUP_IMAGES.filter(
    (img) => img.category === categorySlug,
  );

  return (
    <div className={styles.page}>
      {/* ── Page title — Achromatic Editorial headline-lg ── */}
      <h1 className={styles.categoryTitle}>{categoryLabel}</h1>

      {/* ── Gallery grid or empty state ── */}
      {filteredImages.length > 0 ? (
        <GalleryGrid images={filteredImages} />
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No images yet</p>
          <p className={styles.emptyText}>
            Content for this category is coming soon.
          </p>
        </div>
      )}
    </div>
  );
}
