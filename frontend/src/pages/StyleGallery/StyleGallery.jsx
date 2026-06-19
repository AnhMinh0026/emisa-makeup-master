import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GalleryGrid from '../../components/Gallery/GalleryGrid.jsx';
import styles from './StyleGallery.module.css';

export default function StyleGallery() {
  const { categorySlug } = useParams();

  const [images, setImages]         = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    if (!categorySlug) return;

    setLoading(true);
    setError(null);

    // Fire both requests in parallel
    Promise.all([
      axios.get(`/api/images?category=${categorySlug}`),
      axios.get('/api/categories'),
    ])
      .then(([imagesRes, categoriesRes]) => {
        setImages(imagesRes.data.images || []);

        // Find the matching category to get its display name
        const match = (categoriesRes.data.categories || []).find(
          (c) => c.slug === categorySlug
        );
        // Graceful fallback: capitalise the slug if category not found in DB
        setCategoryName(
          match?.name ??
          categorySlug
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase())
        );
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Failed to load gallery.');
      })
      .finally(() => setLoading(false));
  }, [categorySlug]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.stateWrapper}>
          <p className={styles.loadingText}>LOADING...</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.stateWrapper}>
          <p className={styles.emptyTitle}>COULD NOT LOAD GALLERY</p>
          <p className={styles.emptyText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Page title — Achromatic Editorial headline-lg ── */}
      <h1 className={styles.categoryTitle}>{categoryName}</h1>

      {/* ── Gallery grid or empty state ── */}
      {images.length > 0 ? (
        <GalleryGrid images={images} />
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>NO IMAGES FOUND</p>
          <p className={styles.emptyText}>
            No images have been added to this category yet.
          </p>
        </div>
      )}
    </div>
  );
}
