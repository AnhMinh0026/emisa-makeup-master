import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop.jsx';
import styles from './ClientLayout.module.css';

/**
 * Acts as the primary layout wrapper for public-facing pages.
 * Incorporates the global header, footer, scroll-to-top utility, and page content.
 *
 * @returns {JSX.Element} The client layout component.
 */
export default function ClientLayout() {
  return (
    <div className={styles.wrapper}>

      {/* --- Header --- */}
      <Header />

      {/* --- Divider --- */}
      <hr className={styles.divider} />

      {/* --- Page Content --- */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* --- Footer --- */}
      <Footer />

      {/* --- Scroll To Top --- */}
      <ScrollToTop />

    </div>
  );
}
