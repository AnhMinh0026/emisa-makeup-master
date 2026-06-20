import { useEffect, useState } from 'react';
import {
  Modal,
  TextInput,
  Select,
  FileInput,
  Switch,
  Button,
  Group,
  Stack,
  Text,
  Divider,
  Loader,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUpload, IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react';
import axios from 'axios';

const API_BASE = '/api/images';
const CATEGORIES_API = '/api/categories';

/**
 * Modal component for creating or editing an image entry in the admin gallery.
 * Handles form validation, file uploads, and metadata updates via the backend API.
 *
 * @param {Object} props - The component properties.
 * @param {boolean} props.opened - Controls the visibility of the modal.
 * @param {Function} props.onClose - Callback invoked to close the modal.
 * @param {Object|null} props.image - The image object to edit, or null for creating a new entry.
 * @param {Function} props.onSuccess - Callback invoked upon successful submission.
 * @returns {JSX.Element} The image form modal component.
 */
export default function ImageFormModal({ opened, onClose, image, onSuccess }) {
  const isEditing = Boolean(image);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);

  // Retrieve dynamic categories upon modal initialization.
  useEffect(() => {
    if (!opened) return;
    setLoadingCats(true);
    axios
      .get(CATEGORIES_API)
      .then(({ data }) => {
        setCategoryOptions(
          (data.categories || []).map((cat) => ({ value: cat.slug, label: cat.name }))
        );
      })
      .catch(() => {
        notifications.show({
          title: 'Warning',
          message: 'Could not load categories.',
          color: 'orange',
        });
      })
      .finally(() => setLoadingCats(false));
  }, [opened]);

  const form = useForm({
    initialValues: {
      title: '',
      category: '',
      isFeatured: false,
      isHidden: false,
      image: null,
    },
    validate: {
      category: (v) => (!v ? 'Please select a category' : null),
      image: (v) => (!isEditing && !v ? 'Please select an image file' : null),
    },
  });

  useEffect(() => {
    if (opened) {
      isEditing
        ? form.setValues({
            title: image.title || '',
            category: image.category || '',
            isFeatured: image.isFeatured ?? false,
            isHidden: image.isHidden ?? false,
            image: null,
          })
        : form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, image]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title || 'Untitled');
    formData.append('category', values.category);
    formData.append('isFeatured', String(values.isFeatured));
    formData.append('isHidden', String(values.isHidden));
    if (values.image) formData.append('image', values.image);

    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/${image._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        notifications.show({ title: 'Updated', message: 'Image updated.', color: 'green', icon: <IconCheck size={16} /> });
      } else {
        await axios.post(API_BASE, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        notifications.show({ title: 'Uploaded', message: 'Image added to gallery.', color: 'green', icon: <IconCheck size={16} /> });
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
          {isEditing ? 'Edit Image' : 'Add New Image'}
        </Text>
      }
      radius="md"
      size="md"
      overlayProps={{ backgroundOpacity: 0.35, blur: 2 }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">

          {/* --- Image Upload --- */}
          <Stack gap={4}>
            <FileInput
              label={isEditing ? 'Replace Image' : 'Image File'}
              description={isEditing ? 'Leave blank to keep the current image.' : 'JPEG, PNG, WebP, or HEIC · Max 20 MB'}
              placeholder="Click to select a file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              leftSection={<IconUpload size={14} />}
              clearable
              required={!isEditing}
              {...form.getInputProps('image')}
            />
          </Stack>

          <Divider />

          {/* --- Title Input --- */}
          <TextInput
            label="Title"
            placeholder="Untitled"
            {...form.getInputProps('title')}
          />

          {/* --- Category Selection --- */}
          {loadingCats ? (
            <Group gap={8}>
              <Loader size="xs" />
              <Text size="sm" c="dimmed">Loading categories…</Text>
            </Group>
          ) : categoryOptions.length === 0 ? (
            <Alert icon={<IconAlertCircle size={16} />} color="orange" radius="md">
              No categories found. Create a category first.
            </Alert>
          ) : (
            <Select
              label="Category"
              placeholder="Select a category"
              data={categoryOptions}
              required
              {...form.getInputProps('category')}
            />
          )}

          <Divider />

          {/* --- Feature & Visibility Toggles --- */}
          <Group justify="space-between">
            <Stack gap={2}>
              <Text size="sm" fw={500}>Featured</Text>
              <Text size="xs" c="dimmed">Display on the homepage</Text>
            </Stack>
            <Switch
              checked={form.values.isFeatured}
              onChange={(e) => form.setFieldValue('isFeatured', e.currentTarget.checked)}
              color="blue"
            />
          </Group>

          <Group justify="space-between">
            <Stack gap={2}>
              <Text size="sm" fw={500}>Hidden</Text>
              <Text size="xs" c="dimmed">Hide from the public gallery</Text>
            </Stack>
            <Switch
              checked={form.values.isHidden}
              onChange={(e) => form.setFieldValue('isHidden', e.currentTarget.checked)}
              color="orange"
            />
          </Group>

          <Divider />

          {/* --- Action Buttons --- */}
          <Group justify="flex-end" gap="sm">
            <Button variant="default" radius="md" onClick={onClose}>Cancel</Button>
            <Button type="submit" radius="md" color="blue">
              {isEditing ? 'Save Changes' : 'Upload Image'}
            </Button>
          </Group>

        </Stack>
      </form>
    </Modal>
  );
}
