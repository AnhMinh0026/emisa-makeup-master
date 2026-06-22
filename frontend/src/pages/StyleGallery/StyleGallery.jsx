import { useState, useEffect } from 'react';
import { Group, Pagination } from '@mantine/core';
import { useParams } from 'react-router-dom';
import api from '../../lib/axios.js';
import { GalleryGrid, galleryApi } from '../../features/gallery';
import styles from './StyleGallery.module.css';

/**
 * Renders a categorized image gallery based on the URL parameter.
 * Fetches images specific to the category and retrieves category metadata for the page title.
 *
 * @returns {JSX.Element} The style gallery page component.
 */
export default function StyleGallery() {
  const { categorySlug } = useParams();

  const [images, setImages]         = useState([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    if (!categorySlug) return;

    setLoading(true);
    setError(null);

    // Execute API requests concurrently to optimize load time.
    Promise.all([
      galleryApi.getAll({ category: categorySlug, page, limit: 16 }),
      api.get('/categories'),
    ])
      .then(([imagesRes, categoriesRes]) => {
        setImages(imagesRes.data.images || []);
        setTotalPages(imagesRes.data.pagination?.totalPages || 1);

        // Locate the matching category object to retrieve its human-readable display name.
        const match = (categoriesRes.data.categories || []).find(
          (c) => c.slug === categorySlug
        );
        // Provide a graceful fallback by capitalizing the slug when the category is absent from the database.
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
  }, [categorySlug, page]);

  useEffect(() => {
    // Reset page when category changes
    setPage(1);
  }, [categorySlug]);

  /* --- Loading State --- */
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.stateWrapper}>
          <p className={styles.loadingText}>LOADING...</p>
        </div>
      </div>
    );
  }

  /* --- Error State --- */
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
      {/* --- Page Title --- */}
      <h1 className={styles.categoryTitle}>{categoryName}</h1>

      {/* --- Gallery Grid / Empty State --- */}
      {images.length > 0 ? (
        <>
          <GalleryGrid images={images} />
          {totalPages > 1 && (
            <Group justify="center" mt="xl" pb="xl">
              <Pagination 
                total={totalPages} 
                value={page} 
                onChange={setPage} 
                color="dark" 
                radius="0" 
              />
            </Group>
          )}
        </>
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
