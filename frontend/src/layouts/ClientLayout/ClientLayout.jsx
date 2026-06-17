import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop.jsx';
import styles from './ClientLayout.module.css';

export default function ClientLayout() {
  return (
    <div className={styles.wrapper}>

      {/* ── HEADER ── */}
      <Header />

      {/* ── 1px black ruling line divider ── */}
      <hr className={styles.divider} />

      {/* ── PAGE CONTENT ── */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── SCROLL TO TOP ── */}
      <ScrollToTop />

    </div>
  );
}
