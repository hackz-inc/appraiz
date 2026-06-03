import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import Header from "#/components/Header";
import { getDb } from "#/lib/db/client";
import { hackathon } from "#/lib/db/schema";
import "#/types/cloudflare";
import type { Hackathon } from "#/lib/db/types";
import { guestBeforeLoad } from "../../-beforeLoad";
import { GuestHackathonCard } from "./-components/GuestHackathonCard";

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

export const Route = createFileRoute("/guest/hackathonList/$id/")({
	head: ({ loaderData }) => ({
		meta: [{ title: `${loaderData?.hackathon.name} | Apprai'z` }],
	}),
	beforeLoad: guestBeforeLoad,
	loader: async ({ params }) => {
		const hackathonData = await fetchHackathonDetail({ data: params.id });
		return { hackathon: hackathonData as Hackathon };
	},
	component: GuestHackathonDetailPage,
});

function GuestHackathonDetailPage() {
	const { hackathon } = Route.useLoaderData();

	return (
		<>
			<Header
				breadcrumbItems={[
					{ name: "ハッカソン一覧", path: "/guest/hackathonList" },
					{ name: hackathon.name },
				]}
			/>
			<div className="min-h-screen bg-gray-50 p-8 pb-20">
				<div className="max-w-5xl mx-auto">
					<GuestHackathonCard hackathon={hackathon} />
				</div>
			</div>
		</>
	);
}
