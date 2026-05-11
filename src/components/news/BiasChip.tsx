import { Chip } from '@heroui/react'

const LEAN_CONFIG: Record<string, { color: 'primary' | 'secondary' | 'danger' | 'default'; label: string }> = {
  Left: { color: 'primary', label: 'Left' },
  'Center-Left': { color: 'primary', label: 'Center-Left' },
  Center: { color: 'secondary', label: 'Center' },
  'Center-Right': { color: 'danger', label: 'Center-Right' },
  Right: { color: 'danger', label: 'Right' },
}

interface Props {
  lean?: string | null
}

export function BiasChip({ lean }: Props) {
  if (!lean) return null
  const config = LEAN_CONFIG[lean]
  if (!config) return null

  return (
    <Chip size="sm" color={config.color} variant="flat">
      {config.label}
    </Chip>
  )
}
