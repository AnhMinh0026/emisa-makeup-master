import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  { label: 'PRIVACY', path: '/privacy' },
  { label: 'TERMS',   path: '/terms'   },
  { label: 'CREDITS', path: '/credits' },
];

/**
 * Renders the global footer containing brand information, policy links, and copyright.
 *
 * @returns {JSX.Element} The footer component.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>

      {/* --- Left: Brand --- */}
      <Link to="/" className={styles.brand}>
        EMISA
      </Link>

      {/* --- Center: Policy Links --- */}
      <nav className={styles.links}>
        {FOOTER_LINKS.map((link) => (
          <Link key={link.label} to={link.path} className={styles.link}>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* --- Right: Copyright --- */}
      <span className={styles.copyright}>
        © 2024 ACHROMATIC EDITORIAL. ALL RIGHTS RESERVED.
      </span>

    </footer>
  );
}
