import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Group,
  Text,
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  Checkbox,
  Stack,
  Loader,
  Paper,
  Title,
  Box,
  Image,
  Badge,
  Tooltip,
  FileInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconPencil, IconTrash, IconCheck, IconX, IconSchool, IconPhoto } from '@tabler/icons-react';
import api from '../../../lib/axios.js';
import styles from './AdminGallery.module.css'; // Reusing standard SaaS table styles

/**
 * Admin page for managing training courses.
 *
 * @returns {JSX.Element} The admin courses page.
 */
export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const form = useForm({
    initialValues: {
      title: '',
      overview: '',
      details: '',
      price: '',
      duration: '',
      imageFile: null,
      isHidden: false,
    },
    validate: {
      title: (val) => (val.trim() ? null : 'Title is required'),
      overview: (val) => (val.trim() ? null : 'Overview is required'),
      details: (val) => (val.trim() ? null : 'Details are required'),
      price: (val) => (val.trim() ? null : 'Price is required'),
      duration: (val) => (val.trim() ? null : 'Duration is required'),
      imageFile: (val) => (!editingId && !val ? 'Image file is required' : null),
    },
  });

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/courses?admin=true');
      setCourses(data.courses || []);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Could not load courses.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleAdd = () => {
    setEditingId(null);
    form.reset();
    setModalOpened(true);
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    form.setValues({
      title: course.title,
      overview: course.overview,
      details: course.details,
      price: course.price,
      duration: course.duration,
      imageFile: null,
      isHidden: course.isHidden,
    });
    setModalOpened(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/courses/${id}`);
      notifications.show({
        title: 'Deleted',
        message: 'Course removed successfully.',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      fetchCourses();
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Could not delete course.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('overview', values.overview);
      formData.append('details', values.details);
      formData.append('price', values.price);
      formData.append('duration', values.duration);
      formData.append('isHidden', values.isHidden);
      if (values.imageFile) {
        formData.append('image', values.imageFile);
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editingId) {
        await api.put(`/courses/${editingId}`, formData, config);
        notifications.show({
          title: 'Updated',
          message: 'Course updated successfully.',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      } else {
        await api.post('/courses', formData, config);
        notifications.show({
          title: 'Created',
          message: 'Course created successfully.',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      }
      setModalOpened(false);
      fetchCourses();
    } catch (err) {
      notifications.show({
        title: 'Submission Failed',
        message: err?.response?.data?.message || 'Server error',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const rows = courses.map((course) => (
    <Table.Tr key={course._id}>
      <Table.Td>
        <Box className={styles.thumb}>
          {course.imageUrl ? (
            <Image src={course.imageUrl} alt={course.title} fit="cover" w={44} h={44} radius="sm" />
          ) : (
            <Box className={styles.thumbPlaceholder}>
              <IconPhoto size={18} color="#adb5bd" />
            </Box>
          )}
        </Box>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={500} c="dark">{course.title}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dark.7">{course.price}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dark.7">{course.duration}</Text>
      </Table.Td>
      <Table.Td>
        {course.isHidden ? (
          <Badge variant="light" color="gray" size="sm">Hidden</Badge>
        ) : (
          <Badge variant="light" color="green" size="sm">Active</Badge>
        )}
      </Table.Td>
      <Table.Td>
        <Group gap={6} justify="flex-end" wrap="nowrap">
          <Tooltip label="Edit" position="top">
            <ActionIcon variant="subtle" color="gray" size={32} onClick={() => handleEdit(course)}>
              <IconPencil size={15} stroke={1.7} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete" position="top">
            <ActionIcon variant="subtle" color="red" size={32} onClick={() => handleDelete(course._id, course.title)}>
              <IconTrash size={15} stroke={1.7} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <Box>
          <Title order={3} fw={700} c="dark.8">Courses Manager</Title>
          <Text size="sm" c="dimmed" mt={4}>
            {courses.length} course{courses.length !== 1 ? 's' : ''} found
          </Text>
        </Box>
        <Button leftSection={<IconPlus size={15} />} onClick={handleAdd} radius="md" color="blue">
          Add Course
        </Button>
      </Group>

      <Paper shadow="xs" radius="md" withBorder>
        {loading ? (
          <Stack align="center" py={64} gap={12}>
            <Loader size="sm" />
            <Text size="sm" c="dimmed">Loading courses…</Text>
          </Stack>
        ) : courses.length === 0 ? (
          <Stack align="center" py={64} gap={12}>
            <IconSchool size={36} color="#adb5bd" stroke={1.2} />
            <Text size="sm" fw={600} c="dark.4">No courses found</Text>
            <Text size="xs" c="dimmed">Click "Add Course" to create the first one.</Text>
          </Stack>
        ) : (
          <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className={styles.th} w={68}>—</Table.Th>
                <Table.Th className={styles.th}>Title</Table.Th>
                <Table.Th className={styles.th}>Price</Table.Th>
                <Table.Th className={styles.th}>Duration</Table.Th>
                <Table.Th className={styles.th}>Status</Table.Th>
                <Table.Th className={styles.th} ta="right">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
      </Paper>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          <Text fw={600} size="lg" c="dark.8">
            {editingId ? 'Edit Course' : 'Add Course'}
          </Text>
        }
        size="lg"
        radius="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput label="Title" placeholder="e.g., Khóa Học Makeup Cá Nhân" {...form.getInputProps('title')} />
            <TextInput label="Price" placeholder="e.g., 5.000.000đ" {...form.getInputProps('price')} />
            <TextInput label="Duration" placeholder="e.g., 20 buổi - 60 giờ" {...form.getInputProps('duration')} />
            <FileInput 
              label="Course Image" 
              placeholder="Upload image" 
              accept="image/png,image/jpeg,image/webp" 
              {...form.getInputProps('imageFile')} 
            />
            <Textarea 
              label="Overview (Card Description)" 
              placeholder="Short summary for the public grid" 
              autosize
              minRows={3}
              maxRows={6}
              {...form.getInputProps('overview')} 
            />
            <Textarea 
              label="Details (Full Content)" 
              placeholder="Full rich description for the detail page" 
              autosize
              minRows={5}
              maxRows={15}
              {...form.getInputProps('details')} 
            />
            <Checkbox label="Hidden (draft mode)" {...form.getInputProps('isHidden', { type: 'checkbox' })} />

            <Group justify="flex-end" mt="md">
              <Button variant="light" color="gray" onClick={() => setModalOpened(false)} radius="md">Cancel</Button>
              <Button type="submit" color="blue" radius="md">
                {editingId ? 'Save Changes' : 'Create Course'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
