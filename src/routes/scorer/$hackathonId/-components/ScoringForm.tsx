import { useState } from "react";
import type { Database } from "#/lib/supabase/client";
import { createClient } from "#/lib/supabase/client";
import { ConfirmScoringModal } from "./ConfirmScoringModal";
import { ScoringFormItem } from "./ScoringFormItem";

type Hackathon = Database["public"]["Tables"]["hackathon"]["Row"];
type Team = Database["public"]["Tables"]["team"]["Row"];
type ScoringItem = Database["public"]["Tables"]["scoring_item"]["Row"];

type TeamWithOrder = Team & {
	order: number;
};

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

	// Initialize scoring data
	const [scoringData, setScoringData] = useState<ScoringFormData[]>(() => {
		const stored = localStorage.getItem(
			`${STORAGE_KEY_PREFIX}${hackathon.id}_data`,
		);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				// Fall through to initialize new data
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
			const supabase = createClient();

			// Create scoring results for each team
			for (const team of scoringData) {
				// Insert scoring result
				const { data: scoringResults, error: resultError } = await supabase
					.from("scoring_result")
					.insert({
						judge_name: judgeName,
						comment: team.comment,
						team_id: team.teamId,
					})
					.select();

				if (resultError) throw resultError;
				if (!scoringResults || scoringResults.length === 0) {
					throw new Error("採点結果の作成に失敗しました");
				}

				const scoringResult = scoringResults[0];

				// Insert scoring item results
				const itemResults = team.scoringItems.map((item) => ({
					score: item.score,
					scoring_item_id: item.id,
					scoring_result_id: scoringResult.id,
				}));

				const { error: itemsError } = await supabase
					.from("scoring_item_result")
					.insert(itemResults);

				if (itemsError) throw itemsError;
			}

			// Clear localStorage
			localStorage.removeItem(
				`${STORAGE_KEY_PREFIX}${hackathon.id}_judge_name`,
			);
			localStorage.removeItem(`${STORAGE_KEY_PREFIX}${hackathon.id}_data`);

			// Redirect to completion page (or show success message)
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
			{/* Judge Name Input */}
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

			{/* Scoring Form Items */}
			{scoringData.map((team) => (
				<ScoringFormItem
					key={team.teamId}
					team={team}
					onScoreChange={handleScoreChange}
					onCommentChange={handleCommentChange}
				/>
			))}

			{/* Action Buttons */}
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

			{/* Temporary Save Button (Fixed Position) */}
			<button
				type="button"
				onClick={handleSave}
				className="fixed right-20 lg:right-40 bottom-20 bg-gradient-to-r from-gray-600 to-gray-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all"
			>
				一時保存
			</button>

			{/* Confirmation Modal */}
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
