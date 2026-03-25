"use client";

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { useTeams } from "@/hooks/useTeams";
import { DeleteTeamButton } from "../DeleteTeamButton";

type TeamsSectionProps = {
	hackathonId: string;
};

export function TeamsSection({ hackathonId }: TeamsSectionProps) {
	const { teams: teamList, isLoading: teamsLoading } = useTeams(hackathonId);

	if (teamsLoading) {
		return (
			<div className="text-center py-12">
				<div className="relative inline-block mb-4">
					<div className="absolute inset-0 animate-ping h-16 w-16 rounded-full bg-yellow-primary opacity-20" />
					<div className="relative inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-primary shadow-lg">
						<span className="text-3xl animate-bounce">⏳</span>
					</div>
				</div>
				<p className="text-black-lighten1 font-medium">読み込み中...</p>
			</div>
		);
	}

	return (
		<div>
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
						<Card key={team.id}>
							<div className="flex items-start gap-3">
								<div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue/20 flex-shrink-0">
									<span className="text-xl">👥</span>
								</div>
								<div className="flex-1">
									<h3 className="text-lg font-bold text-black-primary mb-3">
										{team.name}
									</h3>
									<div className="flex gap-2">
										<Link
											href={`/admin/hackathons/${hackathonId}/teams/${team.id}`}
											className="flex-1"
										>
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
	);
}
