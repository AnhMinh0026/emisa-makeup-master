import { Container } from '@mantine/core';
import styles from './CoursePricing.module.css';

export default function CoursePricing() {
  return (
    <Container size="md" className={styles.page}>
      <div className={styles.centerStack}>
        <h1 className={styles.mainTitle}>BẢNG GIÁ KHÓA HỌC</h1>
        <p className={styles.placeholderText}>Pricing details coming soon...</p>
      </div>
    </Container>
  );
}
