import { useState, useEffect } from 'react';
import axios from 'axios';
import GalleryGrid from '../../components/Gallery/GalleryGrid.jsx';
import styles from './Home.module.css';

/**
 * Renders the homepage displaying a gallery grid of featured images.
 * Fetches only images marked as 'isFeatured' from the backend.
 *
 * @returns {JSX.Element} The home page component.
 */
export default function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('/api/images?isFeatured=true')
      .then(({ data }) => setImages(data.images || []))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load images.'))
      .finally(() => setLoading(false));
  }, []);

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

  return <GalleryGrid images={images} />;
}
