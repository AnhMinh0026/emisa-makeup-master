import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AppShell, Text, Stack, UnstyledButton, Group, Box } from '@mantine/core';
import {
  IconPhoto,
  IconTag,
  IconSettings,
  IconArrowLeft,
  IconLayoutDashboard,
  IconChevronRight,
} from '@tabler/icons-react';
import styles from './AdminLayout.module.css';

const NAV_LINKS = [
  { label: 'Gallery Manager', to: '/admin/gallery', icon: IconPhoto },
  { label: 'Categories', to: '/admin/categories', icon: IconTag },
  { label: 'Settings', to: '/admin/settings', icon: IconSettings },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <AppShell
      navbar={{ width: 230, breakpoint: 'sm' }}
      padding={0}
    >
      {/* ── SIDEBAR ── */}
      <AppShell.Navbar className={styles.navbar}>

        {/* Logo */}
        <Box className={styles.logoWrapper}>
          <Text className={styles.logo}>EMISA</Text>
          <Text className={styles.logoSub}>Admin Dashboard</Text>
        </Box>

        {/* Navigation */}
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

        {/* Back to site */}
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

      {/* ── MAIN CONTENT ── */}
      <AppShell.Main className={styles.main}>

        {/* Top bar */}
        <Box className={styles.topBar}>
          <Group gap={8}>
            <IconLayoutDashboard size={15} stroke={1.5} color="#868e96" />
            <Text className={styles.topBarLabel}>Admin Dashboard</Text>
          </Group>
        </Box>

        {/* Page outlet */}
        <Box className={styles.content}>
          <Outlet />
        </Box>

      </AppShell.Main>
    </AppShell>
  );
}
