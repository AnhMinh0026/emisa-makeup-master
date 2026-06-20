import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A utility component that scrolls the window to the top whenever
 * the React Router location (pathname) changes.
 *
 * @returns {null} This component renders nothing.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
