"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Container, Button, Card } from "@/components/ui";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Sidebar } from "@/components/admin/Sidebar";
import { DeleteTeamButton } from "../DeleteTeamButton";
import { DeleteScoringItemButton } from "../DeleteScoringItemButton";
import type { Hackathon } from "@/lib/hackathons";
import type { Team } from "@/lib/teams";
import type { ScoringItem } from "@/lib/scoring";
import type { Guest } from "@/lib/server/guests";

type Props = {
	hackathon: Hackathon;
	teams: Team[];
	scoringItems: ScoringItem[];
	guests: Guest[];
};

export function HackathonDetailClient({
	hackathon,
	teams,
	scoringItems,
	guests,
}: Props) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 1280,
	);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (windowWidth >= 1280) {
			setIsSidebarOpen(true);
		} else {
			setIsSidebarOpen(false);
		}
	}, [windowWidth]);

	const sidebarItems = [
		...(teams || []).map((team) => ({
			id: team.id,
			label: team.name,
			icon: "👥",
			type: "team" as const,
		})),
		...(scoringItems || []).map((item) => ({
			id: item.id,
			label: item.name,
			icon: "📋",
			type: "criteria" as const,
		})),
		...(guests || []).map((guest) => ({
			id: guest.id,
			label: guest.name,
			icon: "🎤",
			type: "guest" as const,
		})),
	];

	const handleMenuToggle = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-black-lighten5 via-white to-yellow-lighten1">
			<AdminHeader
				breadcrumbs={[
					{ label: "ホーム", href: "/admin" },
					{ label: hackathon.name },
				]}
				showMenuButton
				isMenuOpen={isSidebarOpen}
				onMenuToggle={handleMenuToggle}
			/>

			<AnimatePresence>
				{isSidebarOpen && windowWidth < 1280 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						onClick={handleMenuToggle}
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							zIndex: 999,
						}}
					/>
				)}
			</AnimatePresence>

			<Sidebar
				items={sidebarItems}
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				hackathonId={hackathon.id}
			/>

			<Container
				className="py-10"
				style={{
					marginLeft: windowWidth >= 1280 && isSidebarOpen ? "280px" : "0",
				}}
			>
				{/* Teams Section */}
				<div id="teams-section" className="mb-10">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-2xl font-black text-black-primary mb-1 flex items-center gap-2">
								<span>👥</span>
								<span>チーム</span>
							</h2>
							<p className="text-sm text-black-lighten1">
								参加チームを管理します
							</p>
						</div>
						<Link href={`/admin/hackathons/${hackathon.id}/teams/new`}>
							<Button variant="primary">➕ チーム追加</Button>
						</Link>
					</div>
					{!teams || teams.length === 0 ? (
						<Card
							variant="elevated"
							className="bg-gradient-to-br from-white to-blue/10"
						>
							<div className="text-center py-12">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue/20 mb-4">
									<span className="text-3xl">👥</span>
								</div>
								<p className="text-black-lighten1 font-medium">
									チームがまだ登録されていません
								</p>
							</div>
						</Card>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{teams.map((team) => (
								<Card key={team.id} id={`team-${team.id}`}>
									<div className="flex items-start gap-3">
										<div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue/20 flex-shrink-0">
											<span className="text-xl">👥</span>
										</div>
										<div className="flex-1">
											<h3 className="text-lg font-bold text-black-primary mb-3">
												{team.name}
											</h3>
											<div className="flex gap-2">
												<Link
													href={`/admin/hackathons/${hackathon.id}/teams/${team.id}`}
													className="flex-1"
												>
													<Button variant="secondary" size="sm" fullWidth>
														✏️ 編集
													</Button>
												</Link>
												<DeleteTeamButton
													teamId={team.id}
													hackathonId={hackathon.id}
												/>
											</div>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>

				{/* Guest Section */}
				<div id="guests-section" className="mb-10">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-2xl font-black text-black-primary mb-1 flex items-center gap-2">
								<span>🎤</span>
								<span>ゲスト</span>
							</h2>
							<p className="text-sm text-black-lighten1">
								共同開催者を管理します
							</p>
						</div>
						<Link href={`/admin/hackathons/${hackathon.id}/guests`}>
							<Button variant="primary">⚙️ ゲスト管理</Button>
						</Link>
					</div>
					{!guests || guests.length === 0 ? (
						<Card
							variant="elevated"
							className="bg-gradient-to-br from-white to-purple/10"
						>
							<div className="text-center py-12">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple/20 mb-4">
									<span className="text-3xl">🎤</span>
								</div>
								<p className="text-black-lighten1 font-medium mb-2">
									ゲストがまだ招待されていません
								</p>
								<Link href={`/admin/hackathons/${hackathon.id}/guests`}>
									<Button variant="secondary" size="sm">
										⚙️ ゲスト管理ページへ
									</Button>
								</Link>
							</div>
						</Card>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{guests.map((guest) => (
								<Card key={guest.id} id={`guest-${guest.id}`}>
									<div className="flex items-start gap-3">
										<div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple/20 flex-shrink-0">
											<span className="text-xl">🎤</span>
										</div>
										<div className="flex-1">
											<h3 className="text-lg font-bold text-black-primary mb-1">
												{guest.name}
											</h3>
											<p className="text-sm text-black-lighten2 mb-3">
												{guest.company_name}
											</p>
											<div className="flex gap-2">
												<Link
													href={`/admin/hackathons/${hackathon.id}/guests`}
													className="flex-1"
												>
													<Button variant="secondary" size="sm" fullWidth>
														⚙️ 管理
													</Button>
												</Link>
											</div>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>

				{/* Criteria Section */}
				<div id="criteria-section">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h2 className="text-2xl font-black text-black-primary mb-1 flex items-center gap-2">
								<span>📋</span>
								<span>採点項目</span>
							</h2>
							<p className="text-sm text-black-lighten1">
								評価基準を管理します
							</p>
						</div>
						<Link href={`/admin/hackathons/${hackathon.id}/criteria/new`}>
							<Button variant="primary">➕ 採点項目追加</Button>
						</Link>
					</div>
					{!scoringItems || scoringItems.length === 0 ? (
						<Card
							variant="elevated"
							className="bg-gradient-to-br from-white to-green/10"
						>
							<div className="text-center py-12">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green/20 mb-4">
									<span className="text-3xl">📋</span>
								</div>
								<p className="text-black-lighten1 font-medium">
									採点項目がまだ登録されていません
								</p>
							</div>
						</Card>
					) : (
						<div className="space-y-3">
							{scoringItems.map((item) => (
								<Card key={item.id} id={`criteria-${item.id}`}>
									<div className="flex items-start gap-3">
										<div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green/20 flex-shrink-0">
											<span className="text-xl">📋</span>
										</div>
										<div className="flex-1 flex items-start justify-between">
											<div className="flex-1">
												<h3 className="text-lg font-bold text-black-primary mb-2">
													{item.name}
												</h3>
												<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-primary/20 border border-yellow-primary">
													<span className="text-sm font-bold text-black-primary">
														最大 {item.max_score} 点
													</span>
												</div>
											</div>
											<div className="flex gap-2 ml-4">
												<Link
													href={`/admin/hackathons/${hackathon.id}/criteria/${item.id}`}
												>
													<Button variant="secondary" size="sm">
														✏️ 編集
													</Button>
												</Link>
												<DeleteScoringItemButton
													itemId={item.id}
													hackathonId={hackathon.id}
												/>
											</div>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</div>
			</Container>
		</div>
	);
}
