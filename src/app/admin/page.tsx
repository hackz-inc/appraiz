import { Suspense } from "react";
import { AdminHeader } from "./_components/AdminHeader";
import { CreateHackathonButton } from "./_components/CreateHackathonButton";
import { HackathonCardList } from "./_components/HackathonCardList";
import { LoadingScreen } from "@/components/ui";

export default async function AdminPage() {
	return (
		<>
			<AdminHeader breadcrumbs={[{ label: "ホーム" }]} />
			<main className="w-full p-24 min-h-screen bg-gradient-to-br from-[var(--black-lighten5)] via-white to-[var(--yellow-lighten1)]">
				<div className="flex items-center justify-between mb-8">
					<p className="text-[30px] font-black text-[var(--black-primary)] mb-2">
						ハッカソン一覧
					</p>
					<CreateHackathonButton />
				</div>
				<LoadingScreen />

				<Suspense fallback={<div>Loading...</div>}>
					<HackathonCardList />
				</Suspense>
			</main>
		</>
	);
}
