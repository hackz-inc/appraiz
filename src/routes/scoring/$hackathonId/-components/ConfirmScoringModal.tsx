type Props = {
	onConfirm: () => void;
	onCancel: () => void;
	isSubmitting: boolean;
};

export function ConfirmScoringModal({ onConfirm, onCancel, isSubmitting }: Props) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black bg-opacity-50"
				onClick={onCancel}
			/>

			{/* Modal */}
			<div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
				<h2 className="text-xl font-bold text-gray-900 mb-4">採点データの送信</h2>
				<p className="text-gray-700 mb-6">
					採点データを送信してもよろしいですか？
					<br />
					送信後は変更できません。
				</p>
				<div className="flex gap-4">
					<button
						type="button"
						onClick={onCancel}
						disabled={isSubmitting}
						className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						キャンセル
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isSubmitting}
						className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						{isSubmitting ? "送信中..." : "送信する"}
					</button>
				</div>
			</div>
		</div>
	);
}
