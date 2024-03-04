type Props = {
  size: number
  direction?: 'vertical' | 'horizontal'
}

export default function Spacing({ size, direction = 'vertical' }: Props) {
  return direction === 'vertical' ? <div style={{ height: size }} /> : <div style={{ width: size }} />
}
