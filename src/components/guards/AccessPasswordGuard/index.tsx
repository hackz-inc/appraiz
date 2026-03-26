"use client";

import { useState, useEffect } from "react";
import { Card, Button, TextInput, Container } from "@/components/ui";
import { hackathons } from "@/lib/hackathons";
import styles from "./index.module.css";

interface AccessPasswordGuardProps {
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
			<div className={styles.loadingContainer}>
				<div className={styles.spinner} />
			</div>
		);
	}

	// Show password prompt if not verified
	if (!isVerified) {
		return (
			<div className={styles.pageContainer}>
				<Container maxWidth="sm">
					<Card className={styles.card}>
						<div className={styles.header}>
							<div className={styles.iconContainer}>
								<span className={styles.icon}>🔒</span>
							</div>
							<h1 className={styles.title}>
								アクセスパスワード
							</h1>
							<p className={styles.subtitle}>
								このハッカソンにアクセスするにはパスワードが必要です
							</p>
						</div>

						<form onSubmit={handleSubmit} className={styles.form}>
							{error && (
								<div className={styles.errorMessage}>
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
