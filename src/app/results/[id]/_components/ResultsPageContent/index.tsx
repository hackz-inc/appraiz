"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Card } from "@/components/ui";
import { AccessPasswordGuard } from "@/components/guards";
import { hackathons, type Hackathon } from "@/lib/hackathons";
import { scoring, type TeamScoreResult } from "@/lib/scoring";

const ResultsPageContent = () => {
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
			<div className="min-h-screen flex items-center justify-center">
				<div className="inline-block w-12 h-12 border-4 border-[var(--yellow-primary)] border-t-transparent rounded-full animate-spin" />
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

	return (
		<div className="min-h-screen bg-[var(--black-lighten5)] pt-8 pb-8">
			<Container>
				<Card className="mb-8 text-center">
					<h1 className="text-4xl font-bold text-[var(--black-primary)] mb-2">
						{hackathon.name}
					</h1>
					<p className="text-xl text-[var(--black-lighten1)]">最終結果</p>
				</Card>

				{results.length === 0 ? (
					<Card>
						<p className="text-center text-[var(--black-lighten1)]">
							まだスコアが入力されていません
						</p>
					</Card>
				) : (
					<div className="flex flex-col gap-6">
						{results.map((result, index) => (
							<Card
								key={result.team_id}
								className={
									index === 0
										? 'border-4 border-[var(--yellow-primary)]'
										: index === 1
											? 'border-2 border-[var(--black-lighten2)]'
											: index === 2
												? 'border-2 border-[var(--black-lighten3)]'
												: ''
								}
							>
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-4">
										<div
											className={`text-4xl font-bold ${
												index === 0
													? 'text-[var(--yellow-primary)]'
													: 'text-[var(--black-lighten2)]'
											}`}
										>
											#{index + 1}
										</div>
										<div>
											<h2 className="text-2xl font-bold text-[var(--black-primary)]">
												{result.team_name}
											</h2>
											<p className="text-sm text-[var(--black-lighten1)]">合計スコア</p>
										</div>
									</div>
									<div className="text-right">
										<div className="text-4xl font-bold text-[var(--yellow-primary)]">
											{result.total_score.toFixed(2)}
										</div>
										<p className="text-sm text-[var(--black-lighten1)]">点</p>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
									{result.item_scores.map((item) => (
										<div
											key={item.item_id}
											className="bg-[var(--black-lighten5)] rounded-md p-4"
										>
											<div className="text-sm font-bold text-[var(--black-primary)] mb-1">
												{item.item_name}
											</div>
											<div className="flex items-end gap-2">
												<div className="text-2xl font-bold text-[var(--yellow-primary)]">
													{item.average_score.toFixed(1)}
												</div>
												<div className="text-sm text-[var(--black-lighten1)] mb-1">
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

const ResultsPage = () => {
	const params = useParams();
	const hackathonId = params.id as string;

	return (
		<AccessPasswordGuard hackathonId={hackathonId}>
			<ResultsPageContent />
		</AccessPasswordGuard>
	);
}

export default ResultsPage;
