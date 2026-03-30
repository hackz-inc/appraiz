"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GuestAuthGuard } from "@/components/guards";
import { Container, Button, Card } from "@/components/ui";
import { auth } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

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
		<div className="min-h-screen bg-[var(--black-lighten5)]">
			{/* Header */}
			<header className="bg-white border-b border-[var(--black-lighten3)] shadow-[var(--shadow-sm)]">
				<Container>
					<div className="pt-4 pb-4 flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-[var(--black-primary)]">
								Appraiz ゲスト
							</h1>
							<p className="text-sm text-[var(--black-lighten1)] mt-1">
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
			<Container className="pt-8 pb-8">
				<h2 className="text-2xl font-bold text-[var(--black-primary)] mb-6">
					ハッカソン一覧
				</h2>

				{loading ? (
					<div className="text-center pt-12 pb-12">
						<div className="inline-block w-12 h-12 border-4 border-[var(--blue)] border-t-transparent rounded-full animate-spin" />
					</div>
				) : hackathons.length === 0 ? (
					<Card>
						<div className="text-center pt-12 pb-12">
							<p className="text-[var(--black-lighten1)]">
								閲覧可能なハッカソンがありません
							</p>
						</div>
					</Card>
				) : (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{hackathons.map((hackathon) => (
							<Card
								key={hackathon.id}
								className="transition-shadow cursor-pointer hover:shadow-[var(--shadow-xl)]"
								onClick={() => router.push(`/guest/results/${hackathon.id}`)}
							>
								<h3 className="text-xl font-bold text-[var(--black-primary)] mb-2">
									{hackathon.name}
								</h3>
								<p className="text-sm text-[var(--black-lighten1)] mb-4">
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
