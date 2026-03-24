import Link from 'next/link'
import { Container, Button, Card } from '@/components/ui'
import { getHackathonById } from '@/lib/server/hackathons'
import { getTeamsByHackathon } from '@/lib/server/teams'
import { getScoringItemsByHackathon } from '@/lib/server/scoring'
import { BackButton } from './BackButton'
import { DeleteTeamButton } from './DeleteTeamButton'
import { DeleteScoringItemButton } from './DeleteScoringItemButton'

export default async function HackathonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: hackathonId } = await params

  const [hackathon, teamList, itemsList] = await Promise.all([
    getHackathonById(hackathonId),
    getTeamsByHackathon(hackathonId),
    getScoringItemsByHackathon(hackathonId),
  ])

  return (
    <div className="min-h-screen bg-black-lighten5">
      <Container className="py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <Card variant="elevated" className="mb-8">
          <h1 className="text-3xl font-bold text-black-primary mb-4">
            {hackathon.name}
          </h1>
          <p className="text-sm text-black-lighten1 mb-4">
            採点日: {new Date(hackathon.scoring_date).toLocaleDateString('ja-JP')}
          </p>
          <div className="flex gap-2">
            <Link href={`/score/${hackathonId}`}>
              <Button variant="primary">スコアリングフォーム</Button>
            </Link>
            <Link href={`/results/${hackathonId}`}>
              <Button variant="secondary">結果を見る</Button>
            </Link>
          </div>
        </Card>

        {/* Teams Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black-primary">チーム</h2>
            <Link href={`/admin/hackathons/${hackathonId}/teams/new`}>
              <Button variant="primary">+ チーム追加</Button>
            </Link>
          </div>
          {teamList.length === 0 ? (
            <Card>
              <p className="text-center text-black-lighten1">
                チームが登録されていません
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamList.map((team) => (
                <Card key={team.id}>
                  <h3 className="text-xl font-bold text-black-primary mb-2">
                    {team.name}
                  </h3>
                  <div className="flex gap-2">
                    <Link href={`/admin/hackathons/${hackathonId}/teams/${team.id}`}>
                      <Button variant="secondary" size="sm">
                        編集
                      </Button>
                    </Link>
                    <DeleteTeamButton teamId={team.id} hackathonId={hackathonId} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Criteria Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black-primary">採点項目</h2>
            <Link href={`/admin/hackathons/${hackathonId}/criteria/new`}>
              <Button variant="primary">+ 採点項目追加</Button>
            </Link>
          </div>
          {itemsList.length === 0 ? (
            <Card>
              <p className="text-center text-black-lighten1">
                採点項目が登録されていません
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {itemsList.map((item) => (
                <Card key={item.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black-primary mb-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-black-lighten1">
                        最大スコア: {item.max_score} 点
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link href={`/admin/hackathons/${hackathonId}/criteria/${item.id}`}>
                        <Button variant="secondary" size="sm">
                          編集
                        </Button>
                      </Link>
                      <DeleteScoringItemButton itemId={item.id} hackathonId={hackathonId} />
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
