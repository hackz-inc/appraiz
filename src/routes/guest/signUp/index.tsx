import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Header from "#/components/Header";
import { signUpGuest } from "../-functions/auth";

export const Route = createFileRoute("/guest/signUp/")({
	component: GuestSignUpPage,
});

function GuestSignUpPage() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
		company_name: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// バリデーション
		if (!formData.email || !formData.password || !formData.name || !formData.company_name) {
			setError("すべての項目を入力してください");
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError("パスワードが一致しません");
			return;
		}

		if (formData.password.length < 6) {
			setError("パスワードは6文字以上で入力してください");
			return;
		}

		setIsLoading(true);

		try {
			await signUpGuest({
				data: {
					email: formData.email,
					password: formData.password,
					name: formData.name,
					company_name: formData.company_name,
				},
			});

			// サインアップ成功後、ログインページへリダイレクト
			navigate({ to: "/guest/login" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "サインアップに失敗しました");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Header />

			<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
				<div className="max-w-md w-full">
					<div className="bg-white rounded-lg shadow-md p-8">
						<h1 className="text-2xl font-bold text-center mb-6">
							ゲストアカウント作成
						</h1>

						{error && (
							<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-bold text-gray-700 mb-1"
								>
									お名前
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="company_name"
									className="block text-sm font-bold text-gray-700 mb-1"
								>
									会社名
								</label>
								<input
									type="text"
									id="company_name"
									name="company_name"
									value={formData.company_name}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
									required
								/>
							</div>

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
									value={formData.email}
									onChange={handleChange}
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
									value={formData.password}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
									required
									minLength={6}
								/>
							</div>

							<div>
								<label
									htmlFor="confirmPassword"
									className="block text-sm font-bold text-gray-700 mb-1"
								>
									パスワード（確認）
								</label>
								<input
									type="password"
									id="confirmPassword"
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
									required
									minLength={6}
								/>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="w-full h-11 flex justify-center items-center rounded-tl-[26px] rounded-bl-none rounded-br-[26px] rounded-tr-none text-base font-bold cursor-pointer border-2 border-yellow-500 shadow-md bg-gradient-to-r from-white from-0% via-white via-50% to-yellow-500 to-50% bg-[length:200%_auto] bg-right hover:bg-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? "作成中..." : "アカウント作成"}
							</button>
						</form>

						<div className="mt-6 text-center">
							<p className="text-sm text-gray-600">
								すでにアカウントをお持ちの方は
								<a
									href="/guest/login"
									className="text-yellow-600 hover:text-yellow-700 font-bold ml-1"
								>
									ログイン
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
