"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Button, Card, TextArea } from "@/components/ui";
import { AccessPasswordGuard } from "@/components/guards";
import { hackathons, type Hackathon } from "@/lib/hackathons";
import { teams, type Team } from "@/lib/teams";
import { scoringItems, scoring, type ScoringItem } from "@/lib/scoring";
import styles from "./index.module.css";

function ScoringPageContent() {
	const params = useParams();
	const router = useRouter();
	const hackathonId = params.id as string;

	const [hackathon, setHackathon] = useState<Hackathon | null>(null);
	const [teamList, setTeamList] = useState<Team[]>([]);
	const [itemsList, setItemsList] = useState<ScoringItem[]>([]);
	const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
	const [judgeName, setJudgeName] = useState("");
	const [scoreInputs, setScoreInputs] = useState<Record<string, number>>({});
	const [comment, setComment] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const loadData = async () => {
		try {
			const [h, t, items] = await Promise.all([
				hackathons.getById(hackathonId),
				teams.getByHackathon(hackathonId),
				scoringItems.getByHackathon(hackathonId),
			]);
			setHackathon(h);
			setTeamList(t);
			setItemsList(items);
		} catch (error) {
			console.error("Failed to load data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleScoreChange = (itemId: string, score: number) => {
		setScoreInputs((prev) => ({
			...prev,
			[itemId]: score,
		}));
	};

	const handleSubmit = async () => {
		if (!judgeName.trim()) {
			setMessage("審査員名を入力してください");
			return;
		}

		const currentTeam = teamList[currentTeamIndex];
		if (!currentTeam) return;

		// Check if all scores are filled
		const allScoresFilled = itemsList.every(
			(item) => scoreInputs[item.id] !== undefined,
		);

		if (!allScoresFilled) {
			setMessage("全ての項目にスコアを入力してください");
			return;
		}

		setSaving(true);
		setMessage("");

		try {
			await scoring.submitScore({
				judge_name: judgeName.trim(),
				comment: comment.trim(),
				team_id: currentTeam.id,
				scores: itemsList.map((item) => ({
					scoring_item_id: item.id,
					score: scoreInputs[item.id],
				})),
			});

			setMessage("スコアを保存しました");

			// Move to next team or finish
			if (currentTeamIndex < teamList.length - 1) {
				setTimeout(() => {
					setCurrentTeamIndex((prev) => prev + 1);
					setScoreInputs({});
					setComment("");
					setMessage("");
				}, 1000);
			} else {
				setTimeout(() => {
					router.push(`/results/${hackathonId}`);
				}, 2000);
			}
		} catch (error) {
			console.error("Failed to save score:", error);
			setMessage("スコアの保存に失敗しました");
		} finally {
			setSaving(false);
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
					<p className={styles.errorCard}>ハッカソンが見つかりません</p>
				</Card>
			</div>
		);
	}

	if (teamList.length === 0) {
		return (
			<div className={styles.errorContainer}>
				<Card>
					<p className={styles.errorCard}>チームが登録されていません</p>
				</Card>
			</div>
		);
	}

	if (itemsList.length === 0) {
		return (
			<div className={styles.errorContainer}>
				<Card>
					<p className={styles.errorCard}>採点項目が登録されていません</p>
				</Card>
			</div>
		);
	}

	const currentTeam = teamList[currentTeamIndex];
	const isError = message.includes("失敗") || message.includes("入力");

	return (
		<div className={styles.pageContainer}>
			<Container maxWidth="md">
				<Card className={styles.headerCard}>
					<h1 className={styles.title}>
						{hackathon.name} - スコアリング
					</h1>
					<p className={styles.progressText}>
						チーム {currentTeamIndex + 1} / {teamList.length}
					</p>

					{!judgeName && (
						<div className={styles.judgeNameSection}>
							<label className={styles.label}>
								審査員名
							</label>
							<input
								type="text"
								className={styles.input}
								placeholder="あなたの名前を入力してください"
								value={judgeName}
								onChange={(e) => setJudgeName(e.target.value)}
							/>
						</div>
					)}
				</Card>

				{message && (
					<div
						className={isError ? styles.messageError : styles.messageSuccess}
					>
						{message}
					</div>
				)}

				<Card className={styles.teamCard}>
					<h2 className={styles.teamTitle}>
						{currentTeam.name}
					</h2>

					<div className={styles.itemsList}>
						{itemsList.map((item) => {
							const currentScore = scoreInputs[item.id];

							return (
								<div
									key={item.id}
									className={styles.item}
								>
									<div className={styles.itemHeader}>
										<h3 className={styles.itemName}>
											{item.name}
										</h3>
										<div className={styles.itemMaxScore}>
											最大: {item.max_score}点
										</div>
									</div>

									<div className={styles.scoreButtons}>
										{Array.from(
											{ length: item.max_score + 1 },
											(_, i) => i,
										).map((score) => (
											<button
												type="button"
												key={score}
												onClick={() => handleScoreChange(item.id, score)}
												className={`${styles.scoreButton} ${
													currentScore === score
														? styles.scoreButtonActive
														: styles.scoreButtonInactive
												}`}
											>
												{score}
											</button>
										))}
									</div>
								</div>
							);
						})}
					</div>

					<div className={styles.commentSection}>
						<label className={styles.label}>
							コメント（任意）
						</label>
						<TextArea
							placeholder="このチームに対するコメントを入力してください"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							rows={4}
							fullWidth
						/>
					</div>
				</Card>

				<Button
					variant="primary"
					size="lg"
					onClick={handleSubmit}
					isLoading={saving}
					disabled={!judgeName.trim()}
					fullWidth
				>
					{currentTeamIndex < teamList.length - 1
						? "次のチームへ"
						: "採点を完了"}
				</Button>
			</Container>
		</div>
	);
}

export default function ScoringPage() {
	const params = useParams();
	const hackathonId = params.id as string;

	return (
		<AccessPasswordGuard hackathonId={hackathonId}>
			<ScoringPageContent />
		</AccessPasswordGuard>
	);
}
