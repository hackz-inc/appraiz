// import { useParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";
// import { Container, Button, Card } from "@/components/ui";
// import { AdminHeader } from "@/components/admin/AdminHeader";
// import { Sidebar } from "@/components/admin/Sidebar";
// import { useHackathon } from "@/hooks/useHackathons";
// import { useTeams } from "@/hooks/useTeams";
// import { useScoringItems } from "@/hooks/useScoringItems";
// import { useGuests } from "@/hooks/useGuests";
// import { DeleteTeamButton } from "./DeleteTeamButton";
// import { DeleteScoringItemButton } from "./DeleteScoringItemButton";

import { getHackathonById } from "@/lib/server/hackathons";

export default async function HackathonDetailPage({
	params,
	searchParams,
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const resolvedParams = await params;
	const resolvedSearchParams = await searchParams;
	const hackathonId = resolvedParams.id;

	console.info("resolvedSearchParams:", resolvedSearchParams);
	const hackathon = await getHackathonById(hackathonId);

	console.info("Hackathon ID:", hackathon); // ここで初めて "123" などの文字列が取れる

	// あとはこの ID を使って DB からデータ取得などを行う
	// const hackathon = await getHackathon(hackathonId);

	return (
		<div>
			<h1>ハッカソン詳細: {hackathonId}</h1>
		</div>
	);
}

// const { hackathon, isLoading: hackathonLoading } = useHackathon(hackathonId);
// const { teams: teamList, isLoading: teamsLoading } = useTeams(hackathonId);
// const { scoringItems: itemsList, isLoading: itemsLoading } =
// 	useScoringItems(hackathonId);
// const { guests: guestsList, isLoading: guestsLoading } = useGuests(hackathonId);

// const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// const [currentHash, setCurrentHash] = useState("");
// const [windowWidth, setWindowWidth] = useState(
// 	typeof window !== "undefined" ? window.innerWidth : 1280
// );

// // ウィンドウサイズの監視
// useEffect(() => {
// 	const handleResize = () => {
// 		setWindowWidth(window.innerWidth);
// 	};

// 	window.addEventListener("resize", handleResize);
// 	return () => window.removeEventListener("resize", handleResize);
// }, []);

// // デスクトップではサイドバーを自動表示
// useEffect(() => {
// 	if (windowWidth >= 1280) {
// 		setIsSidebarOpen(true);
// 	} else {
// 		setIsSidebarOpen(false);
// 	}
// }, [windowWidth]);

// // ハッシュの監視
// useEffect(() => {
// 	const updateHash = () => {
// 		setCurrentHash(window.location.hash);
// 	};

// 	updateHash();
// 	window.addEventListener("hashchange", updateHash);
// 	return () => window.removeEventListener("hashchange", updateHash);
// }, []);

// // 初回ロード時のみローディング画面を表示
// const loading = hackathonLoading || teamsLoading || itemsLoading || guestsLoading;

// if (loading) {
// 	return (
// 		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black-lighten5 via-white to-yellow-lighten1">
// 			<div className="text-center">
// 				<div className="relative inline-block mb-4">
// 					<div className="absolute inset-0 animate-ping h-16 w-16 rounded-full bg-yellow-primary opacity-20" />
// 					<div className="relative inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-primary shadow-lg">
// 						<span className="text-3xl animate-bounce">⏳</span>
// 					</div>
// 				</div>
// 				<p className="text-black-lighten1 font-medium">読み込み中...</p>
// 			</div>
// 		</div>
// 	);
// }

// if (!hackathon) {
// 	return (
// 		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black-lighten5 via-white to-yellow-lighten1">
// 			<Card variant="elevated" className="max-w-md">
// 				<div className="text-center py-12">
// 					<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red/20 mb-4">
// 						<span className="text-4xl">❌</span>
// 					</div>
// 					<h3 className="text-2xl font-bold text-black-primary mb-3">
// 						ハッカソンが見つかりません
// 					</h3>
// 					<p className="text-black-lighten1 mb-6">
// 						指定されたハッカソンは存在しないか、削除された可能性があります
// 					</p>
// 					<Link href="/admin">
// 						<Button variant="primary">管理画面に戻る</Button>
// 					</Link>
// 				</div>
// 			</Card>
// 		</div>
// 	);
// }

// // サイドバーアイテムの生成
// const sidebarItems = [
// 	...(teamList || []).map((team) => ({
// 		id: team.id,
// 		label: team.name,
// 		icon: "👥",
// 		type: "team" as const,
// 	})),
// 	...(itemsList || []).map((item) => ({
// 		id: item.id,
// 		label: item.name,
// 		icon: "📋",
// 		type: "criteria" as const,
// 	})),
// 	...(guestsList || []).map((guest) => ({
// 		id: guest.id,
// 		label: guest.name,
// 		icon: "🎤",
// 		type: "guest" as const,
// 	})),
// ];

// const handleMenuToggle = () => {
// 	setIsSidebarOpen(!isSidebarOpen);
// };

// return (
// 	<div className="min-h-screen bg-gradient-to-br from-black-lighten5 via-white to-yellow-lighten1">
// 		<AdminHeader
// 			breadcrumbs={[
// 				{ label: "ホーム", href: "/admin" },
// 				{ label: hackathon.name },
// 			]}
// 			showMenuButton
// 			isMenuOpen={isSidebarOpen}
// 			onMenuToggle={handleMenuToggle}
// 		/>

// 		{/* オーバーレイ（モバイルのみ） */}
// 		<AnimatePresence>
// 			{isSidebarOpen && windowWidth < 1280 && (
// 				<motion.div
// 					initial={{ opacity: 0 }}
// 					animate={{ opacity: 1 }}
// 					exit={{ opacity: 0 }}
// 					transition={{ duration: 0.3 }}
// 					onClick={handleMenuToggle}
// 					style={{
// 						position: "fixed",
// 						top: 0,
// 						left: 0,
// 						right: 0,
// 						bottom: 0,
// 						backgroundColor: "rgba(0, 0, 0, 0.5)",
// 						zIndex: 999,
// 					}}
// 				/>
// 			)}
// 		</AnimatePresence>

// 		<Sidebar
// 			items={sidebarItems}
// 			isOpen={isSidebarOpen}
// 			currentHash={currentHash}
// 			onClose={() => setIsSidebarOpen(false)}
// 			hackathonId={hackathonId}
// 		/>

// 		{/* Main Content */}
// 		<Container className="py-10" style={{ marginLeft: windowWidth >= 1280 && isSidebarOpen ? "280px" : "0" }}>
// 			{/* Teams Section */}
// 			<div id="teams-section" className="mb-10">
// 				<div className="flex items-center justify-between mb-6">
// 					<div>
// 						<h2 className="text-2xl font-black text-black-primary mb-1 flex items-center gap-2">
// 							<span>👥</span>
// 							<span>チーム</span>
// 						</h2>
// 						<p className="text-sm text-black-lighten1">
// 							参加チームを管理します
// 						</p>
// 					</div>
// 					<Link href={`/admin/hackathons/${hackathonId}/teams/new`}>
// 						<Button variant="primary">➕ チーム追加</Button>
// 					</Link>
// 				</div>
// 				{!teamList || teamList.length === 0 ? (
// 					<Card
// 						variant="elevated"
// 						className="bg-gradient-to-br from-white to-blue/10"
// 					>
// 						<div className="text-center py-12">
// 							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue/20 mb-4">
// 								<span className="text-3xl">👥</span>
// 							</div>
// 							<p className="text-black-lighten1 font-medium">
// 								チームがまだ登録されていません
// 							</p>
// 						</div>
// 					</Card>
// 				) : (
// 					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 						{teamList.map((team) => (
// 							<Card key={team.id} id={`team-${team.id}`}>
// 								<div className="flex items-start gap-3">
// 									<div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue/20 flex-shrink-0">
// 										<span className="text-xl">👥</span>
// 									</div>
// 									<div className="flex-1">
// 										<h3 className="text-lg font-bold text-black-primary mb-3">
// 											{team.name}
// 										</h3>
// 										<div className="flex gap-2">
// 											<Link
// 												href={`/admin/hackathons/${hackathonId}/teams/${team.id}`}
// 												className="flex-1"
// 											>
// 												<Button variant="secondary" size="sm" fullWidth>
// 													✏️ 編集
// 												</Button>
// 											</Link>
// 											<DeleteTeamButton
// 												teamId={team.id}
// 												hackathonId={hackathonId}
// 											/>
// 										</div>
// 									</div>
// 								</div>
// 							</Card>
// 						))}
// 					</div>
// 				)}
// 			</div>

// 			{/* Guest Section */}
// 			<div id="guests-section" className="mb-10">
// 				<div className="flex items-center justify-between mb-6">
// 					<div>
// 						<h2 className="text-2xl font-black text-black-primary mb-1 flex items-center gap-2">
// 							<span>🎤</span>
// 							<span>ゲスト</span>
// 						</h2>
// 						<p className="text-sm text-black-lighten1">
// 							共同開催者を管理します
// 						</p>
// 					</div>
// 					<Link href={`/admin/hackathons/${hackathonId}/guests`}>
// 						<Button variant="primary">⚙️ ゲスト管理</Button>
// 					</Link>
// 				</div>
// 				{!guestsList || guestsList.length === 0 ? (
// 					<Card
// 						variant="elevated"
// 						className="bg-gradient-to-br from-white to-purple/10"
// 					>
// 						<div className="text-center py-12">
// 							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple/20 mb-4">
// 								<span className="text-3xl">🎤</span>
// 							</div>
// 							<p className="text-black-lighten1 font-medium mb-2">
// 								ゲストがまだ招待されていません
// 							</p>
// 							<Link href={`/admin/hackathons/${hackathonId}/guests`}>
// 								<Button variant="secondary" size="sm">
// 									⚙️ ゲスト管理ページへ
// 								</Button>
// 							</Link>
// 						</div>
// 					</Card>
// 				) : (
// 					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 						{guestsList.map((guest) => (
// 							<Card key={guest.id} id={`guest-${guest.id}`}>
// 								<div className="flex items-start gap-3">
// 									<div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple/20 flex-shrink-0">
// 										<span className="text-xl">🎤</span>
// 									</div>
// 									<div className="flex-1">
// 										<h3 className="text-lg font-bold text-black-primary mb-1">
// 											{guest.name}
// 										</h3>
// 										<p className="text-sm text-black-lighten2 mb-3">
// 											{guest.company_name}
// 										</p>
// 										<div className="flex gap-2">
// 											<Link
// 												href={`/admin/hackathons/${hackathonId}/guests`}
// 												className="flex-1"
// 											>
// 												<Button variant="secondary" size="sm" fullWidth>
// 													⚙️ 管理
// 												</Button>
// 											</Link>
// 										</div>
// 									</div>
// 								</div>
// 							</Card>
// 						))}
// 					</div>
// 				)}
// 			</div>

// 			{/* Criteria Section */}
// 			<div id="criteria-section">
// 				<div className="flex items-center justify-between mb-6">
// 					<div>
// 						<h2 className="text-2xl font-black text-black-primary mb-1 flex items-center gap-2">
// 							<span>📋</span>
// 							<span>採点項目</span>
// 						</h2>
// 						<p className="text-sm text-black-lighten1">
// 							評価基準を管理します
// 						</p>
// 					</div>
// 					<Link href={`/admin/hackathons/${hackathonId}/criteria/new`}>
// 						<Button variant="primary">➕ 採点項目追加</Button>
// 					</Link>
// 				</div>
// 				{!itemsList || itemsList.length === 0 ? (
// 					<Card
// 						variant="elevated"
// 						className="bg-gradient-to-br from-white to-green/10"
// 					>
// 						<div className="text-center py-12">
// 							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green/20 mb-4">
// 								<span className="text-3xl">📋</span>
// 							</div>
// 							<p className="text-black-lighten1 font-medium">
// 								採点項目がまだ登録されていません
// 							</p>
// 						</div>
// 					</Card>
// 				) : (
// 					<div className="space-y-3">
// 						{itemsList.map((item) => (
// 							<Card key={item.id} id={`criteria-${item.id}`}>
// 								<div className="flex items-start gap-3">
// 									<div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-green/20 flex-shrink-0">
// 										<span className="text-xl">📋</span>
// 									</div>
// 									<div className="flex-1 flex items-start justify-between">
// 										<div className="flex-1">
// 											<h3 className="text-lg font-bold text-black-primary mb-2">
// 												{item.name}
// 											</h3>
// 											<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-primary/20 border border-yellow-primary">
// 												<span className="text-sm font-bold text-black-primary">
// 													最大 {item.max_score} 点
// 												</span>
// 											</div>
// 										</div>
// 										<div className="flex gap-2 ml-4">
// 											<Link
// 												href={`/admin/hackathons/${hackathonId}/criteria/${item.id}`}
// 											>
// 												<Button variant="secondary" size="sm">
// 													✏️ 編集
// 												</Button>
// 											</Link>
// 											<DeleteScoringItemButton
// 												itemId={item.id}
// 												hackathonId={hackathonId}
// 											/>
// 										</div>
// 									</div>
// 								</div>
// 							</Card>
// 						))}
// 					</div>
// 				)}
// 			</div>
// 		</Container>
// 	</div>
// );
