import { Container, Title, Text, Stack } from '@mantine/core';

export default function CoursePricing() {
  return (
    <Container size="md" py={120}>
      <Stack align="center" gap="xl">
        <Title 
          order={1} 
          tt="uppercase" 
          lts="0.1em" 
          c="black" 
          fw={900}
        >
          BẢNG GIÁ KHÓA HỌC
        </Title>
        <Text 
          c="gray.6" 
          size="sm" 
          tt="uppercase" 
          lts="0.05em"
        >
          Pricing details coming soon...
        </Text>
      </Stack>
    </Container>
  );
}
