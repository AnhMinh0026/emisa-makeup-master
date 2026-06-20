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
  Select,
  Pagination,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
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
const CATEGORIES_API = '/api/categories';

/**
 * Admin page for managing the global image gallery.
 * Includes advanced filtering by category and date range, as well as image CRUD operations.
 *
 * @returns {JSX.Element} The admin gallery page.
 */
export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Maintain state for current active filters.
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || '');
  const [filterDateRange, setFilterDateRange] = useState([null, null]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Retrieve categories from the backend to populate the filter dropdown.
  useEffect(() => {
    axios
      .get(CATEGORIES_API)
      .then(({ data }) => {
        setCategoryOptions(
          (data.categories || []).map((cat) => ({ value: cat.slug, label: cat.name }))
        );
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ admin: 'true', page, limit: 12 });
      
      if (filterCategory) {
        params.set('category', filterCategory);
      }
      
      if (filterDateRange[0] && filterDateRange[1]) {
        params.set('startDate', filterDateRange[0].toISOString());
        params.set('endDate', filterDateRange[1].toISOString());
      }
      
      const { data } = await axios.get(`${API_BASE}?${params.toString()}`);
      setImages(data.images || []);
      setTotalPages(data.pagination?.totalPages || 1);
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
  }, [filterCategory, filterDateRange, page]);

  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1);
  }, [filterCategory, filterDateRange]);

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

  const handleClearFilters = () => {
    setFilterCategory('');
    setFilterDateRange([null, null]);
    if (searchParams.get('category')) {
      navigate('/admin/gallery'); // Remove query parameters from the URL if applicable.
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
      <Table.Td>
        <Box className={styles.thumb}>
          {img.imageUrl
            ? <Image src={img.imageUrl} alt={img.title} fit="cover" w={44} h={44} radius="sm" />
            : <Box className={styles.thumbPlaceholder}><IconPhoto size={18} color="#adb5bd" /></Box>
          }
        </Box>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={500} c="dark">{img.title || '—'}</Text>
      </Table.Td>
      <Table.Td>
        <Badge variant="dot" color="blue" size="sm" tt="capitalize">
          {img.category}
        </Badge>
      </Table.Td>
      <Table.Td>{renderStatus(img)}</Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed">
          {new Date(img.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </Text>
      </Table.Td>
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

  const isFiltering = filterCategory !== '' || (filterDateRange[0] !== null && filterDateRange[1] !== null);

  return (
    <Stack gap="lg">

      {/* --- Page Header --- */}
      <Group justify="space-between" align="flex-start">
        <Box>
          <Title order={3} fw={700} c="dark.8">Gallery Manager</Title>
          <Text size="sm" c="dimmed" mt={4}>
            {images.length} image{images.length !== 1 ? 's' : ''} found
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

      {/* --- Table Card with Filter Bar --- */}
      <Paper shadow="xs" radius="md" withBorder>
        
        {/* --- Filter Bar --- */}
        <Box p="md" style={{ borderBottom: '1px solid #f1f3f5' }}>
          <Group align="flex-end" gap="sm">
            <Select
              label="Category"
              placeholder="All Categories"
              data={categoryOptions}
              value={filterCategory}
              onChange={(val) => setFilterCategory(val || '')}
              clearable
              radius="md"
              style={{ minWidth: 200 }}
            />
            
            <DatePickerInput
              type="range"
              label="Date Range"
              placeholder="Pick dates"
              value={filterDateRange}
              onChange={setFilterDateRange}
              clearable
              radius="md"
              style={{ minWidth: 250 }}
            />
            
            {isFiltering && (
              <Button 
                variant="light" 
                color="gray" 
                radius="md" 
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </Group>
        </Box>

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
              {isFiltering
                ? 'Try adjusting your filters.'
                : 'Click "Add Image" to upload the first one.'}
            </Text>
          </Stack>
        ) : (
          <>
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
            
            {totalPages > 1 && (
              <Group justify="center" py="md" style={{ borderTop: '1px solid #f1f3f5' }}>
                <Pagination 
                  total={totalPages} 
                  value={page} 
                  onChange={setPage} 
                  color="blue" 
                  radius="md" 
                />
              </Group>
            )}
          </>
        )}
      </Paper>

      {/* --- Modal --- */}
      <ImageFormModal
        opened={modalOpened}
        onClose={closeModal}
        image={selectedImage}
        onSuccess={fetchImages}
      />
    </Stack>
  );
}
