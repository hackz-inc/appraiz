import { useState } from "react";

type Props = {
	hackathonId: string;
	hackathonName: string;
	onSubmit: (password: string) => void;
	onError?: (error: string) => void;
	externalError?: string;
};

export const AccessPasswordForm = ({
	hackathonId,
	hackathonName,
	onSubmit,
	onError,
	externalError,
}: Props) => {
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!password.trim()) {
			setError("パスワードを入力してください");
			return;
		}
		setError("");
		onSubmit(password);
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						{hackathonName}
					</h1>
					<p className="text-gray-600">採点ページへのアクセス</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							アクセスパスワード
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								setError("");
								if (onError) onError("");
							}}
							className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="パスワードを入力"
							autoFocus
						/>
						{(error || externalError) && (
							<p className="mt-2 text-sm text-red-600" role="alert">
								{error || externalError}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
					>
						アクセス
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-gray-500">
						パスワードは主催者から共有されたものを使用してください
					</p>
				</div>
			</div>
		</div>
	);
};
