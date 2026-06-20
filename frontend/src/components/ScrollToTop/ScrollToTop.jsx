import { useState, useEffect } from 'react';
import { IconArrowUp } from '@tabler/icons-react';
import styles from './ScrollToTop.module.css';

// Reveal the button when the vertical scroll exceeds this pixel threshold.
const SCROLL_THRESHOLD = 300;

/**
 * Provides a floating button that scrolls the window back to the top when clicked.
 * Automatically appears based on the user's scroll position.
 *
 * @returns {JSX.Element} The scroll-to-top button component.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`${styles.btn} ${visible ? styles.visible : ''}`}
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      title="Back to top"
    >
      <span className={styles.icon}>
        <IconArrowUp size={18} stroke={2} />
      </span>
    </button>
  );
}
