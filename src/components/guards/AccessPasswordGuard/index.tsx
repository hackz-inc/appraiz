"use client";

import { useState, useEffect } from "react";
import { Card, Button, TextInput, Container } from "@/components/ui";
import { hackathons } from "@/lib/hackathons";

type AccessPasswordGuardProps = {
	hackathonId: string;
	children: React.ReactNode;
}

const STORAGE_KEY_PREFIX = "hackathon_access_";

export function AccessPasswordGuard({
	hackathonId,
	children,
}: AccessPasswordGuardProps) {
	const [isVerified, setIsVerified] = useState<boolean | null>(null);
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const verifyStoredPassword = async (storedPassword: string) => {
			try {
				const isValid = await hackathons.verifyPassword(
					hackathonId,
					storedPassword,
				);
				setIsVerified(isValid);
				if (!isValid) {
					// Clear invalid password
					localStorage.removeItem(`${STORAGE_KEY_PREFIX}${hackathonId}`);
				}
			} catch (err) {
				setIsVerified(false);
				localStorage.removeItem(`${STORAGE_KEY_PREFIX}${hackathonId}`);
			}
		};

		// Check if password is already verified in localStorage
		const storedPassword = localStorage.getItem(
			`${STORAGE_KEY_PREFIX}${hackathonId}`,
		);
		if (storedPassword) {
			verifyStoredPassword(storedPassword);
		} else {
			setIsVerified(false);
		}
	}, [hackathonId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const isValid = await hackathons.verifyPassword(hackathonId, password);

			if (isValid) {
				// Store password in localStorage
				localStorage.setItem(`${STORAGE_KEY_PREFIX}${hackathonId}`, password);
				setIsVerified(true);
			} else {
				setError("アクセスパスワードが正しくありません");
			}
		} catch (err) {
			setError("検証に失敗しました");
		} finally {
			setLoading(false);
		}
	};

	// Loading state while checking stored password
	if (isVerified === null) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--blue)] to-[var(--yellow-lighten1)]">
				<div className="inline-block w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	// Show password prompt if not verified
	if (!isVerified) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--blue)] to-[var(--yellow-lighten1)] p-4">
				<Container maxWidth="sm">
					<Card className="w-full">
						<div className="text-center mb-8">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--yellow-primary)] mb-4">
								<span className="text-3xl">🔒</span>
							</div>
							<h1 className="text-3xl font-bold text-[var(--black-primary)] mb-2">
								アクセスパスワード
							</h1>
							<p className="text-lg text-[var(--black-lighten1)]">
								このハッカソンにアクセスするにはパスワードが必要です
							</p>
						</div>

						<form onSubmit={handleSubmit} className="flex flex-col gap-6">
							{error && (
								<div className="p-4 bg-[var(--red)] bg-opacity-10 border border-[var(--red)] rounded-md text-[var(--red)] text-sm">
									{error}
								</div>
							)}

							<TextInput
								type="text"
								label="アクセスパスワード"
								placeholder="パスワードを入力してください"
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
								アクセス
							</Button>
						</form>
					</Card>
				</Container>
			</div>
		);
	}

	// Verified - show children
	return <>{children}</>;
}
