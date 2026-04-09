import { Await, createFileRoute, defer } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import { AdminHackathonCard } from "#/components/AdminHackathonCard";
import Header from "#/components/Header";
import { adminBeforeLoad } from "../-beforeLoad";
import { fetchHackathons } from "./-functions/hackathon";

export const Route = createFileRoute("/admin/hackathonList/")({
	loader: async () => {
		const hackathonsPromise = fetchHackathons();
		return {
			hackathonsPromise: defer(hackathonsPromise),
		};
	},
	beforeLoad: adminBeforeLoad,
	component: HackathonListPage,
});

function HackathonListPage() {
	const { hackathonsPromise } = Route.useLoaderData();

	return (
		<>
			<Header>
				<h1 className="text-3xl font-bold">ハッカソン一覧</h1>
				<button
					type="button"
					className="size-12 flex justify-center items-center rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer"
					aria-label="ハッカソンを作成する"
				>
					<PlusIcon size={32} color="white" />
				</button>
			</Header>
			<div className="min-h-screen bg-gray-50 p-8 pb-20">
				<div className="max-w-5xl mx-auto">
					<Suspense
						fallback={
							<div className="bg-white rounded-lg shadow p-20 text-center">
								<div className="animate-spin inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
								<p className="text-gray-600 font-medium">
									ハッカソン一覧を読み込み中...
								</p>
							</div>
						}
					>
						<Await promise={hackathonsPromise}>
							{(hackathons) => (
								<div className="flex flex-col gap-10">
									{hackathons.length === 0 ? (
										<div className="bg-white rounded-lg shadow p-12 text-center">
											<p className="text-gray-600">
												ハッカソンがまだ登録されていません
											</p>
										</div>
									) : (
										hackathons.map((hackathon) => (
											<AdminHackathonCard
												key={hackathon.id}
												hackathon={hackathon}
											/>
										))
									)}
								</div>
							)}
						</Await>
					</Suspense>
				</div>
			</div>
		</>
	);
}
