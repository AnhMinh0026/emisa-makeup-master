import { useState, useEffect } from 'react';
import {
  Stack,
  Group,
  Text,
  Box,
  Title,
  Paper,
  TextInput,
  Textarea,
  Button,
  Loader,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconX,
  IconAddressBook,
} from '@tabler/icons-react';
import axios from 'axios';

const API_URL = '/api/contact';

/**
 * Admin page for managing public contact information.
 * Allows updating phone, social links, address, and Google Maps embed code.
 *
 * @returns {JSX.Element} The admin contact settings page.
 */
export default function AdminContact() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    initialValues: {
      phone: '',
      facebook: '',
      instagram: '',
      address: '',
      mapEmbedCode: '',
    },
  });

  /* --- Fetch Current Contact Data on Mount --- */
  useEffect(() => {
    axios
      .get(API_URL)
      .then(({ data }) => {
        form.setValues({
          phone: data.phone || '',
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          address: data.address || '',
          mapEmbedCode: data.mapEmbedCode || '',
        });
      })
      .catch((err) => {
        notifications.show({
          title: 'Load Error',
          message: err?.response?.data?.message || 'Could not load contact data.',
          color: 'red',
          icon: <IconX size={16} />,
        });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --- Submit Handler --- */
  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      await axios.put(API_URL, values);
      notifications.show({
        title: 'Saved',
        message: 'Contact information updated successfully.',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (err) {
      notifications.show({
        title: 'Save Failed',
        message: err?.response?.data?.message || 'Could not save contact data.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack gap="lg">

      {/* --- Page Header --- */}
      <Group justify="space-between" align="flex-start">
        <Box>
          <Title order={3} fw={700} c="dark.8">Contact Settings</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Manage the studio's public contact information and map embed.
          </Text>
        </Box>
      </Group>

      {/* --- Form Card --- */}
      <Paper shadow="xs" radius="md" withBorder p="xl">

        {loading ? (
          <Stack align="center" py={64} gap={12}>
            <Loader size="sm" />
            <Text size="sm" c="dimmed">Loading contact data…</Text>
          </Stack>
        ) : (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">

              {/* --- Section Label --- */}
              <Group gap={8} align="center">
                <IconAddressBook size={16} stroke={1.8} color="#868e96" />
                <Text size="sm" fw={600} c="dark.5" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
                  Studio Contact Details
                </Text>
              </Group>

              {/* --- Phone / Zalo --- */}
              <TextInput
                id="contact-phone"
                label="Phone / Zalo"
                placeholder="e.g. 0901 234 567"
                radius="md"
                {...form.getInputProps('phone')}
              />

              {/* --- Facebook --- */}
              <TextInput
                id="contact-facebook"
                label="Facebook Link"
                placeholder="https://facebook.com/emisa.studio"
                radius="md"
                {...form.getInputProps('facebook')}
              />

              {/* --- Instagram --- */}
              <TextInput
                id="contact-instagram"
                label="Instagram Link"
                placeholder="https://instagram.com/emisa.studio"
                radius="md"
                {...form.getInputProps('instagram')}
              />

              {/* --- Address --- */}
              <TextInput
                id="contact-address"
                label="Address"
                placeholder="123 Đường ABC, Quận 1, TP.HCM"
                radius="md"
                {...form.getInputProps('address')}
              />

              {/* --- Divider Label --- */}
              <Box pt={4}>
                <Text size="sm" fw={600} c="dark.5" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
                  Google Maps Embed Code
                </Text>
                <Text size="xs" c="dimmed" mt={2}>
                  Paste the full &lt;iframe&gt; embed code from Google Maps.
                </Text>
              </Box>

              {/* --- Map Embed Code --- */}
              <Textarea
                id="contact-map-embed"
                placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                radius="md"
                autosize
                minRows={4}
                maxRows={10}
                styles={{ input: { fontFamily: 'monospace', fontSize: '12px' } }}
                {...form.getInputProps('mapEmbedCode')}
              />

              {/* --- Save Button --- */}
              <Group justify="flex-end" pt={8}>
                <Button
                  type="submit"
                  radius="md"
                  color="blue"
                  loading={saving}
                  leftSection={<IconCheck size={15} />}
                >
                  Save Changes
                </Button>
              </Group>

            </Stack>
          </form>
        )}

      </Paper>
    </Stack>
  );
}
