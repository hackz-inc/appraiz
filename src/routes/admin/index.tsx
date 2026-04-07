import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">
          管理者ダッシュボード
        </h1>
        <p className="text-gray-600">
          管理者用のダッシュボードページです。
        </p>
      </div>
    </div>
  )
}
