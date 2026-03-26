"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, TextInput, Container, Card } from "@/components/ui";
import { auth } from "@/lib/auth";
import styles from "./index.module.css";

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
		<div className={styles.pageContainer}>
			<Container maxWidth="sm">
				<Card className={styles.card}>
					<div className={styles.header}>
						<h1 className={styles.title}>
							Appraiz
						</h1>
						<p className={styles.subtitle}>ゲスト新規登録</p>
					</div>

					<form onSubmit={handleSubmit} className={styles.form}>
						{error && (
							<div className={styles.errorMessage}>
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

					<div className={styles.footer}>
						<p className={styles.footerText}>
							既にアカウントをお持ちの方は
							<Link
								href="/guest/auth/login"
								className={styles.loginLink}
							>
								ログイン
							</Link>
						</p>
						<a
							href="/"
							className={styles.homeLink}
						>
							ホームに戻る
						</a>
					</div>
				</Card>
			</Container>
		</div>
	);
}
