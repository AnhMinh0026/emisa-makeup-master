import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AppShell, Text, Stack, UnstyledButton, Group, Box } from '@mantine/core';
import {
  IconPhoto,
  IconTag,
  IconSettings,
  IconArrowLeft,
  IconLayoutDashboard,
  IconChevronRight,
  IconAddressBook,
  IconCurrencyDong,
  IconSchool,
} from '@tabler/icons-react';
import styles from './AdminLayout.module.css';

const NAV_LINKS = [
  { label: 'Gallery Manager', to: '/admin/gallery', icon: IconPhoto },
  { label: 'Categories', to: '/admin/categories', icon: IconTag },
  { label: 'Courses', to: '/admin/courses', icon: IconSchool },
  { label: 'Pricing Packages', to: '/admin/services', icon: IconCurrencyDong },
  { label: 'Contact Settings', to: '/admin/contact', icon: IconAddressBook },
  { label: 'Settings', to: '/admin/settings', icon: IconSettings },
];

/**
 * Provides the main layout structure for the admin dashboard.
 * Includes a responsive sidebar navigation and a main content area.
 *
 * @returns {JSX.Element} The admin layout component.
 */
export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <AppShell
      navbar={{ width: 230, breakpoint: 'sm' }}
      padding={0}
    >
      {/* --- Sidebar --- */}
      <AppShell.Navbar className={styles.navbar}>

        {/* --- Logo --- */}
        <Box className={styles.logoWrapper}>
          <Text className={styles.logo}>EMISA</Text>
          <Text className={styles.logoSub}>Admin Dashboard</Text>
        </Box>

        {/* --- Navigation --- */}
        <Stack gap={0} className={styles.navStack}>
          <Text className={styles.navSection}>Navigation</Text>

          {NAV_LINKS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <Group gap={10} wrap="nowrap">
                <Icon size={16} stroke={1.8} />
                <Text className={styles.navLinkText}>{label}</Text>
              </Group>
            </NavLink>
          ))}
        </Stack>

        {/* --- Back to Website --- */}
        <Box className={styles.backWrapper}>
          <UnstyledButton
            className={styles.backLink}
            onClick={() => navigate('/')}
          >
            <Group gap={8} wrap="nowrap">
              <IconArrowLeft size={14} stroke={1.8} />
              <Text className={styles.navLinkText}>Back to Website</Text>
            </Group>
          </UnstyledButton>
        </Box>

      </AppShell.Navbar>

      {/* --- Main Content --- */}
      <AppShell.Main className={styles.main}>

        {/* --- Top Bar --- */}
        <Box className={styles.topBar}>
          <Group gap={8}>
            <IconLayoutDashboard size={15} stroke={1.5} color="#868e96" />
            <Text className={styles.topBarLabel}>Admin Dashboard</Text>
          </Group>
        </Box>

        {/* --- Page Outlet --- */}
        <Box className={styles.content}>
          <Outlet />
        </Box>

      </AppShell.Main>
    </AppShell>
  );
}
