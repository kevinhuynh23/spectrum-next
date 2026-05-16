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
    <div style={{ background: 'var(--color-card)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="max-w-screen-xl mx-auto flex overflow-x-auto scrollbar-none px-6">
        {CATEGORIES.map(({ key, label }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className="px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors"
              style={{
                borderColor: isActive ? 'var(--color-accent)' : 'transparent',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                fontWeight: isActive ? '600' : '500',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
