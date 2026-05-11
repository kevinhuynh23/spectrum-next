'use client'

import { Tabs, Tab } from '@heroui/react'

const CATEGORIES = [
  { key: 'headline', label: 'Headlines' },
  { key: 'politics', label: 'Politics' },
  { key: 'business', label: 'Business' },
  { key: 'technology', label: 'Tech' },
  { key: 'science', label: 'Science' },
  { key: 'health', label: 'Health' },
  { key: 'sports', label: 'Sports' },
] as const

interface Props {
  active: string
  onChange: (category: string) => void
}

export function CategoryTabs({ active, onChange }: Props) {
  return (
    <Tabs
      selectedKey={active}
      onSelectionChange={(key) => onChange(key as string)}
      variant="underlined"
      classNames={{ tabList: 'mb-4' }}
    >
      {CATEGORIES.map(({ key, label }) => (
        <Tab key={key} title={label} />
      ))}
    </Tabs>
  )
}
