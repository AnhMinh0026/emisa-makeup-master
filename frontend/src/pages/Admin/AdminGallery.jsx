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
  Divider,
  Tooltip,
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
  IconFilterOff,
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

  // ── Fetch images — respects category filter from URL ───────────────────────
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
        radius: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [categoryFilter]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleAdd = () => { setSelectedImage(null); openModal(); };
  const handleEdit = (img) => { setSelectedImage(img); openModal(); };

  const handleDelete = async (img) => {
    const confirmed = window.confirm(
      `Delete "${img.title || 'Untitled'}"?\n\nThis will permanently remove the image from Cloudinary and the database.`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/${img._id}`);
      notifications.show({
        title: 'Deleted',
        message: `"${img.title || 'Untitled'}" was removed.`,
        color: 'dark',
        icon: <IconCheck size={16} />,
        radius: 0,
      });
      fetchImages();
    } catch (err) {
      notifications.show({
        title: 'Delete Failed',
        message: err?.response?.data?.message || 'Could not delete image.',
        color: 'red',
        icon: <IconX size={16} />,
        radius: 0,
      });
    }
  };

  const renderStatus = (img) => {
    if (img.isHidden) {
      return (
        <Badge radius={0} variant="outline" color="gray"
          leftSection={<IconEyeOff size={10} />}
          classNames={{ root: styles.badgeHidden }}>
          HIDDEN
        </Badge>
      );
    }
    if (img.isFeatured) {
      return (
        <Badge radius={0} variant="filled" color="dark"
          leftSection={<IconStar size={10} />}
          classNames={{ root: styles.badgeFeatured }}>
          FEATURED
        </Badge>
      );
    }
    return (
      <Badge radius={0} variant="outline" color="dark"
        classNames={{ root: styles.badgeVisible }}>
        VISIBLE
      </Badge>
    );
  };

  const rows = images.map((img) => (
    <Table.Tr key={img._id} className={styles.tableRow}>
      <Table.Td className={styles.tdThumb}>
        <Box className={styles.thumb}>
          {img.imageUrl ? (
            <Image src={img.imageUrl} alt={img.title} fit="cover" w={48} h={48} radius={0} />
          ) : (
            <Box className={styles.thumbPlaceholder}>
              <IconPhoto size={20} color="#b0b0b0" />
            </Box>
          )}
        </Box>
      </Table.Td>

      <Table.Td className={styles.tdTitle}>
        <Text className={styles.titleText}>{img.title || '—'}</Text>
      </Table.Td>

      <Table.Td className={styles.tdCategory}>
        <Text className={styles.categoryText}>{img.category?.toUpperCase()}</Text>
      </Table.Td>

      <Table.Td className={styles.tdStatus}>{renderStatus(img)}</Table.Td>

      <Table.Td className={styles.tdDate}>
        <Text className={styles.dateText}>
          {new Date(img.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </Text>
      </Table.Td>

      <Table.Td className={styles.tdActions}>
        <Group gap={4} wrap="nowrap" justify="flex-end">
          <Tooltip label="Edit" position="top" withArrow={false} radius={0}>
            <ActionIcon variant="outline" color="dark" radius={0} size={32}
              onClick={() => handleEdit(img)}
              classNames={{ root: styles.actionEdit }}
              aria-label={`Edit ${img.title}`}>
              <IconPencil size={14} stroke={1.5} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Delete" position="top" withArrow={false} radius={0}>
            <ActionIcon variant="filled" color="dark" radius={0} size={32}
              onClick={() => handleDelete(img)}
              classNames={{ root: styles.actionDelete }}
              aria-label={`Delete ${img.title}`}>
              <IconTrash size={14} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box className={styles.wrapper}>

      {/* ── Page Header ── */}
      <Box className={styles.pageHeader}>
        <Box>
          <Text className={styles.pageTitle}>GALLERY MANAGER</Text>
          <Text className={styles.pageSubtitle}>
            {images.length} image{images.length !== 1 ? 's' : ''}
            {categoryFilter ? ` in "${categoryFilter}"` : ' in collection'}
          </Text>
        </Box>
        <Button
          radius={0}
          color="dark"
          leftSection={<IconPlus size={14} />}
          onClick={handleAdd}
          classNames={{ root: styles.addBtn }}
        >
          ADD IMAGE
        </Button>
      </Box>

      {/* ── Active Filter Banner ── */}
      {categoryFilter && (
        <Box className={styles.filterBanner}>
          <Group justify="space-between" align="center">
            <Group gap={10}>
              <Text className={styles.filterLabel}>FILTERED BY:</Text>
              <Text className={styles.filterSlug}>{categoryFilter.toUpperCase()}</Text>
            </Group>
            <Button
              variant="outline"
              radius={0}
              size="xs"
              color="dark"
              leftSection={<IconFilterOff size={12} />}
              onClick={() => navigate('/admin/gallery')}
              classNames={{ root: styles.clearFilterBtn }}
            >
              CLEAR FILTER
            </Button>
          </Group>
        </Box>
      )}

      <Divider color="#000" />

      {/* ── Table ── */}
      <Box className={styles.tableWrapper}>
        {loading ? (
          <Stack align="center" py={80} gap={16}>
            <Loader color="dark" size="sm" />
            <Text className={styles.loadingText}>LOADING COLLECTION...</Text>
          </Stack>
        ) : images.length === 0 ? (
          <Stack align="center" py={80} gap={16}>
            <IconPhoto size={40} color="#b0b0b0" stroke={1} />
            <Text className={styles.emptyText}>NO IMAGES FOUND</Text>
            <Text className={styles.emptyHint}>
              {categoryFilter
                ? `No images in the "${categoryFilter}" category.`
                : 'Click "Add Image" to upload the first one.'}
            </Text>
          </Stack>
        ) : (
          <Table striped={false} highlightOnHover={false}
            withTableBorder={false} withColumnBorders={false}
            classNames={{ table: styles.table, thead: styles.thead, tbody: styles.tbody }}>
            <Table.Thead>
              <Table.Tr className={styles.theadRow}>
                <Table.Th className={styles.th}>—</Table.Th>
                <Table.Th className={styles.th}>TITLE</Table.Th>
                <Table.Th className={styles.th}>CATEGORY</Table.Th>
                <Table.Th className={styles.th}>STATUS</Table.Th>
                <Table.Th className={styles.th}>UPLOADED</Table.Th>
                <Table.Th className={`${styles.th} ${styles.thRight}`}>ACTIONS</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
      </Box>

      <ImageFormModal
        opened={modalOpened}
        onClose={closeModal}
        image={selectedImage}
        onSuccess={fetchImages}
      />
    </Box>
  );
}
