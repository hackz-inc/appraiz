import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// サーバー側で認証チェック（安全）
	const supabase = await createClient();
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		redirect("/admin/auth/login");
	}

	// Check if user is admin
	const userRole = user.user_metadata?.role;
	if (userRole !== "admin") {
		redirect("/guest");
	}

	// 認証OKなら子コンポーネントをレンダリング
	return (
		<>
			<AdminHeader breadcrumbs={[{ label: "ホーム" }]} />
			{children}
		</>
	);
}
