import { useState, useEffect } from 'react';
import { Box, Text, Loader, Stack, Group, Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@tabler/icons-react';
import axios from 'axios';
import styles from './PricingList.module.css';

/**
 * Renders a list of pricing services based on the provided category.
 * Employs an achromatic editorial design with sharp corners and stark contrast.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.category - The category of services to fetch ('makeup' | 'course').
 * @returns {JSX.Element|null} The pricing list component, or null if no services exist.
 */
export default function PricingList({ category }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    axios
      .get(`/api/services?category=${category}`)
      .then(({ data }) => setServices(data.services || []))
      .catch((err) => console.error('Failed to load services:', err))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) {
    return (
      <Box className={styles.loadingWrapper}>
        <Loader size="xs" color="dark" />
      </Box>
    );
  }

  if (services.length === 0) return null;

  return (
    <Box className={styles.wrapper}>
      {/* --- Section Header --- */}
      <Group justify="space-between" align="flex-end" className={styles.sectionHeader}>
        <h2 className={styles.sectionLabel}>BẢNG GIÁ DỊCH VỤ</h2>
        <Button
          component={Link}
          to="/contact"
          radius="0"
          size="md"
          tt="uppercase"
          rightSection={<IconArrowRight size={18} />}
          className={styles.ctaButton}
        >
          Liên hệ đặt lịch ngay
        </Button>
      </Group>

      {/* --- Package List --- */}
      <Stack gap={0} className={styles.list}>
        {services.map((svc, i) => (
          <Box key={svc._id} className={styles.item}>
            <Text className={styles.itemIndex}>
              {String(i + 1).padStart(2, '0')}
            </Text>

            <Box className={styles.itemBody}>
              <Text className={styles.itemName}>{svc.name}</Text>
              {svc.description && (
                <Text className={styles.itemDescription}>{svc.description}</Text>
              )}
            </Box>

            <Text className={styles.itemPrice}>{svc.price}</Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
