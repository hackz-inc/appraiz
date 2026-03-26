"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Container, Button, Card } from "@/components/ui";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Sidebar } from "@/components/admin/Sidebar";
import { useHackathon } from "@/hooks/useHackathons";
import { useTeams } from "@/hooks/useTeams";
import { useScoringItems } from "@/hooks/useScoringItems";
import { useGuests } from "@/hooks/useGuests";
import { DeleteTeamButton } from "../../../_components/DeleteTeamButton";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./index.module.css";

export function TeamsPage() {
	const params = useParams();
	const hackathonId = params.id as string;

	const { hackathon, isLoading: hackathonLoading } = useHackathon(hackathonId);
	const { teams: teamList, isLoading: teamsLoading } = useTeams(hackathonId);
	const { scoringItems: itemsList } = useScoringItems(hackathonId);
	const { guests: guestsList } = useGuests(hackathonId);

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const loading = hackathonLoading || teamsLoading;

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.loadingContent}>
					<div className={styles.loadingIconWrapper}>
						<div className={styles.loadingIconPing} />
						<div className={styles.loadingIcon}>
							<span className={styles.loadingEmoji}>⏳</span>
						</div>
					</div>
					<p className={styles.loadingText}>読み込み中...</p>
				</div>
			</div>
		);
	}

	if (!hackathon) {
		return (
			<div className={styles.errorContainer}>
				<Card className={styles.errorCard}>
					<div className={styles.errorContent}>
						<div className={styles.errorIcon}>
							<span className={styles.errorEmoji}>❌</span>
						</div>
						<h3 className={styles.errorTitle}>
							ハッカソンが見つかりません
						</h3>
						<p className={styles.errorMessage}>
							指定されたハッカソンは存在しないか、削除された可能性があります
						</p>
						<Link href="/admin">
							<Button variant="primary">管理画面に戻る</Button>
						</Link>
					</div>
				</Card>
			</div>
		);
	}

	const sidebarItems = [
		...(teamList || []).map((team) => ({
			id: team.id,
			label: team.name,
			icon: "👥",
			type: "team" as const,
		})),
	];

	const handleMenuToggle = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className={styles.pageContainer}>
			<AdminHeader
				breadcrumbs={[
					{ label: "ホーム", href: "/admin" },
					{ label: hackathon.name, href: `/admin/hackathons/${hackathonId}` },
					{ label: "チーム" },
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
						onClick={handleMenuToggle}
						className={styles.overlay}
					/>
				)}
			</AnimatePresence>

			<Sidebar
				items={sidebarItems}
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				hackathonId={hackathonId}
			/>

			<Container className={styles.contentContainer}>
				<div className={styles.headerSection}>
					<div className={styles.headerText}>
						<h1 className={styles.headerTitle}>
							<span className={styles.headerTitleEmoji}>👥</span>
							<span>チーム一覧</span>
						</h1>
						<p className={styles.headerDescription}>参加チームを管理します</p>
					</div>
					<Link href={`/admin/hackathons/${hackathonId}/teams/new`}>
						<Button variant="primary">➕ チーム追加</Button>
					</Link>
				</div>

				{!teamList || teamList.length === 0 ? (
					<Card className={styles.emptyCard}>
						<div className={styles.emptyContent}>
							<div className={styles.emptyIcon}>
								<span className={styles.emptyEmoji}>👥</span>
							</div>
							<p className={styles.emptyText}>
								チームがまだ登録されていません
							</p>
							<Link href={`/admin/hackathons/${hackathonId}/teams/new`}>
								<Button variant="primary">➕ チーム追加</Button>
							</Link>
						</div>
					</Card>
				) : (
					<div className={styles.teamsGrid}>
						{teamList.map((team) => (
							<Card key={team.id}>
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
												href={`/admin/hackathons/${hackathonId}/teams/${team.id}`}
												className={styles.teamEditLink}
											>
												<Button variant="secondary" size="sm" fullWidth>
													✏️ 編集
												</Button>
											</Link>
											<DeleteTeamButton
												teamId={team.id}
												hackathonId={hackathonId}
											/>
										</div>
									</div>
								</div>
							</Card>
						))}
					</div>
				)}
			</Container>
		</div>
	);
}
