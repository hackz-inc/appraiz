"use client";

import { Button, Card } from "@/components/ui";
import Link from "next/link";
import { useHackathons } from "@/hooks/useHackathons";
import { CreateHackathonButton } from "./CreateHackathonButton";
import styles from './HackathonCardList.module.css';

export function HackathonCardList() {
	const { hackathons, isLoading } = useHackathons();

	if (isLoading) {
		return (
			<div className={styles.loading}>
				<div className={styles.loadingContent}>
					<div className={styles.loadingIconWrapper}>
						<div className={styles.loadingPing} />
						<div className={styles.loadingIcon}>
							<span className={styles.loadingEmoji}>⏳</span>
						</div>
					</div>
					<p className={styles.loadingText}>読み込み中...</p>
				</div>
			</div>
		);
	}

	if (!hackathons || hackathons.length === 0) {
		return (
			<Card variant="elevated" className={styles.emptyCard}>
				<div className={styles.emptyContent}>
					<div className={styles.emptyIconWrapper}>
						<div className={styles.emptyIcon}>
							<span className={styles.emptyEmoji}>📋</span>
						</div>
					</div>
					<h3 className={styles.emptyTitle}>
						ハッカソンがまだありません
					</h3>
					<p className={styles.emptyDescription}>
						新しいハッカソンを作成して、チームの評価を始めましょう
					</p>
					<CreateHackathonButton />
				</div>
			</Card>
		);
	}

	return (
		<ul className={styles.list}>
			{hackathons.map((hackathon) => (
				<Link key={hackathon.id} href={`/admin/hackathons/${hackathon.id}`} className={styles.cardLink}>
					<Card variant="elevated" hoverable className={styles.hackathonCard}>
						<div className={styles.cardContent}>
							<div className={styles.iconWrapper}>
								<span className={styles.icon}>🏆</span>
							</div>
							<h3 className={styles.hackathonTitle}>
								{hackathon.name}
							</h3>
							<div className={styles.hackathonMeta}>
								<span>📅</span>
								<span>
									{new Date(hackathon.scoring_date).toLocaleDateString("ja-JP")}
								</span>
							</div>
						</div>
						<div className={styles.buttonGroup}>
							<Button
								variant="primary"
								size="sm"
								fullWidth
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									window.location.href = `/admin/hackathons/${hackathon.id}/settings`;
								}}
							>
								⚙️ 設定
							</Button>
							<Button
								variant="secondary"
								size="sm"
								fullWidth
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									window.location.href = `/admin/hackathons/${hackathon.id}/results`;
								}}
							>
								📊 結果
							</Button>
						</div>
					</Card>
				</Link>
			))}
		</ul>
	);
}
