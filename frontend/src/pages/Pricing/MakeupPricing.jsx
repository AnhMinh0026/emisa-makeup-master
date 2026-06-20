import { Container } from '@mantine/core';
import styles from './MakeupPricing.module.css';

/**
 * Renders the pricing page for makeup training courses.
 * Currently serves as a placeholder for future content.
 *
 * @returns {JSX.Element} The course pricing page component.
 */
export default function CoursePricing() {
  return (
    <Container size="md" className={styles.page}>
      <div className={styles.centerStack}>
        <h1 className={styles.mainTitle}>BẢNG GIÁ MAKEUP</h1>
        <p className={styles.placeholderText}>Pricing details coming soon...</p>
      </div>
    </Container>
  );
}
