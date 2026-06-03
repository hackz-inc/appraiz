import { Await, createFileRoute, defer } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { AdminHackathonCard } from "#/components/AdminHackathonCard";
import { CreateHackathonModal } from "#/components/CreateHackathonModal";
import { DeleteHackathonModal } from "#/components/DeleteHackathonModal";
import { EditHackathonModal } from "#/components/EditHackathonModal";
import Header from "#/components/Header";
import { adminBeforeLoad } from "../-beforeLoad";
import { PlusIconButton } from "../-components/PlusIconButton";
import { fetchHackathons } from "./-functions/hackathon";

export const Route = createFileRoute("/admin/hackathonList/")({
	head: () => ({ meta: [{ title: "ハッカソン一覧 | appraiz" }] }),
	loader: async () => {
		const hackathonsPromise = fetchHackathons();
		return {
			hackathonsPromise: defer(hackathonsPromise),
		};
	},
	beforeLoad: adminBeforeLoad,
	component: HackathonListPage,
});

type EditTarget = {
	id: string;
	name: string;
	scoringDate: Date;
	mode: "name" | "date";
};

function HackathonListPage() {
	const { hackathonsPromise } = Route.useLoaderData();
	const [deleteTarget, setDeleteTarget] = useState<{
		id: string;
		name: string;
	} | null>(null);
	const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	const handleDeleteClick = (id: string, name: string) => {
		setDeleteTarget({ id, name });
	};

	const handleEditNameClick = (id: string, name: string, scoringDate: string) => {
		setEditTarget({ id, name, scoringDate: new Date(scoringDate), mode: "name" });
	};

	const handleEditDateClick = (id: string, name: string, scoringDate: string) => {
		setEditTarget({ id, name, scoringDate: new Date(scoringDate), mode: "date" });
	};

	const handleCloseModal = () => {
		setDeleteTarget(null);
		setEditTarget(null);
	};

	return (
		<>
			<Header
				breadcrumbItems={[{ name: "ハッカソン一覧" }]}
				actions={
					<PlusIconButton
						type="button"
						aria-label="ハッカソンを作成する"
						onClick={() => setIsCreateModalOpen(true)}
					/>
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
												onEditName={() =>
													handleEditNameClick(
														hackathon.id,
														hackathon.name,
														hackathon.scoring_date,
													)
												}
												onEditDate={() =>
													handleEditDateClick(
														hackathon.id,
														hackathon.name,
														hackathon.scoring_date,
													)
												}
												onDelete={() =>
													handleDeleteClick(hackathon.id, hackathon.name)
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
					mode={editTarget.mode}
					onClose={handleCloseModal}
					onUpdate={() => window.location.reload()}
				/>
			)}

			{isCreateModalOpen && (
				<CreateHackathonModal
					onClose={() => setIsCreateModalOpen(false)}
					onCreated={() => window.location.reload()}
				/>
			)}
		</>
	);
}
