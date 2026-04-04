"use client";

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { DeleteTeamButton } from "../DeleteTeamButton";
import { DeleteScoringItemButton } from "../DeleteScoringItemButton";
import type { Hackathon } from "@/lib/hackathons";
import type { Team } from "@/lib/teams";
import type { ScoringItem } from "@/lib/scoring";
import type { Guest } from "@/lib/server/guests";
import { NewTeamForm } from "../NewTeamForm";
import { NewCriteriaForm } from "../NewCriteriaForm";
import { AdminHeader } from "@/app/admin/_components/AdminHeader";

type Props = {
	hackathon: Hackathon;
	teams: Team[];
	scoringItems: ScoringItem[];
};

export const HackathonDetailClient = ({
	hackathon,
	teams,
	scoringItems,
}: Props) => {
	return (
		<div className="min-h-screen bg-[var(--black-lighten5)]">
			<AdminHeader
				breadcrumbs={[
					{ label: "ホーム", href: "/admin" },
					{ label: hackathon.name },
				]}
			/>

			<div className="max-w-7xl mx-auto px-8 py-8">
				{/* チームセクション */}
				<div id="teams-section" className="mb-12">
					<div className="mb-6">
						<div>
							<h2 className="text-3xl font-bold text-[var(--black-primary)] flex items-center gap-3">
								<span className="text-4xl">👥</span>
								<span>チーム</span>
							</h2>
						</div>
					</div>

					<Card>
						<NewTeamForm />
						{!teams || teams.length === 0 ? (
							// 空の場合
							<div className="text-center py-12">
								<div className="flex flex-col items-center gap-4">
									<p className="text-[var(--black-lighten1)]">
										チームがまだ登録されていません
									</p>
								</div>
							</div>
						) : (
							// チームがある場合
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{teams.map((team) => (
									<div
										key={team.id}
										className="bg-white border border-[var(--black-lighten3)] rounded-lg p-4 hover:shadow-md transition-shadow"
									>
										<div className="flex items-start gap-3">
											<div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[var(--yellow-lighten1)] rounded-full">
												<span className="text-2xl">👥</span>
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="text-lg font-bold text-[var(--black-primary)] mb-3 truncate">
													{team.name}
												</h3>
												<div className="flex gap-2">
													<Link
														href={`/admin/hackathons/${hackathon.id}/teams/${team.id}`}
														className="flex-1"
													>
														<Button variant="secondary" size="sm" fullWidth>
															✏️ 編集
														</Button>
													</Link>
													<DeleteTeamButton
														teamId={team.id}
														hackathonId={hackathon.id}
													/>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</Card>
				</div>

				{/* 採点項目セクション */}
				<div id="criteria-section" className="mb-12">
					<div className="mb-6">
						<div>
							<h2 className="text-3xl font-bold text-[var(--black-primary)] flex items-center gap-3">
								<span className="text-4xl">📋</span>
								<span>採点項目</span>
							</h2>
						</div>
					</div>

					<Card>
						<NewCriteriaForm />
						{!scoringItems || scoringItems.length === 0 ? (
							// 空の場合
							<div className="text-center py-12">
								<div className="flex flex-col items-center gap-4">
									<div className="w-16 h-16 flex items-center justify-center bg-[var(--yellow-lighten1)] rounded-full">
										<span className="text-3xl">📋</span>
									</div>
									<p className="text-[var(--black-lighten1)]">
										採点項目がまだ登録されていません
									</p>
								</div>
							</div>
						) : (
							// 採点項目がある場合
							<div className="flex flex-col gap-4">
								{scoringItems.map((item) => (
									<div
										key={item.id}
										className="bg-white border border-[var(--black-lighten3)] rounded-lg p-4 hover:shadow-md transition-shadow"
									>
										<div className="flex items-center gap-4">
											<div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[var(--yellow-lighten1)] rounded-full">
												<span className="text-2xl">📋</span>
											</div>
											<div className="flex-1 min-w-0 flex items-center justify-between gap-4">
												<div className="flex items-center gap-3 min-w-0 flex-1">
													<h3 className="text-lg font-bold text-[var(--black-primary)] truncate">
														{item.name}
													</h3>
													<div className="flex-shrink-0 px-3 py-1 bg-[var(--yellow-lighten1)] rounded-full">
														<span className="text-sm font-semibold text-[var(--black-primary)]">
															{item.max_score} 点
														</span>
													</div>
												</div>
												<div className="flex gap-2 flex-shrink-0">
													<Link
														href={`/admin/hackathons/${hackathon.id}/criteria/${item.id}`}
													>
														<Button variant="secondary" size="sm">
															✏️ 編集
														</Button>
													</Link>
													<DeleteScoringItemButton
														itemId={item.id}
														hackathonId={hackathon.id}
													/>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</Card>
				</div>
			</div>
		</div>
	);
};
