import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Group,
  Text,
  Box,
  Badge,
  ActionIcon,
  Loader,
  Stack,
  Divider,
  Tooltip,
  Modal,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconCheck,
  IconX,
  IconTag,
  IconPhoto,
  IconArrowRight,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AdminCategories.module.css';

const API_BASE = '/api/categories';

// ─── Category Form Modal ──────────────────────────────────────────────────────
function CategoryFormModal({ opened, onClose, category, onSuccess }) {
  const isEditing = Boolean(category);

  const form = useForm({
    initialValues: { name: '', slug: '' },
    validate: {
      name: (v) => (!v?.trim() ? 'Name is required' : null),
    },
  });

  useEffect(() => {
    if (opened) {
      if (isEditing) {
        form.setValues({ name: category.name || '', slug: category.slug || '' });
      } else {
        form.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, category]);

  // Auto-generate slug from name while typing (add only)
  const handleNameChange = (e) => {
    const val = e.currentTarget.value;
    form.setFieldValue('name', val);
    if (!isEditing) {
      form.setFieldValue(
        'slug',
        val.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      );
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/${category._id}`, {
          name: values.name.trim(),
          slug: values.slug.trim() || undefined,
        });
        notifications.show({
          title: 'Updated',
          message: 'Category updated successfully.',
          color: 'dark',
          icon: <IconCheck size={16} />,
          radius: 0,
        });
      } else {
        await axios.post(API_BASE, {
          name: values.name.trim(),
          slug: values.slug.trim() || undefined,
        });
        notifications.show({
          title: 'Created',
          message: `Category "${values.name}" created.`,
          color: 'dark',
          icon: <IconCheck size={16} />,
          radius: 0,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'An error occurred.';
      notifications.show({
        title: 'Error',
        message: msg,
        color: 'red',
        icon: <IconX size={16} />,
        radius: 0,
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text className={styles.modalTitle}>
          {isEditing ? 'EDIT CATEGORY' : 'NEW CATEGORY'}
        </Text>
      }
      radius={0}
      size="sm"
      overlayProps={{ backgroundOpacity: 0.4, blur: 0 }}
      classNames={{
        header: styles.modalHeader,
        body: styles.modalBody,
        content: styles.modalContent,
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap={18}>
          <div>
            <Text className={styles.fieldLabel}>CATEGORY NAME <span className={styles.required}>*</span></Text>
            <TextInput
              placeholder="e.g. Bridal"
              radius={0}
              classNames={{ input: styles.input }}
              value={form.values.name}
              onChange={handleNameChange}
              error={form.errors.name}
            />
          </div>

          <div>
            <Text className={styles.fieldLabel}>SLUG</Text>
            <Text className={styles.fieldHint}>Auto-generated. Edit only if needed.</Text>
            <TextInput
              placeholder="e.g. bridal"
              radius={0}
              classNames={{ input: styles.input }}
              {...form.getInputProps('slug')}
            />
          </div>

          <Divider color="#000" />

          <Group justify="flex-end" gap={8}>
            <Button
              variant="outline"
              radius={0}
              color="dark"
              onClick={onClose}
              classNames={{ root: styles.btnOutline }}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              radius={0}
              color="dark"
              classNames={{ root: styles.btnPrimary }}
            >
              {isEditing ? 'SAVE CHANGES' : 'CREATE CATEGORY'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_BASE);
      setCategories(data.categories || []);
    } catch (err) {
      notifications.show({
        title: 'Fetch Error',
        message: err?.response?.data?.message || 'Could not load categories.',
        color: 'red',
        icon: <IconX size={16} />,
        radius: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = () => {
    setSelected(null);
    openModal();
  };

  const handleEdit = (cat) => {
    setSelected(cat);
    openModal();
  };

  const handleDelete = async (cat) => {
    const confirmed = window.confirm(
      `Delete category "${cat.name}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE}/${cat._id}`);
      notifications.show({
        title: 'Deleted',
        message: `Category "${cat.name}" removed.`,
        color: 'dark',
        icon: <IconCheck size={16} />,
        radius: 0,
      });
      fetchCategories();
    } catch (err) {
      // Gracefully surface 400 "images attached" error
      const msg = err?.response?.data?.message || 'Could not delete category.';
      notifications.show({
        title: 'Cannot Delete',
        message: msg,
        color: 'red',
        icon: <IconX size={16} />,
        radius: 0,
        autoClose: 6000,
      });
    }
  };

  const rows = categories.map((cat) => (
    <Table.Tr key={cat._id} className={styles.tableRow}>
      {/* Name */}
      <Table.Td className={styles.tdName}>
        <Text className={styles.nameText}>{cat.name}</Text>
      </Table.Td>

      {/* Slug */}
      <Table.Td className={styles.tdSlug}>
        <Text className={styles.slugText}>{cat.slug}</Text>
      </Table.Td>

      {/* Image count */}
      <Table.Td className={styles.tdCount}>
        <Badge
          radius={0}
          variant={cat.imageCount > 0 ? 'filled' : 'outline'}
          color="dark"
          classNames={{ root: cat.imageCount > 0 ? styles.badgeFilled : styles.badgeEmpty }}
        >
          {cat.imageCount} {cat.imageCount === 1 ? 'IMAGE' : 'IMAGES'}
        </Badge>
      </Table.Td>

      {/* Date */}
      <Table.Td className={styles.tdDate}>
        <Text className={styles.dateText}>
          {new Date(cat.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </Text>
      </Table.Td>

      {/* Actions */}
      <Table.Td className={styles.tdActions}>
        <Group gap={4} wrap="nowrap" justify="flex-end">
          <Tooltip label="View Images" position="top" withArrow={false} radius={0}>
            <ActionIcon
              variant="outline"
              color="dark"
              radius={0}
              size={32}
              onClick={() => navigate(`/admin/gallery?category=${cat.slug}`)}
              classNames={{ root: styles.actionView }}
              aria-label={`View images in ${cat.name}`}
            >
              <IconPhoto size={14} stroke={1.5} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Edit" position="top" withArrow={false} radius={0}>
            <ActionIcon
              variant="outline"
              color="dark"
              radius={0}
              size={32}
              onClick={() => handleEdit(cat)}
              classNames={{ root: styles.actionEdit }}
              aria-label={`Edit ${cat.name}`}
            >
              <IconPencil size={14} stroke={1.5} />
            </ActionIcon>
          </Tooltip>

          <Tooltip
            label={cat.imageCount > 0 ? 'Has images — cannot delete' : 'Delete'}
            position="top"
            withArrow={false}
            radius={0}
          >
            <ActionIcon
              variant="filled"
              color="dark"
              radius={0}
              size={32}
              onClick={() => handleDelete(cat)}
              classNames={{ root: cat.imageCount > 0 ? styles.actionDeleteDisabled : styles.actionDelete }}
              aria-label={`Delete ${cat.name}`}
            >
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
          <Text className={styles.pageTitle}>CATEGORIES</Text>
          <Text className={styles.pageSubtitle}>
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} defined
          </Text>
        </Box>
        <Button
          radius={0}
          color="dark"
          leftSection={<IconPlus size={14} />}
          onClick={handleAdd}
          classNames={{ root: styles.addBtn }}
        >
          ADD CATEGORY
        </Button>
      </Box>

      <Divider color="#000" />

      {/* ── Table ── */}
      <Box className={styles.tableWrapper}>
        {loading ? (
          <Stack align="center" py={80} gap={16}>
            <Loader color="dark" size="sm" />
            <Text className={styles.loadingText}>LOADING CATEGORIES...</Text>
          </Stack>
        ) : categories.length === 0 ? (
          <Stack align="center" py={80} gap={16}>
            <IconTag size={40} color="#b0b0b0" stroke={1} />
            <Text className={styles.emptyText}>NO CATEGORIES DEFINED</Text>
            <Text className={styles.emptyHint}>
              Click "Add Category" to create the first one.
            </Text>
          </Stack>
        ) : (
          <Table
            striped={false}
            highlightOnHover={false}
            withTableBorder={false}
            withColumnBorders={false}
            classNames={{ table: styles.table, thead: styles.thead, tbody: styles.tbody }}
          >
            <Table.Thead>
              <Table.Tr className={styles.theadRow}>
                <Table.Th className={styles.th}>CATEGORY NAME</Table.Th>
                <Table.Th className={styles.th}>SLUG</Table.Th>
                <Table.Th className={styles.th}>IMAGES</Table.Th>
                <Table.Th className={styles.th}>CREATED</Table.Th>
                <Table.Th className={`${styles.th} ${styles.thRight}`}>ACTIONS</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
      </Box>

      <CategoryFormModal
        opened={modalOpened}
        onClose={closeModal}
        category={selected}
        onSuccess={fetchCategories}
      />
    </Box>
  );
}
