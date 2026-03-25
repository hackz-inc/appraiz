'use client'

import Link from 'next/link'
import { Container, Breadcrumb } from '@/components/ui'
import { SignOutButton } from '@/app/admin/SignOutButton'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface AdminHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
}

export const AdminHeader = ({ breadcrumbs }: AdminHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-yellow-primary/95 via-yellow-lighten2/95 to-yellow-lighten1/95 border-b-4 border-yellow-primary shadow-xl">
      <Container>
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-lg transform transition-transform group-hover:scale-110">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-black-primary drop-shadow-sm">
                  Appraiz
                </h1>
                <p className="text-xs text-black-lighten1 font-medium">管理画面</p>
              </div>
            </Link>
          </div>
          <SignOutButton />
        </div>

        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="pb-4">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}
      </Container>
    </header>
  )
}
