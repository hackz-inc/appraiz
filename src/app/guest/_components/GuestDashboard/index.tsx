"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GuestAuthGuard } from "@/components/guards";
import { Container, Button, Card } from "@/components/ui";
import { auth } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import styles from "./index.module.css";

interface Hackathon {
	id: string;
	name: string;
	scoring_date: string;
}

function GuestDashboardContent() {
	const router = useRouter();
	const { user } = useAuth();
	const [hackathons, setHackathons] = useState<Hackathon[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadHackathons();
	}, []);

	const loadHackathons = async () => {
		try {
			const supabase = createClient();
			// Load hackathons the guest has access to
			const { data, error } = await supabase
				.from("hackathon")
				.select("id, name, scoring_date")
				.order("scoring_date", { ascending: false });

			if (error) throw error;
			setHackathons(data || []);
		} catch (error) {
			console.error("Failed to load hackathons:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSignOut = async () => {
		await auth.signOut();
		router.push("/guest/auth/login");
		router.refresh();
	};

	return (
		<div className={styles.pageContainer}>
			{/* Header */}
			<header className={styles.header}>
				<Container>
					<div className={styles.headerContent}>
						<div className={styles.headerInfo}>
							<h1 className={styles.headerTitle}>
								Appraiz ゲスト
							</h1>
							<p className={styles.headerUser}>
								{user?.metadata?.name} ({user?.email})
							</p>
						</div>
						<Button variant="secondary" onClick={handleSignOut}>
							ログアウト
						</Button>
					</div>
				</Container>
			</header>

			{/* Main Content */}
			<Container className={styles.main}>
				<h2 className={styles.sectionTitle}>
					ハッカソン一覧
				</h2>

				{loading ? (
					<div className={styles.loadingContainer}>
						<div className={styles.spinner} />
					</div>
				) : hackathons.length === 0 ? (
					<Card>
						<div className={styles.emptyCard}>
							<p className={styles.emptyText}>
								閲覧可能なハッカソンがありません
							</p>
						</div>
					</Card>
				) : (
					<div className={styles.hackathonGrid}>
						{hackathons.map((hackathon) => (
							<Card
								key={hackathon.id}
								className={styles.hackathonCard}
								onClick={() => router.push(`/guest/results/${hackathon.id}`)}
							>
								<h3 className={styles.hackathonTitle}>
									{hackathon.name}
								</h3>
								<p className={styles.hackathonDate}>
									採点日:{" "}
									{new Date(hackathon.scoring_date).toLocaleDateString("ja-JP")}
								</p>
								<Button variant="primary" size="sm" fullWidth>
									結果を見る
								</Button>
							</Card>
						))}
					</div>
				)}
			</Container>
		</div>
	);
}

export default function GuestDashboard() {
	return (
		<GuestAuthGuard>
			<GuestDashboardContent />
		</GuestAuthGuard>
	);
}
