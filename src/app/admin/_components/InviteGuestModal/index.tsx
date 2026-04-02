"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextInput, Modal } from "@/components/ui";

type Props = {
	hackathonId: string;
	isOpen: boolean;
};

export const InviteGuestModal = ({ hackathonId, isOpen }: Props) => {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleClose = () => {
		setEmail("");
		setError("");
		setLoading(false);
		setSuccess(false);
		router.push("/admin");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setError("");
		setLoading(true);
		setSuccess(false);

		try {
			// TODO: API呼び出しでゲストを招待
			// const result = await inviteGuest(hackathonId, email);

			// 仮の実装：成功したことにする
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setSuccess(true);
			setEmail("");

			// 2秒後にモーダルを閉じる
			setTimeout(() => {
				handleClose();
			}, 2000);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "招待メールの送信に失敗しました",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="ゲストを招待" size="md">
			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				{error && (
					<div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
						{error}
					</div>
				)}

				{success && (
					<div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm">
						招待メールを送信しました
					</div>
				)}

				<div className="p-4 bg-gray-50 rounded-md">
					<p className="text-sm text-gray-600 mb-1">ハッカソンID</p>
					<p className="font-bold text-gray-900">{hackathonId}</p>
				</div>

				<TextInput
					type="email"
					label="ゲストのメールアドレス"
					placeholder="guest@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					fullWidth
					disabled={success}
				/>

				<div className="flex gap-4">
					<Button
						type="button"
						variant="secondary"
						size="lg"
						onClick={handleClose}
						fullWidth
						disabled={loading}
					>
						キャンセル
					</Button>
					<Button
						type="submit"
						variant="primary"
						size="lg"
						isLoading={loading}
						fullWidth
						disabled={success}
					>
						招待メールを送信
					</Button>
				</div>
			</form>
		</Modal>
	);
};
