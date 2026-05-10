import { Carousel } from '@mantine/carousel'
import { Box, Text, UnstyledButton } from '@mantine/core'
import Image from 'next/image'

const CATEGORIES = [
  { key: 'headline', label: 'Headlines' },
  { key: 'business', label: 'Business' },
  { key: 'sports', label: 'Sports' },
  { key: 'health', label: 'Health' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'science', label: 'Science' },
  { key: 'technology', label: 'Technology' },
]

interface Props {
  active: string
  onChange: (category: string) => void
}

export function CategoryCarousel({ active, onChange }: Props) {
  return (
    <Carousel slideSize="14%" slideGap="sm" loop align="start" mb="xl">
      {CATEGORIES.map(({ key, label }) => (
        <Carousel.Slide key={key}>
          <UnstyledButton
            onClick={() => onChange(key)}
            sx={(theme) => ({
              borderRadius: theme.radius.md,
              overflow: 'hidden',
              border: active === key
                ? `3px solid ${theme.colors.blue[5]}`
                : '3px solid transparent',
              display: 'block',
              width: '100%',
            })}
          >
            <Box pos="relative" h={100}>
              <Image
                src={`/categories/${key}.jpg`}
                alt={label}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
            <Text ta="center" size="sm" fw={active === key ? 700 : 400} py={4}>
              {label}
            </Text>
          </UnstyledButton>
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}
