import { useState, useEffect } from 'react';
import { IconBrandInstagram, IconBrandFacebook, IconPhone } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from '@mantine/core';
import axios from 'axios';
import styles from './Header.module.css';

const NAV_LINKS = [
  { label: 'HOME GALLERY', path: '/' },
  { label: 'STYLE GALLERIES', path: '/styles' },
  { label: 'PRICING', path: '/pricing' },
  { label: 'CONTACT', path: '/contact' },
];

export default function Header() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);

  // Fetch live categories for the dropdown — silently ignore errors
  useEffect(() => {
    axios
      .get('/api/categories')
      .then(({ data }) => setCategories(data.categories || []))
      .catch(() => {}); // fail silently — dropdown just stays empty
  }, []);

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
                        /* Graceful empty state inside dropdown */
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
