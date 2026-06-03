import { Modal } from "#/components/ui/Modal";
import { Button } from "#/components/ui/Button";

type Props = {
	onConfirm: () => void;
	onCancel: () => void;
	isSubmitting: boolean;
};

export function ConfirmScoringModal({ onConfirm, onCancel, isSubmitting }: Props) {
	return (
		<Modal isOpen onClose={onCancel} title="採点データの送信" size="sm">
			<p className="text-gray-700 mb-6">
				採点データを送信してもよろしいですか？
				<br />
				送信後は変更できません。
			</p>
			<div className="flex gap-3">
				<Button
					type="button"
					variant="secondary"
					fullWidth
					onClick={onCancel}
					disabled={isSubmitting}
				>
					キャンセル
				</Button>
				<Button
					type="button"
					variant="primary"
					fullWidth
					isLoading={isSubmitting}
					onClick={onConfirm}
				>
					送信する
				</Button>
			</div>
		</Modal>
	);
}
