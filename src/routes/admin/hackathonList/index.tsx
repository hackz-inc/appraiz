import { createFileRoute, Link } from "@tanstack/react-router";
import { adminBeforeLoad } from "../-beforeLoad";
import { fetchHackathons } from "./-functions/hackathon";

export const Route = createFileRoute("/admin/hackathonList/")({
	loader: async () => {
		const hackathons = await fetchHackathons();
		return { hackathons };
	},
	beforeLoad: adminBeforeLoad,
	component: HackathonListPage,
});

function HackathonListPage() {
	const { hackathons } = Route.useLoaderData();

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8 flex justify-between items-center">
					<h1 className="text-4xl font-bold text-black">ハッカソン一覧</h1>
				</div>

				{hackathons.length === 0 ? (
					<div className="bg-white rounded-lg shadow p-8 text-center">
						<p className="text-gray-600">ハッカソンが登録されていません</p>
					</div>
				) : (
					<div className="bg-white rounded-lg shadow overflow-hidden">
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
									<tr key={hackathon.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											<Link
												to="/admin/hackathonList/$id"
												params={{ id: hackathon.id }}
												className="text-blue-600 hover:text-blue-800 hover:underline"
											>
												{hackathon.name}
											</Link>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{new Date(hackathon.scoring_date).toLocaleDateString(
												"ja-JP",
											)}
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
					</div>
				)}
			</div>
		</div>
	);
}
