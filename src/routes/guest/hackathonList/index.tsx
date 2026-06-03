import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Header from "#/components/Header";
import { auth } from "#/lib/auth";
import { GuestHackathonCard } from "./$id/-components/GuestHackathonCard";
import { guestBeforeLoad } from "../-beforeLoad";
import { fetchGuestHackathons } from "../-functions/hackathon";

export const Route = createFileRoute("/guest/hackathonList/")({
	head: () => ({ meta: [{ title: "ハッカソン一覧 | appraiz" }] }),
	beforeLoad: guestBeforeLoad,
	loader: async () => {
		const hackathons = await fetchGuestHackathons();
		return { hackathons };
	},
	component: GuestHackathonListPage,
});

function GuestHackathonListPage() {
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
			<Header
				breadcrumbItems={[{ name: "ハッカソン一覧" }]}
				actions={
					<button
						type="button"
						onClick={handleLogout}
						disabled={isLoggingOut}
						className="px-4 py-2 text-sm font-bold text-red-600 border-2 border-red-600 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoggingOut ? "ログアウト中..." : "ログアウト"}
					</button>
				}
			/>

			<div className="min-h-screen bg-gray-50 p-8 pb-20">
				<div className="max-w-5xl mx-auto">
					{hackathons.length === 0 ? (
						<div className="bg-white rounded-lg shadow p-12 text-center">
							<p className="text-gray-600">
								招待されているハッカソンはありません
							</p>
						</div>
					) : (
						<div className="flex flex-col gap-10">
							{hackathons.map((hackathon) => (
								<GuestHackathonCard
									key={hackathon.id}
									hackathon={hackathon}
									permission={hackathon.permission}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
