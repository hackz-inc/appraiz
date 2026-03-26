"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextInput, Container, Card } from "@/components/ui";
import { auth } from "@/lib/auth";
import styles from './index.module.css';

export default function AdminLoginPage() {
	const router = useRouter();
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
				role: "admin",
			});

			if (signInError) {
				setError(signInError.message);
				setLoading(false);
				return;
			}

			if (user) {
				router.push("/admin");
				router.refresh();
			}
		} catch (err) {
			setError("ログインに失敗しました");
			setLoading(false);
		}
	};

	return (
		<div className={styles.pageContainer}>
			<Container maxWidth="sm">
				<Card>
					<div className={styles.header}>
						<h1 className={styles.title}>
							Appraiz
						</h1>
						<p className={styles.subtitle}>管理者ログイン</p>
					</div>

					<form onSubmit={handleSubmit} className={styles.form}>
						{error && (
							<div className={styles.errorMessage}>
								{error}
							</div>
						)}

						<TextInput
							type="email"
							label="メールアドレス"
							placeholder="admin@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							fullWidth
						/>

						<TextInput
							type="password"
							label="パスワード"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
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
							ログイン
						</Button>
					</form>

					<div className={styles.footer}>
						<a href="/" className={styles.homeLink}>
							ホームに戻る
						</a>
					</div>
				</Card>
			</Container>
		</div>
	);
}
