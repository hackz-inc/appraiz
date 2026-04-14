import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Header from "#/components/Header";
import { auth } from "#/lib/auth";
import { redirectIfAuthenticated } from "#/lib/auth/middleware";

export const Route = createFileRoute("/guest/login/")({
	beforeLoad: async () => {
		return await redirectIfAuthenticated();
	},
	component: GuestLoginPage,
});

function GuestLoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const { user, error: signInError } = await auth.signIn({
				email,
				password,
				role: "guest",
			});

			if (signInError) {
				setError(signInError.message);
				setLoading(false);
				return;
			}

			if (user) {
				// Force full page reload to ensure session is properly initialized
				window.location.href = "/guest";
			}
		} catch (err) {
			setError("ログインに失敗しました");
			setLoading(false);
		}
	};

	return (
		<>
			<Header />

			<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
				<div className="max-w-md w-full">
					<div className="bg-white rounded-lg shadow-md p-8">
						<h1 className="text-2xl font-bold text-center mb-6">
							ゲストログイン
						</h1>

						{error && (
							<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-bold text-gray-700 mb-1"
								>
									メールアドレス
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-bold text-gray-700 mb-1"
								>
									パスワード
								</label>
								<input
									type="password"
									id="password"
									name="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
									required
								/>
							</div>

							<button
								type="submit"
								disabled={loading}
								className="w-full h-11 flex justify-center items-center rounded-tl-[26px] rounded-bl-none rounded-br-[26px] rounded-tr-none text-base font-bold cursor-pointer border-2 border-yellow-500 shadow-md bg-gradient-to-r from-white from-0% via-white via-50% to-yellow-500 to-50% bg-[length:200%_auto] bg-right hover:bg-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{loading ? "ログイン中..." : "ログイン"}
							</button>
						</form>

						<div className="mt-6 text-center">
							<p className="text-sm text-gray-600">
								アカウントをお持ちでない方は
								<a
									href="/guest/signUp"
									className="text-yellow-600 hover:text-yellow-700 font-bold ml-1"
								>
									新規登録
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
