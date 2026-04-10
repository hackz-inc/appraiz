import { Await, createFileRoute, defer } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { AdminHackathonCard } from "#/components/AdminHackathonCard";
import { DeleteHackathonModal } from "#/components/DeleteHackathonModal";
import { EditHackathonModal } from "#/components/EditHackathonModal";
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
	const [deleteTarget, setDeleteTarget] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [editTarget, setEditTarget] = useState<{
		id: string;
		name: string;
		scoringDate: Date;
	} | null>(null);
	const [collaboratorTarget, setCollaboratorTarget] = useState<{
		id: string;
	} | null>(null);

	const handleDeleteClick = (id: string, name: string) => {
		setDeleteTarget({ id, name });
	};

	const handleEditClick = (id: string, name: string, scoringDate: string) => {
		setEditTarget({ id, name, scoringDate: new Date(scoringDate) });
	};

	const handleCollaboratorClick = (id: string) => {
		setCollaboratorTarget({ id });
	};

	const handleCloseModal = () => {
		setDeleteTarget(null);
		setEditTarget(null);
		setCollaboratorTarget(null);
	};

	return (
		<>
			<Header
				breadcrumbItems={[{ name: "ハッカソン一覧" }]}
				actions={
					<button
						type="button"
						className="size-12 flex justify-center items-center rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer"
						aria-label="ハッカソンを作成する"
					>
						<PlusIcon size={32} color="white" />
					</button>
				}
			/>
			<div className="min-h-screen bg-gray-50 p-8 pb-20">
				<div className="max-w-5xl mx-auto">
					<Suspense
						fallback={
							<div className="bg-white rounded-lg shadow p-20 text-center">
								<div className="animate-spin inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
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
												onEdit={() =>
													handleEditClick(
														hackathon.id,
														hackathon.name,
														hackathon.scoring_date,
													)
												}
												onDelete={() =>
													handleDeleteClick(hackathon.id, hackathon.name)
												}
												onCollaboratorClick={() =>
													handleCollaboratorClick(hackathon.id)
												}
											/>
										))
									)}
								</div>
							)}
						</Await>
					</Suspense>
				</div>
			</div>

			{deleteTarget && (
				<DeleteHackathonModal
					id={deleteTarget.id}
					name={deleteTarget.name}
					onClose={handleCloseModal}
				/>
			)}

			{editTarget && (
				<EditHackathonModal
					hackathonId={editTarget.id}
					name={editTarget.name}
					scoringDate={editTarget.scoringDate}
					onClose={handleCloseModal}
				/>
			)}
		</>
	);
}
