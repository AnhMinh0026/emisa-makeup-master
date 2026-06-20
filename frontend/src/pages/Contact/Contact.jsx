import { useState, useEffect } from 'react';
import {
  Stack,
  Box,
  Text,
  List,
  Loader,
  Anchor,
} from '@mantine/core';
import {
  IconPhone,
  IconBrandFacebook,
  IconBrandInstagram,
  IconMapPin,
} from '@tabler/icons-react';
import axios from 'axios';
import styles from './Contact.module.css';

const API_URL = '/api/contact';

/**
 * Renders the public contact page containing communication channels and an embedded map.
 * Fetches dynamic contact details from the backend API.
 *
 * @returns {JSX.Element} The contact page component.
 */
export default function Contact() {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API_URL)
      .then(({ data }) => setContactData(data))
      .catch((err) => console.error('Failed to load contact data:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box className={styles.loadingWrapper}>
        <Loader size="sm" color="dark" />
      </Box>
    );
  }

  const hasMap = contactData?.mapEmbedCode && contactData.mapEmbedCode.trim() !== '';

  return (
    <Box className={styles.page}>

      {/* --- Header --- */}
      <Box className={styles.headerBlock}>
        <Text
          className={styles.headerText}
          fw={900}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Quý khách có nhu cầu đặt lịch makeup,<br />
          vui lòng liên hệ trực tiếp đến Emisa:
        </Text>
      </Box>

      {/* --- Contact List --- */}
      <Box className={styles.listBlock}>
        <List spacing="sm" className={styles.contactList}>

          {contactData?.phone && (
            <List.Item
              icon={<IconPhone size={16} stroke={1.8} />}
              className={styles.listItem}
            >
              <Text className={styles.listText} style={{ fontFamily: "'Inter', sans-serif" }}>{contactData.phone}</Text>
            </List.Item>
          )}

          {contactData?.facebook && (
            <List.Item
              icon={<IconBrandFacebook size={16} stroke={1.8} />}
              className={styles.listItem}
            >
              <Anchor
                href={contactData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.listLink}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {contactData.facebook}
              </Anchor>
            </List.Item>
          )}

          {contactData?.instagram && (
            <List.Item
              icon={<IconBrandInstagram size={16} stroke={1.8} />}
              className={styles.listItem}
            >
              <Anchor
                href={contactData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.listLink}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {contactData.instagram}
              </Anchor>
            </List.Item>
          )}

          {contactData?.address && (
            <List.Item
              icon={<IconMapPin size={16} stroke={1.8} />}
              className={styles.listItem}
            >
              <Text className={styles.listText} style={{ fontFamily: "'Inter', sans-serif" }}>{contactData.address}</Text>
            </List.Item>
          )}

        </List>
      </Box>

      {/* --- Map Section --- */}
      {hasMap && (
        <Box className={styles.mapSection}>
          <Text
            className={styles.mapSubtitle}
            fw={800}
            style={{ fontFamily: "'Inter', sans-serif" }}
          > Xem bản đồ vị trí Emisa Studio:</Text>
          <Box className={styles.mapContainer}>
            <div
              className={styles.mapEmbed}
              dangerouslySetInnerHTML={{ __html: contactData.mapEmbedCode }}
            />
          </Box>
        </Box>
      )}

    </Box>
  );
}
