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
  Tooltip,
  Paper,
  Title,
  Modal,
  TextInput,
  Divider,
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
      isEditing
        ? form.setValues({ name: category.name || '', slug: category.slug || '' })
        : form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, category]);

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
        notifications.show({ title: 'Updated', message: 'Category updated.', color: 'green', icon: <IconCheck size={16} /> });
      } else {
        await axios.post(API_BASE, {
          name: values.name.trim(),
          slug: values.slug.trim() || undefined,
        });
        notifications.show({ title: 'Created', message: `"${values.name}" created.`, color: 'green', icon: <IconCheck size={16} /> });
      }
      onSuccess();
      onClose();
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err?.response?.data?.message || 'An error occurred.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={600} size="md">
          {isEditing ? 'Edit Category' : 'New Category'}
        </Text>
      }
      radius="md"
      size="sm"
      overlayProps={{ backgroundOpacity: 0.35, blur: 2 }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Category Name"
            placeholder="e.g. Bridal"
            required
            value={form.values.name}
            onChange={handleNameChange}
            error={form.errors.name}
          />
          <TextInput
            label="Slug"
            description="Auto-generated. Edit only if needed."
            placeholder="e.g. bridal"
            {...form.getInputProps('slug')}
          />
          <Divider />
          <Group justify="flex-end" gap="sm">
            <Button variant="default" radius="md" onClick={onClose}>Cancel</Button>
            <Button type="submit" radius="md" color="blue">{isEditing ? 'Save Changes' : 'Create Category'}</Button>
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
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleAdd = () => { setSelected(null); openModal(); };
  const handleEdit = (cat) => { setSelected(cat); openModal(); };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API_BASE}/${cat._id}`);
      notifications.show({
        title: 'Deleted',
        message: `"${cat.name}" removed.`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      fetchCategories();
    } catch (err) {
      notifications.show({
        title: 'Cannot Delete',
        message: err?.response?.data?.message || 'Could not delete category.',
        color: 'red',
        icon: <IconX size={16} />,
        autoClose: 6000,
      });
    }
  };

  const rows = categories.map((cat) => (
    <Table.Tr key={cat._id}>
      {/* Name */}
      <Table.Td>
        <Text size="sm" fw={500} c="dark">{cat.name}</Text>
      </Table.Td>

      {/* Slug */}
      <Table.Td>
        <Text size="xs" ff="monospace" className={styles.slugPill}>{cat.slug}</Text>
      </Table.Td>

      {/* Image count */}
      <Table.Td>
        <Badge
          variant="light"
          color={cat.imageCount > 0 ? 'blue' : 'gray'}
          size="sm"
        >
          {cat.imageCount} {cat.imageCount === 1 ? 'image' : 'images'}
        </Badge>
      </Table.Td>

      {/* Date */}
      <Table.Td>
        <Text size="xs" c="dimmed">
          {new Date(cat.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </Text>
      </Table.Td>

      {/* Actions */}
      <Table.Td>
        <Group gap={6} justify="flex-end" wrap="nowrap">
          <Tooltip label="View images" position="top">
            <ActionIcon
              variant="subtle"
              color="blue"
              size={32}
              onClick={() => navigate(`/admin/gallery?category=${cat.slug}`)}
              aria-label={`View images in ${cat.name}`}
            >
              <IconPhoto size={15} stroke={1.7} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Edit" position="top">
            <ActionIcon
              variant="subtle"
              color="gray"
              size={32}
              onClick={() => handleEdit(cat)}
              aria-label={`Edit ${cat.name}`}
            >
              <IconPencil size={15} stroke={1.7} />
            </ActionIcon>
          </Tooltip>

          <Tooltip
            label={cat.imageCount > 0 ? 'Cannot delete — has images' : 'Delete'}
            position="top"
          >
            <ActionIcon
              variant="subtle"
              color="red"
              size={32}
              onClick={() => handleDelete(cat)}
              disabled={false} /* backend will reject with 400 — surface via notification */
              aria-label={`Delete ${cat.name}`}
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
          <Title order={3} fw={700} c="dark.8">Categories</Title>
          <Text size="sm" c="dimmed" mt={4}>
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} defined
          </Text>
        </Box>
        <Button
          leftSection={<IconPlus size={15} />}
          onClick={handleAdd}
          radius="md"
          color="blue"
        >
          Add Category
        </Button>
      </Group>

      {/* ── Table card ── */}
      <Paper shadow="xs" radius="md" withBorder>
        {loading ? (
          <Stack align="center" py={64} gap={12}>
            <Loader size="sm" />
            <Text size="sm" c="dimmed">Loading categories…</Text>
          </Stack>
        ) : categories.length === 0 ? (
          <Stack align="center" py={64} gap={12}>
            <IconTag size={36} color="#adb5bd" stroke={1.2} />
            <Text size="sm" fw={600} c="dark.4">No categories yet</Text>
            <Text size="xs" c="dimmed">Click "Add Category" to create the first one.</Text>
          </Stack>
        ) : (
          <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className={styles.th}>Category Name</Table.Th>
                <Table.Th className={styles.th}>Slug</Table.Th>
                <Table.Th className={styles.th}>Images</Table.Th>
                <Table.Th className={styles.th}>Created</Table.Th>
                <Table.Th className={styles.th} ta="right">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
      </Paper>

      <CategoryFormModal
        opened={modalOpened}
        onClose={closeModal}
        category={selected}
        onSuccess={fetchCategories}
      />
    </Stack>
  );
}
