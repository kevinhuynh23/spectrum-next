'use client'

const CATEGORIES = [
  { key: 'headline', label: 'Headlines' },
  { key: 'business', label: 'Business' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'health', label: 'Health' },
  { key: 'science', label: 'Science' },
  { key: 'sports', label: 'Sports' },
  { key: 'technology', label: 'Tech' },
] as const

interface Props {
  active: string
  onChange: (category: string) => void
}

export function CategoryTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 border-b border-default-200 mb-4 overflow-x-auto">
      {CATEGORIES.map(({ key, label }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
              isActive
                ? 'border-primary text-foreground font-medium'
                : 'border-transparent text-default-500 hover:text-foreground'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
