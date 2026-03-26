"use client";

import Link from "next/link";
import { Container, Button, Card } from "@/components/ui";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeleteTeamButton } from "../DeleteTeamButton";
import { DeleteScoringItemButton } from "../DeleteScoringItemButton";
import type { Hackathon } from "@/lib/hackathons";
import type { Team } from "@/lib/teams";
import type { ScoringItem } from "@/lib/scoring";
import type { Guest } from "@/lib/server/guests";
import styles from "./index.module.css";
import { NewTeamForm } from "../NewTeamForm";
import { NewCriteriaForm } from "../NewCriteriaForm";

interface Props {
	hackathon: Hackathon;
	teams: Team[];
	scoringItems: ScoringItem[];
	guests: Guest[];
}

export function HackathonDetailClient({
	hackathon,
	teams,
	scoringItems,
	guests,
}: Props) {
	return (
		<div className={styles.pageContainer}>
			<AdminHeader
				breadcrumbs={[
					{ label: "ホーム", href: "/admin" },
					{ label: hackathon.name },
				]}
			/>

			<div className={styles.contentContainer}>
				{/* チームセクション */}
				<div id="teams-section" className={styles.section}>
					<div className={styles.sectionHeader}>
						<div>
							<h2 className={styles.sectionTitle}>
								<span className={styles.sectionTitleEmoji}>👥</span>
								<span>チーム</span>
							</h2>
						</div>
					</div>

					<Card>
						<NewTeamForm />
						{!teams || teams.length === 0 ? (
							// 空の場合
							<div className={`${styles.emptyCard} ${styles.emptyCardTeams}`}>
								<div className={styles.emptyContent}>
									<p className={styles.emptyText}>
										チームがまだ登録されていません
									</p>
								</div>
							</div>
						) : (
							// チームがある場合
							<div className={styles.teamsGrid}>
								{teams.map((team) => (
									// <Card key={team.id} id={`team-${team.id}`}>
									<div key={team.id} className={styles.teamCard}>
										<div className={styles.teamIcon}>
											<span className={styles.teamEmoji}>👥</span>
										</div>
										<div className={styles.teamContent}>
											<h3 className={styles.teamName}>{team.name}</h3>
											<div className={styles.teamActions}>
												<Link
													href={`/admin/hackathons/${hackathon.id}/teams/${team.id}`}
													className={styles.teamEditLink}
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
									// </Card>
								))}
							</div>
						)}
					</Card>
				</div>

				{/* 採点項目セクション */}
				<div id="criteria-section" className={styles.section}>
					<div className={styles.sectionHeader}>
						<div>
							<h2 className={styles.sectionTitle}>
								<span className={styles.sectionTitleEmoji}>📋</span>
								<span>採点項目</span>
							</h2>
						</div>
					</div>

					<Card>
						<NewCriteriaForm />
						{!scoringItems || scoringItems.length === 0 ? (
							// 空の場合
							<div
								className={`${styles.emptyCard} ${styles.emptyCardCriteria}`}
							>
								<div className={styles.emptyContent}>
									<div
										className={`${styles.emptyIcon} ${styles.emptyIconCriteria}`}
									>
										<span className={styles.emptyEmoji}>📋</span>
									</div>
									<p className={styles.emptyText}>
										採点項目がまだ登録されていません
									</p>
								</div>
							</div>
						) : (
							// 採点項目がある場合
							<div className={styles.criteriaList}>
								{scoringItems.map((item) => (
									<div key={item.id} className={styles.criteriaCard}>
										<div className={styles.criteriaIcon}>
											<span className={styles.criteriaEmoji}>📋</span>
										</div>
										<div className={styles.criteriaContent}>
											<div className={styles.criteriaInfo}>
												<h3 className={styles.criteriaName}>{item.name}</h3>
												<div className={styles.scoreBadge}>
													<span className={styles.scoreBadgeText}>
														{item.max_score} 点
													</span>
												</div>
											</div>
											<div className={styles.criteriaActions}>
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
								))}
							</div>
						)}
					</Card>
				</div>

				{/* 共同開催者セクション */}
				<div id="guests-section" className={styles.section}>
					<div className={styles.sectionHeader}>
						<div>
							<h2 className={styles.sectionTitle}>
								<span className={styles.sectionTitleEmoji}>🫱‍🫲</span>
								<span>共同開催者</span>
							</h2>
						</div>
					</div>

					{!guests || guests.length === 0 ? (
						<Card className={`${styles.emptyCard} ${styles.emptyCardGuests}`}>
							<div className={styles.emptyContent}>共同開催者</div>
						</Card>
					) : (
						<div className={styles.guestsGrid}>
							{guests.map((guest) => (
								<Card key={guest.id} id={`guest-${guest.id}`}>
									<div className={styles.guestCard}>
										<div className={styles.guestIcon}>
											<span className={styles.guestEmoji}>🎤</span>
										</div>
										<div className={styles.guestContent}>
											<h3 className={styles.guestName}>{guest.name}</h3>
											<p className={styles.guestCompany}>
												{guest.company_name}
											</p>
											<div className={styles.guestActions}>
												<Link
													href={`/admin/hackathons/${hackathon.id}/guests`}
													className={styles.guestManageLink}
												>
													<Button variant="secondary" size="sm" fullWidth>
														⚙️ 管理
													</Button>
												</Link>
											</div>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
