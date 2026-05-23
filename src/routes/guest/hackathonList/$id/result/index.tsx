import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import Header from "#/components/Header";
import { getDb } from "#/lib/db/client";
import { hackathon } from "#/lib/db/schema";
import "#/types/cloudflare";
import type { Hackathon } from "#/lib/db/types";
import { guestBeforeLoad } from "../../../-beforeLoad";

const fetchHackathonDetail = createServerFn({ method: "GET" })
	.inputValidator((id: string) => id)
	.handler(async (ctx) => {
		const id = ctx.data;
		// biome-ignore lint/style/noNonNullAssertion: always set in Cloudflare Worker
		const db = getDb(ctx.context!);
		const data = await db
			.select()
			.from(hackathon)
			.where(eq(hackathon.id, id))
			.get();
		if (!data) throw new Error("Hackathon not found");
		return data as Hackathon;
	});

export const Route = createFileRoute("/guest/hackathonList/$id/result/")({
	beforeLoad: guestBeforeLoad,
	loader: async ({ params }) => {
		const hackathonData = await fetchHackathonDetail({ data: params.id });
		return { hackathon: hackathonData as Hackathon };
	},
	component: GuestHackathonResultPage,
});

function GuestHackathonResultPage() {
	const { hackathon } = Route.useLoaderData();

	return (
		<>
			<Header
				breadcrumbItems={[
					{ name: "ハッカソン一覧", path: "/guest/hackathonList" },
					{ name: hackathon.name, path: `/guest/hackathonList/${hackathon.id}` },
					{ name: "結果" },
				]}
			/>
			<div className="min-h-screen bg-gray-50 p-8">
				<div className="max-w-5xl mx-auto">
					<div className="bg-white rounded-lg shadow-md p-8">
						<h1 className="text-2xl font-bold mb-4">{hackathon.name} - 結果</h1>
						<p className="text-gray-600">結果ページは現在開発中です。</p>
					</div>
				</div>
			</div>
		</>
	);
}
