"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container, Button, Card } from "@/components/ui";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Sidebar } from "@/components/admin/Sidebar";
import { DeleteTeamButton } from "../DeleteTeamButton";
import { DeleteScoringItemButton } from "../DeleteScoringItemButton";
import type { Hackathon } from "@/lib/hackathons";
import type { Team } from "@/lib/teams";
import type { ScoringItem } from "@/lib/scoring";
import type { Guest } from "@/lib/server/guests";
import styles from "./index.module.css";

type Props = {
	hackathon: Hackathon;
	teams: Team[];
	scoringItems: ScoringItem[];
	guests: Guest[];
};

export function HackathonDetailClient({
	hackathon,
	teams,
	scoringItems,
	guests,
}: Props) {
	const searchParams = useSearchParams();
	const tab = searchParams.get("tab") || "overview";

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const sidebarItems = [
		{ id: "overview", label: "概要", icon: "📊", type: "tab" as const },
		{ id: "teams", label: "チーム", icon: "👥", type: "tab" as const },
		{ id: "criteria", label: "採点項目", icon: "📋", type: "tab" as const },
		{ id: "guests", label: "ゲスト", icon: "🎤", type: "tab" as const },
	];

	const handleMenuToggle = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className={styles.pageContainer}>
			<AdminHeader
				breadcrumbs={[
					{ label: "ホーム", href: "/admin" },
					{ label: hackathon.name },
				]}
				isMenuOpen={isSidebarOpen}
				onMenuToggle={handleMenuToggle}
			/>

			<AnimatePresence>
				{isSidebarOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className={styles.overlay}
						onClick={handleMenuToggle}
					/>
				)}
			</AnimatePresence>

			<Sidebar
				items={sidebarItems}
				isOpen={isSidebarOpen}
				currentTab={tab}
				onClose={() => setIsSidebarOpen(false)}
				hackathonId={hackathon.id}
			/>

			<Container className={styles.contentContainer}>
				{/* Overview Tab */}
				{tab === "overview" && (
					<>
						{/* Teams Section */}
						<div id="teams-section" className={styles.section}>
							<div className={styles.sectionHeader}>
								<div>
									<h2 className={styles.sectionTitle}>
										<span className={styles.sectionTitleEmoji}>👥</span>
										<span>チーム</span>
									</h2>
									<p className={styles.sectionDescription}>
										参加チームを管理します
									</p>
								</div>
								<Link href={`/admin/hackathons/${hackathon.id}?tab=teams`}>
									<Button variant="secondary">チーム一覧へ</Button>
								</Link>
							</div>
							<p className={styles.overviewSummary}>チーム {teams.length} 件</p>
						</div>

						{/* Guests Section */}
						<div id="guests-section" className={styles.section}>
							<div className={styles.sectionHeader}>
								<div>
									<h2 className={styles.sectionTitle}>
										<span className={styles.sectionTitleEmoji}>🎤</span>
										<span>ゲスト</span>
									</h2>
									<p className={styles.sectionDescription}>
										共同開催者を管理します
									</p>
								</div>
								<Link href={`/admin/hackathons/${hackathon.id}?tab=guests`}>
									<Button variant="secondary">ゲスト一覧へ</Button>
								</Link>
							</div>
							<p className={styles.overviewSummary}>ゲスト {guests.length} 件</p>
						</div>

						{/* Criteria Section */}
						<div id="criteria-section">
							<div className={styles.sectionHeader}>
								<div>
									<h2 className={styles.sectionTitle}>
										<span className={styles.sectionTitleEmoji}>📋</span>
										<span>採点項目</span>
									</h2>
									<p className={styles.sectionDescription}>
										評価基準を管理します
									</p>
								</div>
								<Link href={`/admin/hackathons/${hackathon.id}?tab=criteria`}>
									<Button variant="secondary">採点項目一覧へ</Button>
								</Link>
							</div>
							<p className={styles.overviewSummary}>採点項目 {scoringItems.length} 件</p>
						</div>
					</>
				)}

				{/* Teams Tab */}
				{tab === "teams" && (
					<div id="teams-section" className={styles.section}>
						<div className={styles.sectionHeader}>
							<div>
								<h2 className={styles.sectionTitle}>
									<span className={styles.sectionTitleEmoji}>👥</span>
									<span>チーム</span>
								</h2>
								<p className={styles.sectionDescription}>
									参加チームを管理します
								</p>
							</div>
							<Link href={`/admin/hackathons/${hackathon.id}/teams/new`}>
								<Button variant="primary">➕ チーム追加</Button>
							</Link>
						</div>
						{!teams || teams.length === 0 ? (
							<Card
								className={`${styles.emptyCard} ${styles.emptyCardTeams}`}
							>
								<div className={styles.emptyContent}>
									<div className={`${styles.emptyIcon} ${styles.emptyIconTeams}`}>
										<span className={styles.emptyEmoji}>👥</span>
									</div>
									<p className={styles.emptyText}>
										チームがまだ登録されていません
									</p>
								</div>
							</Card>
						) : (
							<div className={styles.teamsGrid}>
								{teams.map((team) => (
									<Card key={team.id} id={`team-${team.id}`}>
										<div className={styles.teamCard}>
											<div className={styles.teamIcon}>
												<span className={styles.teamEmoji}>👥</span>
											</div>
											<div className={styles.teamContent}>
												<h3 className={styles.teamName}>
													{team.name}
												</h3>
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
									</Card>
								))}
							</div>
						)}
					</div>
				)}

				{/* Guests Tab */}
				{tab === "guests" && (
					<div id="guests-section" className={styles.section}>
						<div className={styles.sectionHeader}>
							<div>
								<h2 className={styles.sectionTitle}>
									<span className={styles.sectionTitleEmoji}>🎤</span>
									<span>ゲスト</span>
								</h2>
								<p className={styles.sectionDescription}>
									共同開催者を管理します
								</p>
							</div>
							<Link href={`/admin/hackathons/${hackathon.id}/guests`}>
								<Button variant="primary">⚙️ ゲスト管理</Button>
							</Link>
						</div>
						{!guests || guests.length === 0 ? (
							<Card
								className={`${styles.emptyCard} ${styles.emptyCardGuests}`}
							>
								<div className={styles.emptyContent}>
									<div className={`${styles.emptyIcon} ${styles.emptyIconGuests}`}>
										<span className={styles.emptyEmoji}>🎤</span>
									</div>
									<p className={styles.emptyText}>
										ゲストがまだ招待されていません
									</p>
									<Link href={`/admin/hackathons/${hackathon.id}/guests`}>
										<Button variant="secondary" size="sm">
											⚙️ ゲスト管理ページへ
										</Button>
									</Link>
								</div>
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
												<h3 className={styles.guestName}>
													{guest.name}
												</h3>
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
				)}

				{/* Criteria Tab */}
				{tab === "criteria" && (
					<div id="criteria-section">
						<div className={styles.sectionHeader}>
							<div>
								<h2 className={styles.sectionTitle}>
									<span className={styles.sectionTitleEmoji}>📋</span>
									<span>採点項目</span>
								</h2>
								<p className={styles.sectionDescription}>
									評価基準を管理します
								</p>
							</div>
							<Link href={`/admin/hackathons/${hackathon.id}/criteria/new`}>
								<Button variant="primary">➕ 採点項目追加</Button>
							</Link>
						</div>
						{!scoringItems || scoringItems.length === 0 ? (
							<Card
								className={`${styles.emptyCard} ${styles.emptyCardCriteria}`}
							>
								<div className={styles.emptyContent}>
									<div className={`${styles.emptyIcon} ${styles.emptyIconCriteria}`}>
										<span className={styles.emptyEmoji}>📋</span>
									</div>
									<p className={styles.emptyText}>
										採点項目がまだ登録されていません
									</p>
								</div>
							</Card>
						) : (
							<div className={styles.criteriaList}>
								{scoringItems.map((item) => (
									<Card key={item.id} id={`criteria-${item.id}`}>
										<div className={styles.criteriaCard}>
											<div className={styles.criteriaIcon}>
												<span className={styles.criteriaEmoji}>📋</span>
											</div>
											<div className={styles.criteriaContent}>
												<div className={styles.criteriaInfo}>
													<h3 className={styles.criteriaName}>
														{item.name}
													</h3>
													<div className={styles.scoreBadge}>
														<span className={styles.scoreBadgeText}>
															最大 {item.max_score} 点
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
									</Card>
								))}
							</div>
						)}
					</div>
				)}
			</Container>
		</div>
	);
}
