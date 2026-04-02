import { Suspense } from "react";
import { AdminHeader } from "./_components/AdminHeader";
import { CreateHackathonButton } from "./_components/CreateHackathonButton";
import { HackathonCardList } from "./_components/HackathonCardList";
import { LoadingIcon } from "@/components/ui/LoadingIcon";
import { AdminPageModal } from "./_components/AdminPageModal";

export default async function AdminPage() {
	return (
		<>
			<AdminHeader breadcrumbs={[{ label: "ホーム" }]} />
			<main className="w-full p-24 min-h-screen bg-linear-to-br from-black-lighten5 via-white to-yellow-lighten1">
				<div className="flex items-center justify-between mb-8">
					<p className="text-[30px] font-black text-black mb-2">
						ハッカソン一覧
					</p>
					<CreateHackathonButton />
				</div>

				<Suspense fallback={<LoadingIcon />}>
					<HackathonCardList />
				</Suspense>
			</main>
			<Suspense fallback={null}>
				<AdminPageModal />
			</Suspense>
		</>
	);
}
