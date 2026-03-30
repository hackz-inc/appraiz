import { Suspense } from "react";
import { AdminHeader } from "./_components/AdminHeader";
import { CreateHackathonButton } from "./_components/CreateHackathonButton";
import { HackathonCardList } from "./_components/HackathonCardList";
// import { createClient } from "@/lib/supabase/server";
// import { redirect } from "next/navigation";

// ページ全体を60秒間キャッシュ
// export const revalidate = 60;

export default async function AdminPage() {
	// 認証チェック（ここでcookies()を使う）
	// const supabase = await createClient();
	// const {
	// 	data: { user },
	// } = await supabase.auth.getUser();

	// console.log("AdminPage user:", user);

	// if (!user) {
	// 	redirect("/login");
	// }

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

				<Suspense fallback={<div>Loading...</div>}>
					<HackathonCardList />
				</Suspense>
			</main>
		</>
	);
}
