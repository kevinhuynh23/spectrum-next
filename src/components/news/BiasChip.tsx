'use client'

const LEAN_CONFIG: Record<string, { className: string; label: string }> = {
  Left: { className: 'bg-blue-500/15 text-blue-500', label: 'Left' },
  'Center-Left': { className: 'bg-blue-400/15 text-blue-400', label: 'Center-Left' },
  Center: { className: 'bg-purple-500/15 text-purple-500', label: 'Center' },
  'Center-Right': { className: 'bg-red-400/15 text-red-400', label: 'Center-Right' },
  Right: { className: 'bg-red-500/15 text-red-500', label: 'Right' },
}

interface Props {
  lean?: string | null
}

export function BiasChip({ lean }: Props) {
  if (!lean) return null
  const config = LEAN_CONFIG[lean]
  if (!config) return null

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
