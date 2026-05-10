import { Badge } from '@mantine/core'

const BIAS_COLORS: Record<string, string> = {
  'Left': 'blue',
  'Center-Left': 'cyan',
  'Center': 'gray',
  'Center-Right': 'orange',
  'Right': 'red',
}

interface Props {
  lean: string | null | undefined
}

export function BiasIndicator({ lean }: Props) {
  if (!lean) return null
  return (
    <Badge color={BIAS_COLORS[lean] ?? 'gray'} size="xs" variant="light">
      {lean}
    </Badge>
  )
}
