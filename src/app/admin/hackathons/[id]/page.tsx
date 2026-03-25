'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Container, Button, Card } from '@/components/ui'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useHackathon } from '@/hooks/useHackathons'
import { useTeams } from '@/hooks/useTeams'
import { useScoringItems } from '@/hooks/useScoringItems'
import { DeleteTeamButton } from './DeleteTeamButton'
import { DeleteScoringItemButton } from './DeleteScoringItemButton'

export default function HackathonDetailPage() {
  const params = useParams()
  const hackathonId = params.id as string

  const { hackathon, isLoading: hackathonLoading } = useHackathon(hackathonId)
  const { teams: teamList, isLoading: teamsLoading } = useTeams(hackathonId)
  const { scoringItems: itemsList, isLoading: itemsLoading } = useScoringItems(hackathonId)

  // 初回ロード時のみローディング画面を表示（キャッシュがない場合）
  const loading = (hackathonLoading && !hackathon) || (teamsLoading && !teamList) || (itemsLoading && !itemsList)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black-lighten5 via-white to-yellow-lighten1">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 animate-ping h-16 w-16 rounded-full bg-yellow-primary opacity-20" />
            <div className="relative inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-primary shadow-lg">
              <span className="text-3xl animate-bounce">⏳</span>
            </div>
          </div>
          <p className="text-black-lighten1 font-medium">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black-lighten5 via-white to-yellow-lighten1">
        <Card variant="elevated" className="max-w-md">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red/20 mb-4">
              <span className="text-4xl">❌</span>
            </div>
            <h3 className="text-2xl font-bold text-black-primary mb-3">
              ハッカソンが見つかりません
            </h3>
            <p className="text-black-lighten1 mb-6">
              指定されたハッカソンは存在しないか、削除された可能性があります
            </p>
            <Link href="/admin">
              <Button variant="primary">管理画面に戻る</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black-lighten5 via-white to-yellow-lighten1">
      <AdminHeader
        breadcrumbs={[
          { label: "ホーム", href: "/admin" },
          { label: hackathon.name }
        ]}
      />

      {/* Main Content */}
      <Container className="py-10">

        <Card variant="gradient" className="mb-8 border-4 border-yellow-primary">
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-yellow-primary shadow-lg flex-shrink-0">
              <span className="text-3xl">🏆</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-black-primary mb-3">
                {hackathon.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-black-lighten1 mb-4">
                <span>📅</span>
                <span className="font-medium">採点日: {new Date(hackathon.scoring_date).toLocaleDateString('ja-JP')}</span>
              </div>
              <div className="flex gap-3">
                <Link href={`/score/${hackathonId}`}>
                  <Button variant="primary">✍️ スコアリングフォーム</Button>
                </Link>
                <Link href={`/results/${hackathonId}`}>
                  <Button variant="secondary">📊 結果を見る</Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Teams Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-black-primary mb-1 flex items-center gap-2">
                <span>👥</span>
                <span>チーム</span>
              </h2>
              <p className="text-sm text-black-lighten1">参加チームを管理します</p>
            </div>
            <Link href={`/admin/hackathons/${hackathonId}/teams/new`}>
              <Button variant="primary">➕ チーム追加</Button>
            </Link>
          </div>
          {!teamList || teamList.length === 0 ? (
            <Card variant="elevated" className="bg-gradient-to-br from-white to-blue/10">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue/20 mb-4">
                  <span className="text-3xl">👥</span>
                </div>
                <p className="text-black-lighten1 font-medium">
                  チームがまだ登録されていません
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamList.map((team) => (
                <Card key={team.id} variant="elevated" hoverable>
                  <div className="flex items-start gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue/20 flex-shrink-0">
                      <span className="text-xl">👥</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-black-primary mb-3">
                        {team.name}
                      </h3>
                      <div className="flex gap-2">
                        <Link href={`/admin/hackathons/${hackathonId}/teams/${team.id}`} className="flex-1">
                          <Button variant="secondary" size="sm" fullWidth>
                            ✏️ 編集
                          </Button>
                        </Link>
                        <DeleteTeamButton teamId={team.id} hackathonId={hackathonId} />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Criteria Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-black-primary mb-1 flex items-center gap-2">
                <span>📋</span>
                <span>採点項目</span>
              </h2>
              <p className="text-sm text-black-lighten1">評価基準を管理します</p>
            </div>
            <Link href={`/admin/hackathons/${hackathonId}/criteria/new`}>
              <Button variant="primary">➕ 採点項目追加</Button>
            </Link>
          </div>
          {!itemsList || itemsList.length === 0 ? (
            <Card variant="elevated" className="bg-gradient-to-br from-white to-green/10">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green/20 mb-4">
                  <span className="text-3xl">📋</span>
                </div>
                <p className="text-black-lighten1 font-medium">
                  採点項目がまだ登録されていません
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {itemsList.map((item) => (
                <Card key={item.id} variant="elevated" hoverable>
                  <div className="flex items-start gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green/20 flex-shrink-0">
                      <span className="text-xl">📋</span>
                    </div>
                    <div className="flex-1 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-black-primary mb-2">
                          {item.name}
                        </h3>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-primary/20 border border-yellow-primary">
                          <span className="text-sm font-bold text-black-primary">
                            最大 {item.max_score} 点
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link href={`/admin/hackathons/${hackathonId}/criteria/${item.id}`}>
                          <Button variant="secondary" size="sm">
                            ✏️ 編集
                          </Button>
                        </Link>
                        <DeleteScoringItemButton itemId={item.id} hackathonId={hackathonId} />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
