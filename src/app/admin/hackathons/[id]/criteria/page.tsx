"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Container, Button, Card } from "@/components/ui";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Sidebar } from "@/components/admin/Sidebar";
import { useHackathon } from "@/hooks/useHackathons";
import { useTeams } from "@/hooks/useTeams";
import { useScoringItems } from "@/hooks/useScoringItems";
import { useGuests } from "@/hooks/useGuests";
import { DeleteScoringItemButton } from "../DeleteScoringItemButton";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CriteriaPage() {
	const params = useParams();
	const hackathonId = params.id as string;

	const { hackathon, isLoading: hackathonLoading } = useHackathon(hackathonId);
	const { teams: teamList } = useTeams(hackathonId);
	const { scoringItems: itemsList, isLoading: itemsLoading } =
		useScoringItems(hackathonId);
	const { guests: guestsList } = useGuests(hackathonId);

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

	const loading = hackathonLoading || itemsLoading;

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black-lighten5 via-white to-yellow-lighten1">
				<div className="text-center">
					<div className="relative inline-block mb-4">
						<div className="absolute inset-0 animate-ping h-16 w-16 rounded-full bg-yellow-primary opacity-20" />
						<div className="relative inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-primary shadow-lg">
							<span className="text-3xl animate-bounce">⏳</span>
						</div>
					</div>
					<p className="text-black-lighten1 font-medium">読み込み中...</p>
				</div>
			</div>
		);
	}

	if (!hackathon) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black-lighten5 via-white to-yellow-lighten1">
				<Card className="max-w-md">
					<div className="text-center py-12">
						<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red/20 mb-4">
							<span className="text-4xl">❌</span>
						</div>
						<h3 className="text-2xl font-bold text-black-primary mb-3">
							ハッカソンが見つかりません
						</h3>
						<p className="text-black-lighten1 mb-6">
							指定されたハッカソンは存在しないか、削除された可能性があります
						</p>
						<Link href="/admin">
							<Button variant="primary">管理画面に戻る</Button>
						</Link>
					</div>
				</Card>
			</div>
		);
	}

	const sidebarItems = [
		...(teamList || []).map((team) => ({
			id: team.id,
			label: team.name,
			icon: "👥",
			type: "team" as const,
		})),
		...(itemsList || []).map((item) => ({
			id: item.id,
			label: item.name,
			icon: "📋",
			type: "criteria" as const,
		})),
		...(guestsList || []).map((guest) => ({
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
					{ label: hackathon.name, href: `/admin/hackathons/${hackathonId}` },
					{ label: "採点項目" },
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
				hackathonId={hackathonId}
			/>

			<Container
				className="py-10"
				style={{
					marginLeft: windowWidth >= 1280 && isSidebarOpen ? "280px" : "0",
				}}
			>
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-black text-black-primary mb-2 flex items-center gap-3">
							<span>📋</span>
							<span>採点項目一覧</span>
						</h1>
						<p className="text-black-lighten1">評価基準を管理します</p>
					</div>
					<Link href={`/admin/hackathons/${hackathonId}/criteria/new`}>
						<Button variant="primary">➕ 採点項目追加</Button>
					</Link>
				</div>

				{!itemsList || itemsList.length === 0 ? (
					<Card className="bg-gradient-to-br from-white to-green/10">
						<div className="text-center py-12">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green/20 mb-4">
								<span className="text-3xl">📋</span>
							</div>
							<p className="text-black-lighten1 font-medium mb-4">
								採点項目がまだ登録されていません
							</p>
							<Link href={`/admin/hackathons/${hackathonId}/criteria/new`}>
								<Button variant="primary">➕ 採点項目追加</Button>
							</Link>
						</div>
					</Card>
				) : (
					<div className="space-y-3">
						{itemsList.map((item) => (
							<Card key={item.id}>
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
												href={`/admin/hackathons/${hackathonId}/criteria/${item.id}`}
											>
												<Button variant="secondary" size="sm">
													✏️ 編集
												</Button>
											</Link>
											<DeleteScoringItemButton
												itemId={item.id}
												hackathonId={hackathonId}
											/>
										</div>
									</div>
								</div>
							</Card>
						))}
					</div>
				)}
			</Container>
		</div>
	);
}
