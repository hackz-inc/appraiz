import Link from 'next/link'
import styles from './Breadcrumb.module.css'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className={styles.breadcrumb}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className={styles.item}>
            {item.href && !isLast ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? styles.active : styles.text}>
                {item.label}
              </span>
            )}
            {!isLast && <span className={styles.separator}>›</span>}
          </div>
        )
      })}
    </nav>
  )
}
