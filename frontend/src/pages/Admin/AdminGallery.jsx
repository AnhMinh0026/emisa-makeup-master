import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Group,
  Text,
  Box,
  Badge,
  Image,
  ActionIcon,
  Loader,
  Stack,
  Tooltip,
  Paper,
  Title,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconCheck,
  IconX,
  IconPhoto,
  IconEyeOff,
  IconStar,
} from '@tabler/icons-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageFormModal from '../../components/Admin/ImageFormModal.jsx';
import styles from './AdminGallery.module.css';

const API_BASE = '/api/images';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryFilter = searchParams.get('category') || '';

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ admin: 'true' });
      if (categoryFilter) params.set('category', categoryFilter);
      const { data } = await axios.get(`${API_BASE}?${params.toString()}`);
      setImages(data.images || []);
    } catch (err) {
      notifications.show({
        title: 'Fetch Error',
        message: err?.response?.data?.message || 'Could not load images.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleAdd = () => { setSelectedImage(null); openModal(); };
  const handleEdit = (img) => { setSelectedImage(img); openModal(); };

  const handleDelete = async (img) => {
    if (!window.confirm(`Delete "${img.title || 'Untitled'}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_BASE}/${img._id}`);
      notifications.show({
        title: 'Deleted',
        message: `"${img.title || 'Untitled'}" was removed.`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      fetchImages();
    } catch (err) {
      notifications.show({
        title: 'Delete Failed',
        message: err?.response?.data?.message || 'Could not delete image.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const renderStatus = (img) => {
    if (img.isHidden) {
      return (
        <Badge variant="light" color="gray" size="sm" leftSection={<IconEyeOff size={10} />}>
          Hidden
        </Badge>
      );
    }
    if (img.isFeatured) {
      return (
        <Badge variant="light" color="yellow" size="sm" leftSection={<IconStar size={10} />}>
          Featured
        </Badge>
      );
    }
    return <Badge variant="light" color="green" size="sm">Visible</Badge>;
  };

  const rows = images.map((img) => (
    <Table.Tr key={img._id}>
      {/* Thumbnail */}
      <Table.Td>
        <Box className={styles.thumb}>
          {img.imageUrl
            ? <Image src={img.imageUrl} alt={img.title} fit="cover" w={44} h={44} radius="sm" />
            : <Box className={styles.thumbPlaceholder}><IconPhoto size={18} color="#adb5bd" /></Box>
          }
        </Box>
      </Table.Td>

      {/* Title */}
      <Table.Td>
        <Text size="sm" fw={500} c="dark">{img.title || '—'}</Text>
      </Table.Td>

      {/* Category */}
      <Table.Td>
        <Badge variant="dot" color="blue" size="sm" tt="capitalize">
          {img.category}
        </Badge>
      </Table.Td>

      {/* Status */}
      <Table.Td>{renderStatus(img)}</Table.Td>

      {/* Date */}
      <Table.Td>
        <Text size="xs" c="dimmed">
          {new Date(img.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </Text>
      </Table.Td>

      {/* Actions */}
      <Table.Td>
        <Group gap={6} justify="flex-end" wrap="nowrap">
          <Tooltip label="Edit" position="top">
            <ActionIcon
              variant="subtle"
              color="gray"
              size={32}
              onClick={() => handleEdit(img)}
              aria-label={`Edit ${img.title}`}
            >
              <IconPencil size={15} stroke={1.7} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete" position="top">
            <ActionIcon
              variant="subtle"
              color="red"
              size={32}
              onClick={() => handleDelete(img)}
              aria-label={`Delete ${img.title}`}
            >
              <IconTrash size={15} stroke={1.7} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="lg">

      {/* ── Page header ── */}
      <Group justify="space-between" align="flex-start">
        <Box>
          <Title order={3} fw={700} c="dark.8">Gallery Manager</Title>
          <Text size="sm" c="dimmed" mt={4}>
            {images.length} image{images.length !== 1 ? 's' : ''}
            {categoryFilter ? ` in "${categoryFilter}"` : ' total'}
          </Text>
        </Box>
        <Button
          leftSection={<IconPlus size={15} />}
          onClick={handleAdd}
          radius="md"
          color="blue"
        >
          Add Image
        </Button>
      </Group>

      {/* ── Active filter strip ── */}
      {categoryFilter && (
        <Paper withBorder p="sm" radius="md" className={styles.filterBanner}>
          <Group justify="space-between">
            <Group gap={8}>
              <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts="0.05em">Filtered by:</Text>
              <Badge variant="outline" color="blue" size="sm">{categoryFilter}</Badge>
            </Group>
            <Button
              variant="subtle"
              color="gray"
              size="xs"
              onClick={() => navigate('/admin/gallery')}
            >
              Clear filter
            </Button>
          </Group>
        </Paper>
      )}

      {/* ── Table card ── */}
      <Paper shadow="xs" radius="md" withBorder>
        {loading ? (
          <Stack align="center" py={64} gap={12}>
            <Loader size="sm" />
            <Text size="sm" c="dimmed">Loading images…</Text>
          </Stack>
        ) : images.length === 0 ? (
          <Stack align="center" py={64} gap={12}>
            <IconPhoto size={36} color="#adb5bd" stroke={1.2} />
            <Text size="sm" fw={600} c="dark.4">No images found</Text>
            <Text size="xs" c="dimmed">
              {categoryFilter
                ? `No images in the "${categoryFilter}" category.`
                : 'Click "Add Image" to upload the first one.'}
            </Text>
          </Stack>
        ) : (
          <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className={styles.th} w={68}>—</Table.Th>
                <Table.Th className={styles.th}>Title</Table.Th>
                <Table.Th className={styles.th}>Category</Table.Th>
                <Table.Th className={styles.th}>Status</Table.Th>
                <Table.Th className={styles.th}>Uploaded</Table.Th>
                <Table.Th className={styles.th} ta="right">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
      </Paper>

      {/* ── Modal ── */}
      <ImageFormModal
        opened={modalOpened}
        onClose={closeModal}
        image={selectedImage}
        onSuccess={fetchImages}
      />
    </Stack>
  );
}
