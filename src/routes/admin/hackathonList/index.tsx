import { Await, createFileRoute, defer, Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { adminBeforeLoad } from "../-beforeLoad";
import { fetchHackathons } from "./-functions/hackathon";

export const Route = createFileRoute("/admin/hackathonList/")({
	loader: async () => {
		// 1. サーバー関数を実行し、Promiseをdeferで包む
		const hackathonsPromise = fetchHackathons();
		return {
			hackathonsPromise: defer(hackathonsPromise),
		};
	},
	beforeLoad: adminBeforeLoad,
	component: HackathonListPage,
});

function HackathonListPage() {
	// loaderからPromiseを受け取る
	const { hackathonsPromise } = Route.useLoaderData();

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				{/* データの有無に関わらず即座に表示されるヘッダー */}
				<div className="mb-8 flex justify-between items-center">
					<h1 className="text-4xl font-bold text-black">ハッカソン一覧</h1>
				</div>

				{/* サーバーからのデータストリーミングを待機する境界線 */}
				<Suspense
					fallback={
						<div className="bg-white rounded-lg shadow p-20 text-center border border-gray-200">
							<div className="animate-spin inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
							<p className="text-gray-600 font-medium">
								ハッカソン一覧を読み込み中...
							</p>
						</div>
					}
				>
					<Await promise={hackathonsPromise}>
						{(hackathons) => (
							<div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
								{hackathons.length === 0 ? (
									<div className="p-12 text-center">
										<p className="text-gray-600">
											ハッカソンがまだ登録されていません
										</p>
									</div>
								) : (
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th
													scope="col"
													className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
												>
													名前
												</th>
												<th
													scope="col"
													className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
												>
													開催日
												</th>
												<th
													scope="col"
													className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
												>
													作成日
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{hackathons.map((hackathon) => (
												<tr
													key={hackathon.id}
													className="hover:bg-gray-50 transition-colors"
												>
													<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
														<Link
															to="/admin/hackathonList/$id"
															params={{ id: hackathon.id }}
															className="text-blue-600 hover:text-blue-800 hover:underline"
														>
															{hackathon.name}
														</Link>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
														{new Date(
															hackathon.scoring_date,
														).toLocaleDateString("ja-JP")}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
														{new Date(hackathon.created_at).toLocaleDateString(
															"ja-JP",
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								)}
							</div>
						)}
					</Await>
				</Suspense>
			</div>
		</div>
	);
}
