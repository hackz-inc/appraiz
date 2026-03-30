"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, TextInput, Container, Card } from "@/components/ui";
import { auth } from "@/lib/auth";

export default function GuestSignUpPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		companyName: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validation
		if (formData.password !== formData.confirmPassword) {
			setError("パスワードが一致しません");
			return;
		}

		if (formData.password.length < 6) {
			setError("パスワードは6文字以上で入力してください");
			return;
		}

		setLoading(true);

		try {
			const { user, error: signUpError } = await auth.signUp({
				email: formData.email,
				password: formData.password,
				name: formData.name,
				company_name: formData.companyName,
				role: "guest",
			});

			if (signUpError) {
				setError(signUpError.message);
				setLoading(false);
				return;
			}

			if (user) {
				router.push("/guest");
				router.refresh();
			}
		} catch (err) {
			setError("登録に失敗しました");
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--blue)] to-[var(--yellow-lighten1)] p-4 pt-12 pb-12">
			<Container maxWidth="sm">
				<Card className="w-full">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-[var(--black-primary)] mb-2">
							Appraiz
						</h1>
						<p className="text-lg text-[var(--black-lighten1)]">ゲスト新規登録</p>
					</div>

					<form onSubmit={handleSubmit} className="flex flex-col gap-6">
						{error && (
							<div className="p-4 bg-[var(--red)] bg-opacity-10 border border-[var(--red)] rounded-md text-[var(--red)] text-sm">
								{error}
							</div>
						)}

						<TextInput
							type="text"
							label="お名前"
							placeholder="山田太郎"
							value={formData.name}
							onChange={(e) => handleChange("name", e.target.value)}
							required
							fullWidth
						/>

						<TextInput
							type="email"
							label="メールアドレス"
							placeholder="guest@example.com"
							value={formData.email}
							onChange={(e) => handleChange("email", e.target.value)}
							required
							fullWidth
						/>

						<TextInput
							type="text"
							label="会社名"
							placeholder="株式会社○○"
							value={formData.companyName}
							onChange={(e) => handleChange("companyName", e.target.value)}
							required
							fullWidth
						/>

						<TextInput
							type="password"
							label="パスワード"
							placeholder="••••••••"
							value={formData.password}
							onChange={(e) => handleChange("password", e.target.value)}
							required
							fullWidth
						/>

						<TextInput
							type="password"
							label="パスワード（確認）"
							placeholder="••••••••"
							value={formData.confirmPassword}
							onChange={(e) => handleChange("confirmPassword", e.target.value)}
							required
							fullWidth
						/>

						<Button
							type="submit"
							variant="primary"
							size="lg"
							isLoading={loading}
							fullWidth
						>
							登録
						</Button>
					</form>

					<div className="mt-6 text-center flex flex-col gap-2">
						<p className="text-sm text-[var(--black-lighten1)]">
							既にアカウントをお持ちの方は
							<Link
								href="/guest/auth/login"
								className="ml-1 text-[var(--blue)] no-underline hover:underline"
							>
								ログイン
							</Link>
						</p>
						<a
							href="/"
							className="block text-sm text-[var(--black-lighten1)] no-underline transition-colors hover:text-[var(--black-primary)]"
						>
							ホームに戻る
						</a>
					</div>
				</Card>
			</Container>
		</div>
	);
}
