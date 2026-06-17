import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  { label: 'PRIVACY', path: '/privacy' },
  { label: 'TERMS',   path: '/terms'   },
  { label: 'CREDITS', path: '/credits' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>

      {/* ── LEFT: Brand ── */}
      <Link to="/" className={styles.brand}>
        EMISA
      </Link>

      {/* ── CENTER: Policy links ── */}
      <nav className={styles.links}>
        {FOOTER_LINKS.map((link) => (
          <Link key={link.label} to={link.path} className={styles.link}>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* ── RIGHT: Copyright ── */}
      <span className={styles.copyright}>
        © 2024 ACHROMATIC EDITORIAL. ALL RIGHTS RESERVED.
      </span>

    </footer>
  );
}
