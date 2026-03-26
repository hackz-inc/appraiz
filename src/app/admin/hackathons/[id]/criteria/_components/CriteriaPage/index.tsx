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
import { DeleteScoringItemButton } from "../../../_components/DeleteScoringItemButton";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./index.module.css";

export function CriteriaPage() {
	const params = useParams();
	const hackathonId = params.id as string;

	const { hackathon, isLoading: hackathonLoading } = useHackathon(hackathonId);
	const { teams: teamList } = useTeams(hackathonId);
	const { scoringItems: itemsList, isLoading: itemsLoading } =
		useScoringItems(hackathonId);
	const { guests: guestsList } = useGuests(hackathonId);

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const loading = hackathonLoading || itemsLoading;

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
		...(itemsList || []).map((item) => ({
			id: item.id,
			label: item.name,
			icon: "📋",
			type: "criteria" as const,
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
					{ label: "採点項目" },
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
							<span className={styles.headerTitleEmoji}>📋</span>
							<span>採点項目一覧</span>
						</h1>
						<p className={styles.headerDescription}>評価基準を管理します</p>
					</div>
					<Link href={`/admin/hackathons/${hackathonId}/criteria/new`}>
						<Button variant="primary">➕ 採点項目追加</Button>
					</Link>
				</div>

				{!itemsList || itemsList.length === 0 ? (
					<Card className={styles.emptyCard}>
						<div className={styles.emptyContent}>
							<div className={styles.emptyIcon}>
								<span className={styles.emptyEmoji}>📋</span>
							</div>
							<p className={styles.emptyText}>
								採点項目がまだ登録されていません
							</p>
							<Link href={`/admin/hackathons/${hackathonId}/criteria/new`}>
								<Button variant="primary">➕ 採点項目追加</Button>
							</Link>
						</div>
					</Card>
				) : (
					<div className={styles.criteriaList}>
						{itemsList.map((item) => (
							<Card key={item.id}>
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
												href={`/admin/hackathons/${hackathonId}/criteria/${item.id}`}
											>
												<Button variant="secondary" size="sm">
													✏️ 編集
												</Button>
											</Link>
											<DeleteScoringItemButton
												itemId={item.id}
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
