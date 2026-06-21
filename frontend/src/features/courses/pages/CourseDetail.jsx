import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Text, Button, Stack, Title, Group, Grid } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { courseApi } from '../api/courseApi.js';
import styles from './CourseDetail.module.css';

/**
 * Public detailed view of a specific training course.
 * Re-designed with a cinematic Hero Banner and a focused reading container.
 *
 * @returns {JSX.Element} The course detail page.
 */
export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    courseApi
      .getById(id)
      .then(({ data }) => setCourse(data.course))
      .catch((err) => setError(err?.response?.data?.message || 'Course not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box className={styles.stateWrapper}>
        <Text className={styles.loadingText}>LOADING COURSE...</Text>
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Box className={styles.stateWrapper}>
        <Text className={styles.errorText}>{error || 'Course not found.'}</Text>
        <Button variant="subtle" color="dark" mt="md" onClick={() => navigate('/pricing/courses')} leftSection={<IconArrowLeft size={16} />}>
          BACK TO COURSES
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.pageWrapper}>
      <Container size="xxl" pt="md" pb="sm">
        <Button
          variant="transparent"
          className={styles.backBtn}
          onClick={() => navigate('/pricing/courses')}
          leftSection={<IconArrowLeft size={16} />}
        >
          ALL COURSES
        </Button>
      </Container>

      {/* --- PART 1: HERO BANNER --- */}
      <Box
        className={styles.heroBanner}
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${course.imageUrl})` }}
      >
        <Container size="xxl" className={styles.heroContainer}>
          <Title order={1} className={styles.heroTitle}>
            {course.title}
          </Title>
        </Container>
      </Box>

      {/* --- PART 2: DETAILS SECTION --- */}
      <Container size="lg" className={styles.contentContainer}>

        {/* Meta Info Grid */}
        <Box className={styles.metaBox}>
          <Grid>
            <Grid.Col span={6} className={styles.metaColLeft}>
              <Text className={styles.metaLabel}>THỜI GIAN</Text>
              <Text className={styles.metaValue}>{course.duration}</Text>
            </Grid.Col>
            <Grid.Col span={6} className={styles.metaColRight}>
              <Text className={styles.metaLabel}>HỌC PHÍ</Text>
              <Text className={styles.metaValue}>{course.price}</Text>
            </Grid.Col>
          </Grid>
        </Box>

        <Stack gap="xl" mt="xl">
          {course.overview && (
            <Text className={styles.overviewText}>
              {course.overview}
            </Text>
          )}

          <Box className={styles.detailsBox}>
            <div className={styles.detailsText} style={{ whiteSpace: 'pre-line' }}>
              {course.details}
            </div>
          </Box>

          <Button
            size="xl"
            variant="filled"
            color="dark"
            radius="0"
            className={styles.ctaButton}
            onClick={() => navigate('/contact')}
          >
            ĐĂNG KÝ NGAY
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
