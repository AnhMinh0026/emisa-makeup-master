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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUpload, IconCheck, IconX } from '@tabler/icons-react';
import axios from 'axios';
import styles from './ImageFormModal.module.css';

const API_BASE = '/api/images';
const CATEGORIES_API = '/api/categories';

export default function ImageFormModal({ opened, onClose, image, onSuccess }) {
  const isEditing = Boolean(image);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);

  // Fetch categories from the API whenever the modal opens
  useEffect(() => {
    if (!opened) return;
    setLoadingCats(true);
    axios
      .get(CATEGORIES_API)
      .then(({ data }) => {
        const opts = (data.categories || []).map((cat) => ({
          value: cat.slug,
          label: cat.name,
        }));
        setCategoryOptions(opts);
      })
      .catch(() => {
        notifications.show({
          title: 'Warning',
          message: 'Could not load categories. Check the API.',
          color: 'red',
          radius: 0,
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
      category: (v) => (!v ? 'Category is required' : null),
      image: (v) => (!isEditing && !v ? 'Please select an image file' : null),
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (opened) {
      if (isEditing) {
        form.setValues({
          title: image.title || '',
          category: image.category || '',
          isFeatured: image.isFeatured ?? false,
          isHidden: image.isHidden ?? false,
          image: null,
        });
      } else {
        form.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, image]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title || 'Untitled');
    formData.append('category', values.category);
    formData.append('isFeatured', String(values.isFeatured));
    formData.append('isHidden', String(values.isHidden));
    if (values.image) {
      formData.append('image', values.image);
    }

    try {
      if (isEditing) {
        await axios.put(`${API_BASE}/${image._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        notifications.show({
          title: 'Updated',
          message: 'Image updated successfully.',
          color: 'dark',
          icon: <IconCheck size={16} />,
          radius: 0,
        });
      } else {
        await axios.post(API_BASE, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        notifications.show({
          title: 'Uploaded',
          message: 'New image added to gallery.',
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
          {isEditing ? 'EDIT IMAGE' : 'ADD NEW IMAGE'}
        </Text>
      }
      radius={0}
      size="md"
      overlayProps={{ backgroundOpacity: 0.4, blur: 0 }}
      classNames={{
        header: styles.modalHeader,
        body: styles.modalBody,
        content: styles.modalContent,
        overlay: styles.modalOverlay,
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap={20}>

          {/* Image file input */}
          <div>
            <Text className={styles.fieldLabel}>
              IMAGE FILE {!isEditing && <span className={styles.required}>*</span>}
            </Text>
            {isEditing && (
              <Text className={styles.fieldHint}>Leave blank to keep the current image.</Text>
            )}
            <FileInput
              placeholder="Select image (JPEG, PNG, WebP, HEIC)"
              accept="image/jpeg,image/png,image/webp,image/heic"
              leftSection={<IconUpload size={14} />}
              clearable
              radius={0}
              classNames={{ input: styles.input }}
              {...form.getInputProps('image')}
            />
            {form.errors.image && (
              <Text className={styles.errorText}>{form.errors.image}</Text>
            )}
          </div>

          <Divider color="#e2e2e2" />

          {/* Title */}
          <div>
            <Text className={styles.fieldLabel}>TITLE</Text>
            <TextInput
              placeholder="Untitled"
              radius={0}
              classNames={{ input: styles.input }}
              {...form.getInputProps('title')}
            />
          </div>

          {/* Category — fetched dynamically */}
          <div>
            <Text className={styles.fieldLabel}>
              CATEGORY <span className={styles.required}>*</span>
            </Text>
            {loadingCats ? (
              <Group gap={8} mt={6}>
                <Loader size="xs" color="dark" />
                <Text className={styles.fieldHint}>Loading categories…</Text>
              </Group>
            ) : (
              <Select
                placeholder={
                  categoryOptions.length === 0
                    ? 'No categories — create one first'
                    : 'Select category'
                }
                data={categoryOptions}
                disabled={categoryOptions.length === 0}
                radius={0}
                classNames={{ input: styles.input }}
                {...form.getInputProps('category')}
              />
            )}
            {form.errors.category && (
              <Text className={styles.errorText}>{form.errors.category}</Text>
            )}
          </div>

          <Divider color="#e2e2e2" />

          {/* Toggles */}
          <Group justify="space-between">
            <div>
              <Text className={styles.fieldLabel}>FEATURED</Text>
              <Text className={styles.fieldHint}>Show on homepage</Text>
            </div>
            <Switch
              checked={form.values.isFeatured}
              onChange={(e) => form.setFieldValue('isFeatured', e.currentTarget.checked)}
              color="dark"
              radius={0}
              classNames={{ track: styles.switchTrack }}
            />
          </Group>

          <Group justify="space-between">
            <div>
              <Text className={styles.fieldLabel}>HIDDEN</Text>
              <Text className={styles.fieldHint}>Hide from public gallery</Text>
            </div>
            <Switch
              checked={form.values.isHidden}
              onChange={(e) => form.setFieldValue('isHidden', e.currentTarget.checked)}
              color="dark"
              radius={0}
              classNames={{ track: styles.switchTrack }}
            />
          </Group>

          <Divider color="#000" />

          {/* Actions */}
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
              {isEditing ? 'SAVE CHANGES' : 'UPLOAD IMAGE'}
            </Button>
          </Group>

        </Stack>
      </form>
    </Modal>
  );
}
