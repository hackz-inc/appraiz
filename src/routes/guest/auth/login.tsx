import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from "react";
import { Button, TextInput, Container, Card } from "#/components/ui";
import { auth } from "#/lib/auth";

export const Route = createFileRoute('/guest/auth/login')({
  component: GuestLoginPage,
})

function GuestLoginPage() {
	const navigate = useNavigate();
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
				navigate({ to: "/guest" });
			}
		} catch (err) {
			setError("ログインに失敗しました");
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-yellow-200 p-16">
			<Container maxWidth="sm">
				<Card>
					<div className="text-center mb-8">
						<h1 className="text-6xl font-bold text-black mb-2">
							Appraiz
						</h1>
						<p className="text-lg text-gray-600">ゲストログイン</p>
					</div>

					<form onSubmit={handleSubmit} className="flex flex-col gap-6">
						{error && (
							<div className="p-4 bg-red-50 border border-red-500 rounded text-red-500 text-sm">
								{error}
							</div>
						)}

						<TextInput
							type="email"
							label="メールアドレス"
							placeholder="guest@example.com"
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

					<div className="mt-6 text-center flex flex-col gap-2">
						<p className="text-sm text-gray-600">
							アカウントをお持ちでない方は
							<Link
								to="/guest/auth/signup"
								className="ml-1 text-blue-500 no-underline hover:underline"
							>
								新規登録
							</Link>
						</p>
						<Link
							to="/"
							className="block text-sm text-gray-600 no-underline transition-colors hover:text-black"
						>
							ホームに戻る
						</Link>
					</div>
				</Card>
			</Container>
		</div>
	);
}
