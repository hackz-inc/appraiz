"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Button, Card, TextArea } from "@/components/ui";
import { AccessPasswordGuard } from "@/components/guards";
import { hackathons, type Hackathon } from "@/lib/hackathons";
import { teams, type Team } from "@/lib/teams";
import { scoringItems, scoring, type ScoringItem } from "@/lib/scoring";

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
			<div className="min-h-screen flex items-center justify-center">
				<div className="inline-block animate-spin h-12 w-12 border-4 border-yellow-primary border-t-transparent rounded-full" />
			</div>
		);
	}

	if (!hackathon) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card>
					<p className="text-center">ハッカソンが見つかりません</p>
				</Card>
			</div>
		);
	}

	if (teamList.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card>
					<p className="text-center">チームが登録されていません</p>
				</Card>
			</div>
		);
	}

	if (itemsList.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card>
					<p className="text-center">採点項目が登録されていません</p>
				</Card>
			</div>
		);
	}

	const currentTeam = teamList[currentTeamIndex];

	return (
		<div className="min-h-screen bg-black-lighten5 py-8">
			<Container maxWidth="md">
				<Card className="mb-8">
					<h1 className="text-3xl font-bold text-black-primary mb-2">
						{hackathon.name} - スコアリング
					</h1>
					<p className="text-sm text-black-lighten1 mb-4">
						チーム {currentTeamIndex + 1} / {teamList.length}
					</p>

					{!judgeName && (
						<div className="mb-4">
							<label className="block text-sm font-medium text-black-primary mb-2">
								審査員名
							</label>
							<input
								type="text"
								className="w-full px-4 py-2 border border-black-lighten3 rounded focus:outline-none focus:ring-2 focus:ring-yellow-primary"
								placeholder="あなたの名前を入力してください"
								value={judgeName}
								onChange={(e) => setJudgeName(e.target.value)}
							/>
						</div>
					)}
				</Card>

				{message && (
					<div
						className={`mb-4 p-4 rounded text-sm ${
							message.includes("失敗") || message.includes("入力")
								? "bg-red bg-opacity-10 border border-red text-red"
								: "bg-yellow-lighten2 bg-opacity-20 border border-yellow-primary text-black-primary"
						}`}
					>
						{message}
					</div>
				)}

				<Card className="mb-6">
					<h2 className="text-2xl font-bold text-black-primary mb-6">
						{currentTeam.name}
					</h2>

					<div className="space-y-6">
						{itemsList.map((item) => {
							const currentScore = scoreInputs[item.id];

							return (
								<div
									key={item.id}
									className="border-t border-black-lighten3 pt-4 first:border-t-0 first:pt-0"
								>
									<div className="flex items-center justify-between mb-3">
										<h3 className="font-bold text-black-primary text-lg">
											{item.name}
										</h3>
										<div className="text-sm text-black-lighten1">
											最大: {item.max_score}点
										</div>
									</div>

									<div className="flex flex-wrap gap-2">
										{Array.from(
											{ length: item.max_score + 1 },
											(_, i) => i,
										).map((score) => (
											<button
												type="button"
												key={score}
												onClick={() => handleScoreChange(item.id, score)}
												className={`px-6 py-3 rounded-lg font-bold transition-all ${
													currentScore === score
														? "bg-yellow-primary text-white shadow-lg scale-105"
														: "bg-white border-2 border-black-lighten3 text-black-primary hover:bg-black-lighten5 hover:border-yellow-primary"
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

					<div className="mt-6 pt-6 border-t border-black-lighten3">
						<label className="block text-sm font-medium text-black-primary mb-2">
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
