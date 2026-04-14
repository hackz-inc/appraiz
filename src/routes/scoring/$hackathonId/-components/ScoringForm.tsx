import { useState } from "react";
import type { Database } from "#/lib/supabase/client";
import { ScoringFormItem } from "./ScoringFormItem";
import { ConfirmScoringModal } from "./ConfirmScoringModal";
import { createClient } from "#/lib/supabase/client";

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
		const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${hackathon.id}_judge_name`);
		return stored || "";
	});
	const [judgeNameError, setJudgeNameError] = useState("");
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Initialize scoring data
	const [scoringData, setScoringData] = useState<ScoringFormData[]>(() => {
		const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${hackathon.id}_data`);
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

	const handleScoreChange = (teamId: string, scoringItemId: string, score: number) => {
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
			prev.map((team) => (team.teamId === teamId ? { ...team, comment } : team)),
		);
	};

	const handleSave = () => {
		localStorage.setItem(`${STORAGE_KEY_PREFIX}${hackathon.id}_judge_name`, judgeName);
		localStorage.setItem(`${STORAGE_KEY_PREFIX}${hackathon.id}_data`, JSON.stringify(scoringData));
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
				const { data: scoringResult, error: resultError } = await supabase
					.from("scoring_result")
					.insert({
						judge_name: judgeName,
						comment: team.comment,
						team_id: team.teamId,
					})
					.select()
					.single();

				if (resultError) throw resultError;

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
			localStorage.removeItem(`${STORAGE_KEY_PREFIX}${hackathon.id}_judge_name`);
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
		<div className="space-y-8">
			{/* Judge Name Input */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<label htmlFor="judge-name" className="block text-sm font-medium text-gray-700 mb-2">
					名前・会社名
				</label>
				<input
					id="judge-name"
					type="text"
					value={judgeName}
					onChange={(e) => handleJudgeNameChange(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				{judgeNameError && (
					<p className="mt-2 text-sm text-red-600">{judgeNameError}</p>
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
			<div className="flex flex-col gap-4 sticky bottom-4">
				<button
					type="button"
					onClick={handleConfirm}
					disabled={isSubmitting}
					className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
				>
					{isSubmitting ? "送信中..." : "採点データを送信"}
				</button>
				<button
					type="button"
					onClick={handleSave}
					className="w-full bg-gray-600 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700"
				>
					一時保存
				</button>
			</div>

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
