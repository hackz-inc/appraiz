"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextInput, Container, Card } from "@/components/ui";
import { auth } from "@/lib/auth";

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
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-yellow-primary)] to-[var(--color-yellow-lighten1)] p-16">
			<Container maxWidth="sm">
				<Card>
					<div className="text-center mb-32">
						<h1 className="text-6xl font-bold text-[var(--color-black-primary)] mb-8">
							Appraiz
						</h1>
						<p className="text-[1.8rem] text-[var(--color-black-lighten1)]">管理者ログイン</p>
					</div>

					<form onSubmit={handleSubmit} className="flex flex-col gap-24">
						{error && (
							<div className="p-16 bg-[var(--color-red)] opacity-10 border border-[var(--color-red)] rounded text-[var(--color-red)] text-[1.4rem]">
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

					<div className="mt-24 text-center">
						<a href="/" className="text-[1.4rem] text-[var(--color-black-lighten1)] no-underline transition-colors hover:text-[var(--color-black-primary)]">
							ホームに戻る
						</a>
					</div>
				</Card>
			</Container>
		</div>
	);
}
