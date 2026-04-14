import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Header from "#/components/Header";
import { guestBeforeLoad } from "../-beforeLoad";
import { logoutGuest } from "../-functions/auth";

export const Route = createFileRoute("/guest/dashboard/")({
	beforeLoad: guestBeforeLoad,
	component: GuestDashboardPage,
});

function GuestDashboardPage() {
	const navigate = useNavigate();
	const { guest } = Route.useRouteContext();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await logoutGuest({ data: {} });
			navigate({ to: "/guest/login" });
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
							<div className="border-b border-gray-300 pb-4">
								<h2 className="text-lg font-bold text-gray-700 mb-2">
									ユーザー情報
								</h2>
								<div className="space-y-2">
									<p className="text-base">
										<span className="font-bold text-gray-600">お名前:</span>{" "}
										{guest.name}
									</p>
									<p className="text-base">
										<span className="font-bold text-gray-600">会社名:</span>{" "}
										{guest.company_name}
									</p>
									<p className="text-base">
										<span className="font-bold text-gray-600">
											メールアドレス:
										</span>{" "}
										{guest.email}
									</p>
								</div>
							</div>

							<div>
								<h2 className="text-lg font-bold text-gray-700 mb-2">
									参加中のハッカソン
								</h2>
								<div className="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
									<p className="text-gray-500">
										参加中のハッカソンはありません
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
