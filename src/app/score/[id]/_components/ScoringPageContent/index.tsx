"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Button, Card, TextArea } from "@/components/ui";
import { AccessPasswordGuard } from "@/components/guards";
import { hackathons, type Hackathon } from "@/lib/hackathons";
import { teams, type Team } from "@/lib/teams";
import { scoringItems, scoring, type ScoringItem } from "@/lib/scoring";

const ScoringPageContent = () => {
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

	const createInitialScores = (items: ScoringItem[]) =>
		items.reduce<Record<string, number>>((acc, item) => {
			acc[item.id] = 0;
			return acc;
		}, {});

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
			setScoreInputs(createInitialScores(items));
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
					setScoreInputs(createInitialScores(itemsList));
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
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-yellow)] to-[var(--color-yellow-light1)]">
				<div className="inline-block w-12 h-12 border-4 border-[var(--color-black)] border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!hackathon) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-yellow)] to-[var(--color-yellow-light1)] p-8">
				<Card>
					<p className="text-center text-[var(--color-black)]">
						ハッカソンが見つかりません
					</p>
				</Card>
			</div>
		);
	}

	if (teamList.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-yellow)] to-[var(--color-yellow-light1)] p-8">
				<Card>
					<p className="text-center text-[var(--color-black)]">
						チームが登録されていません
					</p>
				</Card>
			</div>
		);
	}

	if (itemsList.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-yellow)] to-[var(--color-yellow-light1)] p-8">
				<Card>
					<p className="text-center text-[var(--color-black)]">
						採点項目が登録されていません
					</p>
				</Card>
			</div>
		);
	}

	const currentTeam = teamList[currentTeamIndex];
	const isError = message.includes("失敗") || message.includes("入力");
	const totalScore = itemsList.reduce(
		(sum, item) => sum + (scoreInputs[item.id] ?? 0),
		0,
	);
	const maxTotalScore = itemsList.reduce((sum, item) => sum + item.max_score, 0);

	return (
		<div className="min-h-screen bg-[var(--color-white)] py-10">
			<Container maxWidth="xl">
				<div className="rounded-2xl bg-[var(--color-white)] px-4 sm:px-8 py-6">
					<div className="mb-6 flex items-start justify-between gap-4">
						<div>
							<p className="text-2xl sm:text-5xl font-bold text-[var(--color-black)] leading-tight">
								No.{currentTeamIndex + 1} : {currentTeam.name}
							</p>
							<p className="mt-4 text-2xl font-bold text-[var(--color-blue)]">URL</p>
							<p className="mt-4 text-base sm:text-lg text-[var(--color-black-light1)]">
								{hackathon.name}
							</p>
						</div>
						<p className="text-5xl sm:text-7xl font-extrabold text-[var(--color-yellow)] leading-none whitespace-nowrap">
							{totalScore}点
						</p>
					</div>

					{!judgeName && (
						<div className="mb-5 max-w-[420px]">
							<label className="mb-2 block text-sm font-semibold text-[var(--color-black)]">
								審査員名
							</label>
							<input
								type="text"
								className="w-full rounded-xl border-2 border-[var(--color-black-light2)] bg-[var(--color-white)] px-4 py-3 text-base focus:outline-none focus:shadow-[0_0_0_2px_var(--color-yellow)]"
								placeholder="あなたの名前を入力してください"
								value={judgeName}
								onChange={(e) => setJudgeName(e.target.value)}
							/>
						</div>
					)}

					{message && (
						<div
							className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
								isError
									? 'border-[var(--color-red)] bg-[rgba(235,83,83,0.12)] text-[var(--color-red)]'
									: 'border-[var(--color-yellow)] bg-[rgba(250,190,0,0.18)] text-[var(--color-black)]'
							}`}
						>
							{message}
						</div>
					)}

					<div className="space-y-8">
						{itemsList.map((item) => {
							const currentScore = scoreInputs[item.id] ?? 0;
							const scoreRate = (currentScore / item.max_score) * 100;

							return (
								<div key={item.id}>
									<p className="mb-4 text-2xl sm:text-4xl font-bold text-[var(--color-black-light1)]">
										{item.name}
									</p>
									<div className="flex items-center gap-4 sm:gap-8">
										<div className="flex-1 pt-2">
											<input
												type="range"
												min={0}
												max={item.max_score}
												step={1}
												value={currentScore}
												onChange={(e) =>
													handleScoreChange(item.id, Number(e.target.value))
												}
												style={{
													background: `linear-gradient(to right, var(--color-yellow) ${scoreRate}%, var(--color-black-light2) ${scoreRate}%)`,
												}}
												className="h-2 w-full appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-yellow)] [&::-webkit-slider-thumb]:shadow-[0_2px_6px_rgba(0,0,0,0.2)] [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-yellow)]"
											/>
										</div>

										<div className="w-[180px] shrink-0">
											<div className="flex items-end justify-end gap-3 leading-none">
												<p className="text-5xl sm:text-6xl font-extrabold text-[var(--color-yellow)]">
													{currentScore}
												</p>
												<div className="h-12 w-[4px] rotate-[35deg] rounded-full bg-[var(--color-black-light2)]" />
												<p className="text-4xl sm:text-5xl font-bold text-[var(--color-black-light2)]">
													{item.max_score}
												</p>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					<div className="mt-8 flex justify-end">
						<Button
							variant="primary"
							size="lg"
							onClick={handleSubmit}
							isLoading={saving}
							disabled={!judgeName.trim()}
							className="h-16 min-w-[240px] rounded-full px-12 text-3xl font-bold shadow-[0_8px_14px_rgba(0,0,0,0.15)] text-[var(--color-black)] disabled:opacity-100"
							style={{
								backgroundColor: "#ffb300",
								color: "var(--color-black)",
								borderColor: "#ffb300",
								filter: "saturate(1.25)",
							}}
						>
							{currentTeamIndex < teamList.length - 1
								? "一時保存"
								: "採点完了"}
						</Button>
					</div>

					<div className="mt-8 border-t border-[var(--color-black-light2)] pt-6">
						<label className="mb-3 block text-2xl sm:text-4xl font-bold text-[var(--color-black-light1)]">
							一言コメント
						</label>
						<TextArea
							placeholder="コメントを入力"
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							rows={4}
							fullWidth
							className="rounded-2xl border-4 border-[var(--color-black)] bg-[var(--color-black-light4)] text-lg"
							style={{ backgroundColor: "var(--color-black-light4)" }}
						/>
					</div>
				</div>
			</Container>
		</div>
	);
}

const ScoringPage = () => {
	const params = useParams();
	const hackathonId = params.id as string;

	return (
		<AccessPasswordGuard hackathonId={hackathonId}>
			<ScoringPageContent />
		</AccessPasswordGuard>
	);
}

export default ScoringPage;
