import { Container, Title, Text, SimpleGrid, Box, Stack, List } from '@mantine/core';
import { IconRosetteDiscountCheck } from '@tabler/icons-react';
import pricingImage from '../../assets/Pricing/EmisaPrice.jpg';

export default function MakeupPricing() {
  return (
    <Container size="xl" py={{ base: 60, md: 120 }}>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 40, md: 80 }} align="center">

        {/* Left Column: Image */}
        <Box>
          <Box
            style={{
              aspectRatio: '3/4',
              width: '100%',
              height: '90%',
              backgroundImage: `url(${pricingImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid #000',
              borderRadius: 16,
            }}
          />
        </Box>

        {/* Right Column: Text */}
        <Box ta="left">
          <Stack gap="xl" align="flex-start" justify="center" h="90%">

            {/* Headers */}
            <Stack gap="xs">
              <Title
                order={1}
                ta="left"
                tt="uppercase"
                lts="0.1em"
                c="black"
                fw={900}
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 4rem)',
                  lineHeight: 1.1,
                  fontFamily: "'Inter', sans-serif",
                  whiteSpace: 'nowrap'
                }}
              >
                BẢNG GIÁ MAKEUP
              </Title>
            </Stack>

            {/* Paragraphs */}
            <Stack gap="md">
              <Text
                ta="left"
                c="black"
                size="md"
                lh="lg"
              >
                Bạn đang quan tâm về giá dịch vụ trang điểm tại Emisa là bao nhiêu? Nếu trang điểm cô dâu, dự tiệc tại nhà thì mức giá makeup như thế nào? Emisa xin đưa ra bảng giá makeup chính thức khu vực TP. Hồ Chí Minh để bạn tham khảo như sau:
              </Text>
              <Text
                ta="left"
                c="black"
                size="md"
                lh="lg"
              >
                Với triết lý tôn vinh những đường nét tự nhiên, Emisa cam kết mang đến cho bạn trải nghiệm dịch vụ hoàn hảo nhất. Chúng tôi hiểu rằng mỗi gương mặt là một tác phẩm nghệ thuật độc bản, xứng đáng được chăm chút bởi đôi tay tài hoa và những dòng mỹ phẩm highend hàng đầu.
              </Text>
            </Stack>

            {/* List */}
            <List
              mt="xl"
              spacing="md"
              size="md"
              icon={<IconRosetteDiscountCheck size={20} color="#2b8a3e" stroke={2} />}
            >
              <List.Item>
                <Text c="black" lh="lg" fw={500}>Sử dụng 100% mỹ phẩm chính hãng (Dior, Chanel, MAC...)</Text>
              </List.Item>
              <List.Item>
                <Text c="black" lh="lg" fw={500}>Tư vấn layout cá nhân hóa theo từng khuôn mặt</Text>
              </List.Item>
              <List.Item>
                <Text c="black" lh="lg" fw={500}>Đội ngũ chuyên nghiệp, đúng giờ, tận tâm</Text>
              </List.Item>
            </List>

          </Stack>
        </Box>

      </SimpleGrid>
    </Container>
  );
}
