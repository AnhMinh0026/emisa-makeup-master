import { Container, Box, Title, Text, Blockquote } from '@mantine/core';
import { IconQuote } from '@tabler/icons-react';
import heroImage from '../../assets/Pricing/EmisaPriceMakeup.jpg';
import { PricingList } from '../../features/services';
import styles from './MakeupPricing.module.css';

/**
 * Renders the pricing page for professional makeup services.
 * Features a full-width cinematic hero banner followed by the editorial pricing list.
 *
 * @returns {JSX.Element} The makeup pricing page component.
 */
export default function MakeupPricing() {
  return (
    <Box>
      {/* ─── Cinematic Hero Banner ─── */}
      <Box
        className={styles.hero}
        style={{ backgroundImage: `url(${heroImage})` }}
        role="img"
        aria-label="Emisa Makeup Service Pricing"
      >
        {/* Dark gradient overlay */}
        <Box className={styles.heroOverlay}>
          <Box className={styles.heroContent}>
            <Text className={styles.heroEyebrow}>EMISA BEAUTY STUDIO</Text>
            <Title className={styles.heroTitle}>
              DỊCH VỤ MAKEUP<br />CHUYÊN NGHIỆP
            </Title>
            <Box className={styles.heroDivider} />
            <Text className={styles.heroSub}>
              Nghệ thuật làm đẹp — Tinh tế từng đường nét
            </Text>
          </Box>
        </Box>
      </Box>

      {/* ─── Content Section ─── */}
      <Container size="lg" className={styles.contentSection}>

        {/* ─── Pull-Quote Blockquote ─── */}
        <Blockquote
          icon={<IconQuote size={30} stroke={1.5} />}
          color="dark"
          radius="0"
          fz="lg"
          fs="italic"
          my={{ base: 40, md: 60 }}
          maw={800}
          // mx="auto"
          ta="left"
          className={styles.pullQuote}
        >
          Tại Emisa, chúng tôi tin rằng mỗi gương mặt là một tác phẩm nghệ thuật độc bản.
          Khám phá các gói dịch vụ trang điểm cao cấp được thiết kế riêng cho bạn — từ
          trang điểm cô dâu thanh lịch đến make-up sân khấu ấn tượng.
        </Blockquote>

        {/* Pricing list */}
        <div style={{ paddingTop: '50px' }}>
          <PricingList category="makeup" />
        </div>
      </Container>
    </Box>
  );
}
