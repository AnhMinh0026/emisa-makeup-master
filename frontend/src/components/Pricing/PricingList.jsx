import { useState, useEffect } from 'react';
import { Box, Text, Loader, Stack, Group, Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@tabler/icons-react';
import axios from 'axios';
import styles from './PricingList.module.css';

/**
 * PricingList — Public-facing pricing cards.
 * Achromatic Editorial: 0px radius, pure black/white, 1px solid #000 borders.
 *
 * @param {string} category - 'makeup' | 'course'
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
      {/* Section header */}
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

      {/* Package list */}
      <Stack gap={0} className={styles.list}>
        {services.map((svc, i) => (
          <Box key={svc._id} className={styles.item}>
            {/* Row number */}
            <Text className={styles.itemIndex}>
              {String(i + 1).padStart(2, '0')}
            </Text>

            {/* Name + description */}
            <Box className={styles.itemBody}>
              <Text className={styles.itemName}>{svc.name}</Text>
              {svc.description && (
                <Text className={styles.itemDescription}>{svc.description}</Text>
              )}
            </Box>

            {/* Price */}
            <Text className={styles.itemPrice}>{svc.price}</Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
