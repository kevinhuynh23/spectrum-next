'use client'

const LEAN_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
  Left:           { bg: '#1e3a8a22', text: '#60a5fa', border: '#1e3a8a',   label: 'Left' },
  'Center-Left':  { bg: '#1e40af22', text: '#93c5fd', border: '#1e40af55', label: 'Center-Left' },
  Center:         { bg: '#4c1d9522', text: '#c4b5fd', border: '#4c1d9555', label: 'Center' },
  'Center-Right': { bg: '#7f1d1d22', text: '#fca5a5', border: '#7f1d1d55', label: 'Center-Right' },
  Right:          { bg: '#7f1d1d33', text: '#f87171', border: '#991b1b',   label: 'Right' },
}

interface Props {
  lean?: string | null
}

export function BiasChip({ lean }: Props) {
  if (!lean) return null
  const config = LEAN_CONFIG[lean]
  if (!config) return null

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ background: config.bg, color: config.text, border: `1px solid ${config.border}` }}
    >
      {config.label}
    </span>
  )
}
