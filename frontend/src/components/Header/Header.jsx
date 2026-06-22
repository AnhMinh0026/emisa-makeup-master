import { useState, useEffect } from 'react';
import { IconBrandInstagram, IconBrandFacebook, IconPhone } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from '@mantine/core';
import api from '../../lib/axios.js';
import styles from './Header.module.css';

const NAV_LINKS = [
  { label: 'HOME GALLERY', path: '/' },
  { label: 'STYLE GALLERIES', path: '/styles' },
  { label: 'PRICING', path: '/pricing' },
  { label: 'CONTACT', path: '/contact' },
];

/**
 * Renders the global site header featuring navigation links, category dropdowns, and social icons.
 * Fetches style gallery categories dynamically from the backend API.
 *
 * @returns {JSX.Element} The header component.
 */
export default function Header() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);

  // Retrieve dynamic categories for the dropdown menu; fail silently to preserve UI integrity.
  useEffect(() => {
    api
      .get('/categories')
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  return (
    <header className={styles.header}>
      {/* --- Stack: Centered Logo & Nav Row --- */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* --- Logo --- */}
        <Link to="/" className={styles.logo} aria-label="EMISA Home">
          EMISA
        </Link>

        {/* --- Navigation Bar --- */}
        <nav className={styles.navBar}>
          <div className={styles.navGroup}>
            {NAV_LINKS.map((link) => {
              if (link.label === 'STYLE GALLERIES') {
                const isStyleActive = location.pathname.startsWith('/styles');
                return (
                  <Menu
                    key={link.label}
                    shadow="none"
                    radius={0}
                    width={220}
                    position="bottom"
                    classNames={{
                      dropdown: styles.menuDropdown,
                      item: styles.menuItem,
                    }}
                  >
                    <Menu.Target>
                      <span
                        className={`${styles.navLink} ${isStyleActive ? styles.navLinkActive : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        {link.label}
                      </span>
                    </Menu.Target>

                    <Menu.Dropdown>
                      {categories.length === 0 ? (
                        /* Display a graceful fallback state when no categories exist. */
                        <Menu.Item disabled classNames={{ item: styles.menuItemEmpty }}>
                          No galleries yet
                        </Menu.Item>
                      ) : (
                        categories.map((cat) => (
                          <Menu.Item
                            key={cat._id}
                            component={Link}
                            to={`/styles/${cat.slug}`}
                          >
                            {cat.name.toUpperCase()}
                          </Menu.Item>
                        ))
                      )}
                    </Menu.Dropdown>
                  </Menu>
                );
              }

              if (link.label === 'PRICING') {
                const isPricingActive = location.pathname.startsWith('/pricing');
                return (
                  <Menu
                    key={link.label}
                    shadow="none"
                    radius={0}
                    width={220}
                    position="bottom"
                    classNames={{
                      dropdown: styles.menuDropdown,
                      item: styles.menuItem,
                    }}
                  >
                    <Menu.Target>
                      <span
                        className={`${styles.navLink} ${isPricingActive ? styles.navLinkActive : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        {link.label}
                      </span>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        component={Link}
                        to="/pricing/makeup"
                      >
                        BẢNG GIÁ MAKEUP
                      </Menu.Item>
                      <Menu.Item
                        component={Link}
                        to="/pricing/courses"
                      >
                        BẢNG GIÁ KHÓA HỌC
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                );
              }

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

        {/* --- Icon Row --- */}
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
