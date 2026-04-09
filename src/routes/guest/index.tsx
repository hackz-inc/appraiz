import { createFileRoute } from '@tanstack/react-router'
import { requireAuth } from '#/lib/auth/middleware'

export const Route = createFileRoute('/guest/')({
  beforeLoad: async () => {
    return await requireAuth('guest')
  },
  component: GuestDashboard,
})

function GuestDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">
          ゲストダッシュボード
        </h1>
        <p className="text-gray-600">
          ゲスト用のダッシュボードページです。
        </p>
      </div>
    </div>
  )
}
