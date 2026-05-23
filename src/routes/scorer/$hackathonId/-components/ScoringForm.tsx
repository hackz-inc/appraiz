import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getDb } from "#/lib/db/client";
import { scoring_item_result, scoring_result } from "#/lib/db/schema";
import "#/types/cloudflare";
import type { Hackathon, ScoringItem, Team } from "#/lib/db/types";
import { ConfirmScoringModal } from "./ConfirmScoringModal";
import { ScoringFormItem } from "./ScoringFormItem";

type TeamWithOrder = Team & { order: number };

type HackathonWithDetails = Hackathon & {
	teams: TeamWithOrder[];
	scoring_items: ScoringItem[];
};

export type ScoringFormData = {
	teamId: string;
	teamName: string;
	topazLink: string | null;
	order: number;
	comment: string;
	scoringItems: {
		id: string;
		name: string;
		maxScore: number;
		score: number;
	}[];
};

type Props = {
	hackathon: HackathonWithDetails;
};

const STORAGE_KEY_PREFIX = "hackathon_scoring_";

type SubmitScoringInput = { judgeName: string; scoringData: ScoringFormData[] };

const submitScoringFn = createServerFn({ method: "POST" })
	.inputValidator((data: SubmitScoringInput) => data)
	.handler(async (ctx) => {
		const { judgeName, scoringData } = ctx.data;
		// biome-ignore lint/style/noNonNullAssertion: always set in Cloudflare Worker
		const db = getDb(ctx.context!);

		for (const team of scoringData) {
			const resultId = crypto.randomUUID();
			await db.insert(scoring_result).values({
				id: resultId,
				judge_name: judgeName,
				comment: team.comment,
				team_id: team.teamId,
			});

			if (team.scoringItems.length > 0) {
				await db.insert(scoring_item_result).values(
					team.scoringItems.map((item) => ({
						id: crypto.randomUUID(),
						score: item.score,
						scoring_item_id: item.id,
						scoring_result_id: resultId,
					})),
				);
			}
		}

		return { success: true };
	});

export function ScoringForm({ hackathon }: Props) {
	const [judgeName, setJudgeName] = useState(() => {
		const stored = localStorage.getItem(
			`${STORAGE_KEY_PREFIX}${hackathon.id}_judge_name`,
		);
		return stored || "";
	});
	const [judgeNameError, setJudgeNameError] = useState("");
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [scoringData, setScoringData] = useState<ScoringFormData[]>(() => {
		const stored = localStorage.getItem(
			`${STORAGE_KEY_PREFIX}${hackathon.id}_data`,
		);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				// fall through
			}
		}
		return hackathon.teams.map((team) => ({
			teamId: team.id,
			teamName: team.name,
			topazLink: team.topaz_link,
			order: team.order,
			comment: "",
			scoringItems: hackathon.scoring_items.map((item) => ({
				id: item.id,
				name: item.name,
				maxScore: item.max_score,
				score: 0,
			})),
		}));
	});

	const handleJudgeNameChange = (value: string) => {
		if (value.length > 48) {
			setJudgeNameError("最大48文字までです");
			return;
		}
		setJudgeNameError("");
		setJudgeName(value);
	};

	const handleScoreChange = (
		teamId: string,
		scoringItemId: string,
		score: number,
	) => {
		setScoringData((prev) =>
			prev.map((team) =>
				team.teamId === teamId
					? {
							...team,
							scoringItems: team.scoringItems.map((item) =>
								item.id === scoringItemId ? { ...item, score } : item,
							),
						}
					: team,
			),
		);
	};

	const handleCommentChange = (teamId: string, comment: string) => {
		setScoringData((prev) =>
			prev.map((team) =>
				team.teamId === teamId ? { ...team, comment } : team,
			),
		);
	};

	const handleSave = () => {
		localStorage.setItem(
			`${STORAGE_KEY_PREFIX}${hackathon.id}_judge_name`,
			judgeName,
		);
		localStorage.setItem(
			`${STORAGE_KEY_PREFIX}${hackathon.id}_data`,
			JSON.stringify(scoringData),
		);
		alert("一時保存しました");
	};

	const handleConfirm = () => {
		if (!judgeName.trim()) {
			setJudgeNameError("必須項目です");
			window.scrollTo(0, 0);
			return;
		}
		setIsConfirmModalOpen(true);
	};

	const handleSubmit = async () => {
		if (!judgeName.trim()) {
			setJudgeNameError("必須項目です");
			window.scrollTo(0, 0);
			return;
		}

		setIsSubmitting(true);

		try {
			await submitScoringFn({ data: { judgeName, scoringData } });

			localStorage.removeItem(
				`${STORAGE_KEY_PREFIX}${hackathon.id}_judge_name`,
			);
			localStorage.removeItem(`${STORAGE_KEY_PREFIX}${hackathon.id}_data`);

			alert("採点データを送信しました");
			window.location.href = "/";
		} catch (error) {
			console.error(error);
			alert("送信に失敗しました");
		} finally {
			setIsSubmitting(false);
			setIsConfirmModalOpen(false);
		}
	};

	return (
		<div className="pt-30 space-y-0">
			<div className="w-full max-w-[800px] mx-auto py-12 border-b border-gray-300">
				<label
					htmlFor="judge-name"
					className="block text-base font-bold leading-7 text-gray-700 tracking-wide mb-0"
				>
					名前・会社名
				</label>
				<input
					id="judge-name"
					type="text"
					value={judgeName}
					onChange={(e) => handleJudgeNameChange(e.target.value)}
					className="w-[calc(100%-96px)] mx-auto mt-5 block px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				{judgeNameError && (
					<p className="w-[calc(100%-96px)] mx-auto mt-2 text-sm text-red-600">
						{judgeNameError}
					</p>
				)}
			</div>

			{scoringData.map((team) => (
				<ScoringFormItem
					key={team.teamId}
					team={team}
					onScoreChange={handleScoreChange}
					onCommentChange={handleCommentChange}
				/>
			))}

			<div className="w-full max-w-[800px] mx-auto mt-12 mb-20">
				<button
					type="button"
					onClick={handleConfirm}
					disabled={isSubmitting}
					className="w-full max-w-md mx-auto block bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-[26px_0_26px_26px] text-base font-bold shadow-md hover:shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{isSubmitting ? "送信中..." : "採点データを送信"}
				</button>
			</div>

			<button
				type="button"
				onClick={handleSave}
				className="fixed right-20 lg:right-40 bottom-20 bg-gradient-to-r from-gray-600 to-gray-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all"
			>
				一時保存
			</button>

			{isConfirmModalOpen && (
				<ConfirmScoringModal
					onConfirm={handleSubmit}
					onCancel={() => setIsConfirmModalOpen(false)}
					isSubmitting={isSubmitting}
				/>
			)}
		</div>
	);
}
