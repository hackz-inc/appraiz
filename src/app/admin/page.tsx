"use client";

import Link from "next/link";
import { Button, Card, Container } from "@/components/ui";
import { useHackathons } from "@/hooks/useHackathons";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CreateHackathonButton } from "./CreateHackathonButton";

export default function AdminPage() {
	const { hackathons: hackathonsList, isLoading } = useHackathons();

	// 初回ロード時のみローディング画面を表示（キャッシュがない場合）
	if (isLoading && !hackathonsList) {
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-black-lighten5 via-white to-yellow-lighten1">
			<AdminHeader
				breadcrumbs={[{ label: "ホーム" }]}
			/>

			{/* Main Content */}
			<Container className="py-10">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h2 className="text-3xl font-black text-black-primary mb-2">
							ハッカソン一覧
						</h2>
						<p className="text-black-lighten1">
							開催中・予定のハッカソンを管理できます
						</p>
					</div>
					<CreateHackathonButton />
				</div>

				{!hackathonsList || hackathonsList.length === 0 ? (
					<Card
						variant="elevated"
						className="bg-gradient-to-br from-white to-yellow-lighten1"
					>
						<div className="text-center py-16">
							<div className="mb-6">
								<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-primary/20 mb-4">
									<span className="text-4xl">📋</span>
								</div>
							</div>
							<h3 className="text-2xl font-bold text-black-primary mb-3">
								ハッカソンがまだありません
							</h3>
							<p className="text-black-lighten1 mb-6 max-w-md mx-auto">
								新しいハッカソンを作成して、チームの評価を始めましょう
							</p>
							<CreateHackathonButton />
						</div>
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{hackathonsList.map((hackathon) => (
							<Link key={hackathon.id} href={`/admin/hackathons/${hackathon.id}`}>
								<Card
									variant="elevated"
									hoverable
									className="h-full border-2 border-transparent hover:border-yellow-primary"
								>
									<div className="mb-4">
										<div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-primary/20 mb-3">
											<span className="text-2xl">🏆</span>
										</div>
										<h3 className="text-xl font-bold text-black-primary mb-2">
											{hackathon.name}
										</h3>
										<div className="flex items-center gap-2 text-sm text-black-lighten1">
											<span>📅</span>
											<span>
												{new Date(hackathon.scoring_date).toLocaleDateString(
													"ja-JP",
												)}
											</span>
										</div>
									</div>
									<div className="flex gap-2 mt-4">
										<Button
											variant="primary"
											size="sm"
											fullWidth
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												window.location.href = `/admin/hackathons/${hackathon.id}/settings`;
											}}
										>
											⚙️ 設定
										</Button>
										<Button
											variant="secondary"
											size="sm"
											fullWidth
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												window.location.href = `/admin/hackathons/${hackathon.id}/results`;
											}}
										>
											📊 結果
										</Button>
									</div>
								</Card>
							</Link>
						))}
					</div>
				)}
			</Container>
		</div>
	);
}
