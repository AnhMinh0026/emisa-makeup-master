import { Container, List, Box } from '@mantine/core';
import { IconRosetteDiscountCheck } from '@tabler/icons-react';
import pricingImage from '../../assets/Pricing/EmisaPrice.jpg';
import PricingList from '../../components/Pricing/PricingList.jsx';
import styles from './MakeupPricing.module.css';

/**
 * Renders the makeup services pricing page.
 * Displays a hero section with marketing copy alongside the dynamic pricing list.
 *
 * @returns {JSX.Element} The makeup pricing page component.
 */
export default function MakeupPricing() {
  return (
    <Container size="xl" className={styles.page}>
    <Container size="xl" className={styles.page}>
      {/* --- Hero Section --- */}
      <div className={styles.grid}>

        {/* --- Left Column: Image --- */}
        <div
          className={styles.imageWrapper}
          style={{ backgroundImage: `url(${pricingImage})` }}
          role="img"
          aria-label="Emisa Makeup Pricing"
        />

        {/* --- Right Column: Text --- */}
        <div className={styles.textColumn}>

          {/* --- Header --- */}
          <div className={styles.headerGroup}>
            <h2 className={styles.mainTitle}>BẢNG GIÁ MAKEUP</h2>
          </div>

          {/* --- Paragraphs --- */}
          <div className={styles.paragraphGroup}>
            <p className={styles.bodyText}>
              Bạn đang quan tâm về giá dịch vụ trang điểm tại Emisa là bao nhiêu? Nếu trang điểm cô dâu, dự tiệc tại nhà thì mức giá makeup như thế nào? Emisa xin đưa ra bảng giá makeup chính thức khu vực TP. Hồ Chí Minh để bạn tham khảo như sau:
            </p>
            <p className={styles.bodyText}>
              Với triết lý tôn vinh những đường nét tự nhiên, Emisa cam kết mang đến cho bạn trải nghiệm dịch vụ hoàn hảo nhất. Chúng tôi hiểu rằng mỗi gương mặt là một tác phẩm nghệ thuật độc bản, xứng đáng được chăm chút bởi đôi tay tài hoa và những dòng mỹ phẩm highend hàng đầu.
            </p>
          </div>

          {/* --- Bullet List --- */}
          <List
            className={styles.bulletList}
            icon={
              <IconRosetteDiscountCheck
                className={styles.bulletIcon}
                size={20}
                color="#2b8a3e"
                stroke={2}
              />
            }
            spacing="md"
            size="md"
          >
            <List.Item className={styles.bulletItem}>
              Sử dụng 100% mỹ phẩm chính hãng (Dior, Chanel, MAC...)
            </List.Item>
            <List.Item className={styles.bulletItem}>
              Tư vấn layout cá nhân hóa theo từng khuôn mặt
            </List.Item>
            <List.Item className={styles.bulletItem}>
              Đội ngũ chuyên nghiệp, đúng giờ, tận tâm
            </List.Item>
          </List>

        </div>
      </div>

      {/* --- Pricing Packages Section --- */}
      <Box className={styles.pricingSection}>
        <PricingList category="makeup" />
      </Box>

    </Container>
  );
}
