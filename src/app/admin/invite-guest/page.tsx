import { AdminHeader } from "../_components/AdminHeader";
import { InviteGuestPageClient } from "./_components/InviteGuestPageClient";

type Props = {
	searchParams: { hackathonId?: string };
};

export default function InviteGuestPage({ searchParams }: Props) {
	const { hackathonId } = searchParams;

	if (!hackathonId) {
		return (
			<>
				<AdminHeader
					breadcrumbs={[
						{ label: "ホーム", href: "/admin" },
						{ label: "ゲストを招待" },
					]}
				/>
				<main className="w-full p-24 min-h-screen bg-linear-to-br from-black-lighten5 via-white to-yellow-lighten1">
					<div className="max-w-4xl mx-auto">
						<p className="text-center text-gray-500">
							ハッカソンIDが指定されていません
						</p>
					</div>
				</main>
			</>
		);
	}

	return (
		<>
			<AdminHeader
				breadcrumbs={[
					{ label: "ホーム", href: "/admin" },
					{ label: "ゲストを招待" },
				]}
			/>

			<main className="w-full p-24 min-h-screen bg-linear-to-br from-black-lighten5 via-white to-yellow-lighten1">
				<InviteGuestPageClient hackathonId={hackathonId} />
			</main>
		</>
	);
}
