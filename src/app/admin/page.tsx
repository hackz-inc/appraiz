'use client'

import { useRouter } from 'next/navigation'
import { AdminAuthGuard } from '@/components/guards'
import { Container, Button, Card } from '@/components/ui'
import { CreateHackathonModal } from '@/components/features/hackathon'
import { auth } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'
import { useModalStore } from '@/stores'
import { useHackathons } from '@/hooks/useHackathons'

function AdminDashboardContent() {
  const router = useRouter()
  const { user } = useAuth()
  const { openModal } = useModalStore()
  const { hackathons: hackathonsList, isLoading: loading } = useHackathons()

  const handleSignOut = async () => {
    await auth.signOut()
    router.push('/admin/auth/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-black-lighten5">
      {/* Header */}
      <header className="bg-white border-b border-black-lighten3 shadow-sm">
        <Container>
          <div className="py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black-primary">
                Appraiz 管理画面
              </h1>
              <p className="text-sm text-black-lighten1 mt-1">
                {user?.email}
              </p>
            </div>
            <Button variant="secondary" onClick={handleSignOut}>
              ログアウト
            </Button>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <Container className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black-primary">
            ハッカソン一覧
          </h2>
          <Button
            variant="primary"
            onClick={() => openModal('isCreateHackathonModalOpen')}
          >
            + 新規作成
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin h-12 w-12 border-4 border-yellow-primary border-t-transparent rounded-full" />
          </div>
        ) : !hackathonsList || hackathonsList.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-black-lighten1 mb-4">
                ハッカソンが登録されていません
              </p>
              <Button
                variant="primary"
                onClick={() => openModal('isCreateHackathonModalOpen')}
              >
                最初のハッカソンを作成
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathonsList.map((hackathon) => (
              <Card
                key={hackathon.id}
                variant="elevated"
                className="hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => router.push(`/admin/hackathons/${hackathon.id}`)}
              >
                <h3 className="text-xl font-bold text-black-primary mb-2">
                  {hackathon.name}
                </h3>
                <p className="text-sm text-black-lighten1 mb-4">
                  採点日: {new Date(hackathon.scoring_date).toLocaleDateString('ja-JP')}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/admin/hackathons/${hackathon.id}/settings`)
                    }}
                  >
                    設定
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/admin/hackathons/${hackathon.id}/results`)
                    }}
                  >
                    結果
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>

      {/* Modals */}
      <CreateHackathonModal />
    </div>
  )
}

export default function AdminPage() {
  return (
    <AdminAuthGuard>
      <AdminDashboardContent />
    </AdminAuthGuard>
  )
}
