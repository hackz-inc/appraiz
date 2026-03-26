"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Card } from "@/components/ui";
import { AccessPasswordGuard } from "@/components/guards";
import { hackathons, type Hackathon } from "@/lib/hackathons";
import { scoring, type TeamScoreResult } from "@/lib/scoring";
import styles from "./index.module.css";

function ResultsPageContent() {
	const params = useParams();
	const hackathonId = params.id as string;

	const [hackathon, setHackathon] = useState<Hackathon | null>(null);
	const [results, setResults] = useState<TeamScoreResult[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadData();
	}, [hackathonId]);

	const loadData = async () => {
		try {
			const [h, r] = await Promise.all([
				hackathons.getById(hackathonId),
				scoring.getHackathonResults(hackathonId),
			]);
			setHackathon(h);
			setResults(r);
		} catch (error) {
			console.error("Failed to load results:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.spinner} />
			</div>
		);
	}

	if (!hackathon) {
		return (
			<div className={styles.errorContainer}>
				<Card>
					<p className={styles.errorText}>ハッカソンが見つかりません</p>
				</Card>
			</div>
		);
	}

	return (
		<div className={styles.pageContainer}>
			<Container>
				<Card className={styles.headerCard}>
					<h1 className={styles.title}>
						{hackathon.name}
					</h1>
					<p className={styles.subtitle}>最終結果</p>
				</Card>

				{results.length === 0 ? (
					<Card>
						<p className={styles.emptyCard}>
							まだスコアが入力されていません
						</p>
					</Card>
				) : (
					<div className={styles.resultsList}>
						{results.map((result, index) => (
							<Card
								key={result.team_id}
								className={`${styles.resultCard} ${
									index === 0
										? styles.resultCardFirst
										: index === 1
											? styles.resultCardSecond
											: index === 2
												? styles.resultCardThird
												: ""
								}`}
							>
								<div className={styles.resultHeader}>
									<div className={styles.resultLeft}>
										<div
											className={`${styles.rank} ${
												index === 0
													? styles.rankFirst
													: styles.rankOther
											}`}
										>
											#{index + 1}
										</div>
										<div className={styles.teamInfo}>
											<h2 className={styles.teamName}>
												{result.team_name}
											</h2>
											<p className={styles.teamLabel}>合計スコア</p>
										</div>
									</div>
									<div className={styles.resultRight}>
										<div className={styles.totalScore}>
											{result.total_score.toFixed(2)}
										</div>
										<p className={styles.scoreLabel}>点</p>
									</div>
								</div>

								<div className={styles.itemScores}>
									{result.item_scores.map((item) => (
										<div
											key={item.item_id}
											className={styles.itemCard}
										>
											<div className={styles.itemName}>
												{item.item_name}
											</div>
											<div className={styles.itemScoreRow}>
												<div className={styles.itemScore}>
													{item.average_score.toFixed(1)}
												</div>
												<div className={styles.itemMaxScore}>
													/ {item.max_score} 点
												</div>
											</div>
										</div>
									))}
								</div>
							</Card>
						))}
					</div>
				)}
			</Container>
		</div>
	);
}

export default function ResultsPage() {
	const params = useParams();
	const hackathonId = params.id as string;

	return (
		<AccessPasswordGuard hackathonId={hackathonId}>
			<ResultsPageContent />
		</AccessPasswordGuard>
	);
}
