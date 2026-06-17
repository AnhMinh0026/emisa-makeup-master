import { IconBrandInstagram, IconBrandFacebook, IconPhone } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const NAV_LINKS = [
  { label: 'HOME GALLERY', path: '/' },
  { label: 'STYLE GALLERIES', path: '/style-galleries' },
  { label: 'CONTACT', path: '/contact' },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className={styles.header}>
      {/* ── Stack: logo centred, then nav row ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* LOGO */}
        <Link to="/" className={styles.logo} aria-label="EMISA Home">
          EMISA
        </Link>

        {/* NAV BAR */}
        <nav className={styles.navBar}>
          <div className={styles.navGroup}>
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}

          </div>
        </nav>

        {/* ── ICON ROW — below nav links ── */}
        <div className={styles.iconRow}>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={styles.iconLink}
          >
            <IconBrandInstagram size={18} stroke={1.5} />
          </a>
          <a
            href="#"
            aria-label="Camera / Portfolio"
            className={styles.iconLink}
          >
            <IconPhone size={18} stroke={1.5} />
          </a>
          <a
            href="mailto:contact@emisa.com"
            aria-label="Email us"
            className={styles.iconLink}
          >
            <IconBrandFacebook size={18} stroke={1.5} />
          </a>
        </div>

      </div>
    </header>
  );
}
