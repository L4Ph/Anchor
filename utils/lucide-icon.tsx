import { jsx, type JSX } from "hono/jsx"
import type { IconNode } from "https://esm.sh/lucide@0.474.0"

type Props = JSX.IntrinsicElements["div"] & {
  icon: IconNode
}

export function LucideIcon(props: Props) {
  const {
    icon: [title, svgProps, paths],
    ...rest
  } = props

  if (paths === undefined) {
    return <svg />
  }

  return (
    <svg {...rest} {...svgProps}>
      <title>{title}</title>
      {/* @ts-ignore */}
      {paths.map(([tag, svgProps]) => jsx(tag, { ...svgProps }))}
    </svg>
  )
}