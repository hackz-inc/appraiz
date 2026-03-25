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
              <Link
                href={item.href}
                className="text-black-lighten1 hover:text-black-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-black-primary font-bold' : 'text-black-lighten1 font-medium'}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="text-black-lighten2">›</span>}
          </div>
        )
      })}
    </nav>
  )
}
