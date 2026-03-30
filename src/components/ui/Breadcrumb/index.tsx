import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="text-[var(--black-lighten1)] font-medium transition-colors hover:text-[var(--black-primary)] no-underline">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-bold text-[var(--black-primary)]" : "font-medium text-[var(--black-lighten1)]"}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="text-[var(--black-lighten2)]">›</span>}
          </div>
        )
      })}
    </nav>
  )
}
