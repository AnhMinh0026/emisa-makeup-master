import { useState, useEffect } from 'react';
import { Group, Pagination } from '@mantine/core';
import { GalleryGrid, galleryApi } from "../../features/gallery";
import styles from './Home.module.css';

/**
 * Renders the homepage displaying a gallery grid of featured images.
 * Fetches only images marked as 'isFeatured' from the backend.
 *
 * @returns {JSX.Element} The home page component.
 */
export default function Home() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    galleryApi
      .getAll({ isFeatured: true, page, limit: 16 })
      .then(({ data }) => {
        setImages(data.images || []);
        setTotalPages(data.pagination?.totalPages || 1);
      })
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load images.'))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.loadingText}>LOADING...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.errorTitle}>COULD NOT LOAD GALLERY</p>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.emptyTitle}>NO FEATURED IMAGES YET</p>
        <p className={styles.emptyText}>
          Mark images as "Featured" in the admin panel to display them here.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
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
    </div>
  );
}
