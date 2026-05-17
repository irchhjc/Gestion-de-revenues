import * as Icons from 'lucide-react'
import type { LucideProps } from 'lucide-react'

interface Props extends LucideProps {
  name: string
}

export function Icon({ name, ...rest }: Props) {
  const Cmp = (Icons as unknown as Record<string, React.FC<LucideProps>>)[name] || Icons.Circle
  return <Cmp {...rest} />
}
