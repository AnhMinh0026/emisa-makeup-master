import { Container, List, Box } from '@mantine/core';
import { IconRosetteDiscountCheck } from '@tabler/icons-react';
import pricingImage from '../../assets/Pricing/EmisaPrice.jpg';
import CourseGrid from '../../components/Courses/CourseGrid.jsx';
import styles from './CoursePricing.module.css';

/**
 * Renders the course pricing page.
 * Displays a hero section with marketing copy alongside the dynamic pricing list.
 *
 * @returns {JSX.Element} The course pricing page component.
 */
export default function CoursePricing() {
  return (
    <Container size="xl" className={styles.page}>
      {/* --- Hero Section --- */}
      <div className={styles.grid}>

        {/* --- Left Column: Image --- */}
        <div
          className={styles.imageWrapper}
          style={{ backgroundImage: `url(${pricingImage})` }}
          role="img"
          aria-label="Emisa Course Pricing"
        />

        {/* --- Right Column: Text --- */}
        <div className={styles.textColumn}>

          {/* --- Header --- */}
          <div className={styles.headerGroup}>
            <h2 className={styles.mainTitle}>BẢNG GIÁ KHÓA HỌC</h2>
          </div>

          {/* --- Paragraphs --- */}
          <div className={styles.paragraphGroup}>
            <p className={styles.bodyText}>
              Bạn đam mê nghệ thuật trang điểm và khao khát biến nó thành một sự nghiệp vững chắc? Dù bạn là người mới bắt đầu hay thợ nghề muốn nâng cấp kỹ năng, Emisa Academy tự hào mang đến các lộ trình đào tạo chuyên nghiệp, giúp bạn khai phá tiềm năng và tự tin bước vào nghề.
            </p>
            <p className={styles.bodyText}>
              Giáo trình tại Emisa được thiết kế sát với thực tế, chú trọng 80% thời lượng thực hành. Chúng tôi không chỉ truyền đạt kỹ thuật makeup đỉnh cao mà còn chia sẻ bí quyết xây dựng thương hiệu cá nhân, tư duy thẩm mỹ và cách nắm bắt tâm lý khách hàng để bạn có thể tự chủ tài chính ngay sau khóa học.
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
              Tài trợ 100% mỹ phẩm, dụng cụ cao cấp trong suốt quá trình học
            </List.Item>
            <List.Item className={styles.bulletItem}>
              Lộ trình học 1 kèm 1 cá nhân hóa, cầm tay chỉ việc đến khi vững nghề
            </List.Item>
            <List.Item className={styles.bulletItem}>
              Đồng hành định hướng nghề nghiệp và hỗ trợ cập nhật kiến thức trọn đời
            </List.Item>
          </List>

        </div>
      </div>

      {/* --- Course Grid Section --- */}
      <Box mt={{ base: 60, md: 100 }}>
        <CourseGrid />
      </Box>

    </Container>
  );
}