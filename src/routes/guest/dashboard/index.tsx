import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import Header from "#/components/Header";
import { guestBeforeLoad } from "../-beforeLoad";
import { auth } from "#/lib/auth";
import { fetchGuestHackathons } from "../-functions/hackathon";

export const Route = createFileRoute("/guest/dashboard/")({
	beforeLoad: guestBeforeLoad,
	loader: async () => {
		const hackathons = await fetchGuestHackathons();
		return { hackathons };
	},
	component: GuestDashboardPage,
});

function GuestDashboardPage() {
	const { hackathons } = Route.useLoaderData();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await auth.signOut();
			window.location.href = "/guest/login";
		} catch (error) {
			console.error("ログアウトに失敗しました:", error);
			setIsLoggingOut(false);
		}
	};

	return (
		<>
			<Header />

			<div className="min-h-screen bg-gray-50">
				<div className="max-w-5xl mx-auto px-8 py-8">
					<div className="bg-white rounded-lg shadow-md p-8">
						<div className="flex justify-between items-center mb-6">
							<h1 className="text-2xl font-bold">ゲストダッシュボード</h1>
							<button
								type="button"
								onClick={handleLogout}
								disabled={isLoggingOut}
								className="px-4 py-2 text-sm font-bold text-red-600 border-2 border-red-600 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoggingOut ? "ログアウト中..." : "ログアウト"}
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<h2 className="text-lg font-bold text-gray-700 mb-2">
									招待されているハッカソン
								</h2>
								{hackathons.length === 0 ? (
									<div className="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
										<p className="text-gray-500">
											招待されているハッカソンはありません
										</p>
									</div>
								) : (
									<div className="space-y-3">
										{hackathons.map((hackathon) => (
											<Link
												key={hackathon.id}
												to="/guest/hackathon/$id"
												params={{ id: hackathon.id }}
												className="block bg-white border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow"
											>
												<h3 className="text-lg font-bold mb-2">
													{hackathon.name}
												</h3>
												<p className="text-sm text-gray-600">
													採点日:{" "}
													{new Date(hackathon.scoring_date).toLocaleDateString(
														"ja-JP",
													)}
												</p>
											</Link>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
