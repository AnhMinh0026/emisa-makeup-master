import { useState, useEffect, useCallback } from 'react';
import {
  Stack,
  Group,
  Text,
  Box,
  Title,
  Paper,
  Table,
  Button,
  Badge,
  ActionIcon,
  Tooltip,
  Loader,
  Modal,
  TextInput,
  Textarea,
  Switch,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconCheck,
  IconX,
  IconCurrencyDong,
  IconEyeOff,
  IconEye,
} from '@tabler/icons-react';
import { serviceApi } from '../../features/services';

/**
 * Admin page for managing pricing packages and services.
 * Features CRUD operations and toggle visibility for individual packages.
 *
 * @returns {JSX.Element} The admin services page.
 */
export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: '',
      price: '',
      description: '',
      category: 'makeup',
      isHidden: false,
    },
    validate: {
      name: (v) => v.trim().length === 0 ? 'Tên gói dịch vụ là bắt buộc.' : null,
      price: (v) => v.trim().length === 0 ? 'Giá là bắt buộc.' : null,
    },
  });

  /* --- Fetch All Services (Admin Mode) --- */
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await serviceApi.getAll({ admin: 'true' });
      setServices(data.services || []);
    } catch (err) {
      notifications.show({
        title: 'Lỗi tải dữ liệu',
        message: err?.response?.data?.message || 'Không thể tải danh sách gói dịch vụ.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  /* --- Open Modal for Add --- */
  const handleAdd = () => {
    setSelectedService(null);
    form.reset();
    openModal();
  };

  /* --- Open Modal for Edit --- */
  const handleEdit = (svc) => {
    setSelectedService(svc);
    form.setValues({
      name: svc.name,
      price: svc.price,
      description: svc.description || '',
      category: svc.category,
      isHidden: svc.isHidden,
    });
    openModal();
  };

  /* --- Submit (Create or Update) --- */
  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      if (selectedService) {
        await serviceApi.update(selectedService._id, values);
        notifications.show({
          title: 'Đã cập nhật',
          message: `"${values.name}" đã được cập nhật.`,
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      } else {
        await serviceApi.create(values);
        notifications.show({
          title: 'Đã tạo',
          message: `"${values.name}" đã được thêm vào danh sách.`,
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      }
      closeModal();
      fetchServices();
    } catch (err) {
      notifications.show({
        title: 'Lưu thất bại',
        message: err?.response?.data?.message || 'Không thể lưu gói dịch vụ.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setSaving(false);
    }
  };

  /* --- Toggle Visibility Inline --- */
  const handleToggleHidden = async (svc) => {
    try {
      await serviceApi.update(svc._id, { isHidden: !svc.isHidden });
      notifications.show({
        title: svc.isHidden ? 'Đã hiện' : 'Đã ẩn',
        message: `"${svc.name}" ${svc.isHidden ? 'đã được hiện trên trang.' : 'đã bị ẩn khỏi trang.'}`,
        color: 'blue',
        icon: <IconCheck size={16} />,
      });
      fetchServices();
    } catch (err) {
      notifications.show({
        title: 'Lỗi',
        message: err?.response?.data?.message || 'Không thể thay đổi trạng thái.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  /* --- Delete --- */
  const handleDelete = async (svc) => {
    if (!window.confirm(`Xóa gói "${svc.name}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await serviceApi.delete(svc._id);
      notifications.show({
        title: 'Đã xóa',
        message: `"${svc.name}" đã bị xóa.`,
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      fetchServices();
    } catch (err) {
      notifications.show({
        title: 'Xóa thất bại',
        message: err?.response?.data?.message || 'Không thể xóa gói dịch vụ.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  /* --- Table Rows --- */
  const rows = services.map((svc) => (
    <Table.Tr key={svc._id} style={{ opacity: svc.isHidden ? 0.55 : 1 }}>
      <Table.Td>
        <Text size="sm" fw={600} c="dark">{svc.name}</Text>
      </Table.Td>

      <Table.Td>
        <Text size="sm" fw={500} c="dark.6">{svc.price}</Text>
      </Table.Td>
      <Table.Td>
        {svc.isHidden ? (
          <Badge variant="light" color="gray" size="sm" leftSection={<IconEyeOff size={10} />}>
            Ẩn
          </Badge>
        ) : (
          <Badge variant="light" color="green" size="sm" leftSection={<IconEye size={10} />}>
            Hiển thị
          </Badge>
        )}
      </Table.Td>
      <Table.Td>
        <Group gap={6} justify="flex-end" wrap="nowrap">
          <Tooltip label={svc.isHidden ? 'Hiện' : 'Ẩn'} position="top">
            <ActionIcon
              variant="subtle"
              color="blue"
              size={32}
              onClick={() => handleToggleHidden(svc)}
              aria-label={`Toggle visibility of ${svc.name}`}
            >
              {svc.isHidden ? <IconEye size={15} stroke={1.7} /> : <IconEyeOff size={15} stroke={1.7} />}
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Chỉnh sửa" position="top">
            <ActionIcon
              variant="subtle"
              color="gray"
              size={32}
              onClick={() => handleEdit(svc)}
              aria-label={`Edit ${svc.name}`}
            >
              <IconPencil size={15} stroke={1.7} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Xóa" position="top">
            <ActionIcon
              variant="subtle"
              color="red"
              size={32}
              onClick={() => handleDelete(svc)}
              aria-label={`Delete ${svc.name}`}
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

      {/* --- Page Header --- */}
      <Group justify="space-between" align="flex-start">
        <Box>
          <Title order={3} fw={700} c="dark.8">Pricing Packages</Title>
          <Text size="sm" c="dimmed" mt={4}>
            {services.length} gói dịch vụ · bao gồm gói đang ẩn
          </Text>
        </Box>
        <Button
          leftSection={<IconPlus size={15} />}
          onClick={handleAdd}
          radius="md"
          color="blue"
        >
          Thêm gói mới
        </Button>
      </Group>

      {/* --- Table Card --- */}
      <Paper shadow="xs" radius="md" withBorder>
        {loading ? (
          <Stack align="center" py={64} gap={12}>
            <Loader size="sm" />
            <Text size="sm" c="dimmed">Đang tải danh sách…</Text>
          </Stack>
        ) : services.length === 0 ? (
          <Stack align="center" py={64} gap={12}>
            <IconCurrencyDong size={36} color="#adb5bd" stroke={1.2} />
            <Text size="sm" fw={600} c="dark.4">Chưa có gói dịch vụ nào</Text>
            <Text size="xs" c="dimmed">Nhấn "Thêm gói mới" để bắt đầu.</Text>
          </Stack>
        ) : (
          <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Tên gói</Table.Th>

                <Table.Th>Giá</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
                <Table.Th ta="right">Thao tác</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        )}
      </Paper>

      {/* --- Add / Edit Modal --- */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={
          <Text fw={700} size="md">
            {selectedService ? 'Chỉnh sửa gói dịch vụ' : 'Thêm gói dịch vụ mới'}
          </Text>
        }
        radius="md"
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              id="service-name"
              label="Tên gói dịch vụ"
              placeholder="VD: Makeup cô dâu"
              radius="md"
              withAsterisk
              {...form.getInputProps('name')}
            />
            <TextInput
              id="service-price"
              label="Giá"
              placeholder="VD: Từ 1.500.000đ hoặc Liên hệ"
              radius="md"
              withAsterisk
              {...form.getInputProps('price')}
            />

            <Textarea
              id="service-description"
              label="Mô tả"
              placeholder="Mô tả ngắn về gói dịch vụ (không bắt buộc)"
              radius="md"
              autosize
              minRows={3}
              maxRows={6}
              {...form.getInputProps('description')}
            />
            <Switch
              id="service-hidden"
              label="Ẩn gói dịch vụ này khỏi trang công khai"
              size="sm"
              {...form.getInputProps('isHidden', { type: 'checkbox' })}
            />
            <Group justify="flex-end" pt={4}>
              <Button variant="default" radius="md" onClick={closeModal}>
                Hủy
              </Button>
              <Button
                type="submit"
                radius="md"
                color="blue"
                loading={saving}
                leftSection={<IconCheck size={15} />}
              >
                {selectedService ? 'Lưu thay đổi' : 'Tạo gói'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

    </Stack>
  );
}
