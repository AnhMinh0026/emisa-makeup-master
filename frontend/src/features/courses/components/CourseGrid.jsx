import { useState, useEffect } from 'react';
import { SimpleGrid, Box, Text, Image, Button, Stack, Loader } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { courseApi } from '../api/courseApi.js';
import styles from './CourseGrid.module.css';

/**
 * Public course grid component showcasing available training courses.
 * Strictly adheres to the Achromatic Editorial aesthetic.
 *
 * @returns {JSX.Element} The course grid component.
 */
export default function CourseGrid() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    courseApi
      .getAll()
      .then(({ data }) => setCourses(data.courses || []))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load courses.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box className={styles.stateWrapper}>
        <Text className={styles.loadingText}>LOADING COURSES...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={styles.stateWrapper}>
        <Text className={styles.errorText}>{error}</Text>
      </Box>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <Box className={styles.wrapper}>
      {/* Subtitle / Header */}
      <Box className={styles.header}>
        <Text className={styles.subtitle}>
          DÀNH CHO NHỮNG BẠN MUỐN LÀM NGHỀ TRANG ĐIỂM, HÓA TRANG
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
        {courses.map((course) => (
          <Box key={course._id} className={styles.card}>
            <Image
              src={course.imageUrl}
              alt={course.title}
              className={styles.image}
              radius="0"
            />
            <Stack gap="xs" mt="md" className={styles.cardContent}>
              <Text className={styles.cardTitle}>{course.title}</Text>
              <Text className={styles.cardOverview} lineClamp={3}>
                {course.overview}
              </Text>
              <Button
                variant="filled"
                color="dark"
                radius="0"
                fullWidth
                mt="md"
                className={styles.cardButton}
                onClick={() => navigate(`/pricing/courses/${course._id}`)}
              >
                XEM THÔNG TIN
              </Button>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
