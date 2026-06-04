import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { getDb } from "#/lib/db/client";
import { hackathon } from "#/lib/db/schema";
import "#/types/cloudflare";
import type { Hackathon, ScoringItem, Team } from "#/lib/db/types";
import { checkUaScored } from "#/routes/admin/hackathonList/-functions/hackathon";
import { AccessPasswordForm } from "./-components/AccessPasswordForm";
import type { ScoringFormData } from "./-components/ScoringForm";
import { ScoringForm } from "./-components/ScoringForm";
import { ScoringPreview } from "./-components/ScoringPreview";

type TeamWithOrder = Team & { order: number };

type HackathonWithDetails = Hackathon & {
	teams: TeamWithOrder[];
	scoring_items: ScoringItem[];
};

const fetchScorerHackathon = createServerFn({ method: "GET" })
	.inputValidator((hackathonId: string) => hackathonId)
	.handler(async (ctx) => {
		const hackathonId = ctx.data;
		const db = getDb(ctx.context!);

		const data = await db.query.hackathon.findFirst({
			where: eq(hackathon.id, hackathonId),
			with: {
				teams: {
					with: { presentation_orders: true },
				},
				scoring_items: true,
			},
		});

		if (!data) throw new Error("Hackathon not found");

		const teamsWithOrder = data.teams
			.map((t) => ({
				...t,
				order: t.presentation_orders?.[0]?.order ?? 0,
			}))
			.sort((a, b) => a.order - b.order);

		const sortedScoringItems = [...data.scoring_items].sort(
			(a, b) =>
				new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
		);

		return {
			...data,
			teams: teamsWithOrder,
			scoring_items: sortedScoringItems,
		} as HackathonWithDetails;
	});

export const Route = createFileRoute("/scorer/$hackathonId/")({
	head: ({ loaderData }) => {
		const d = loaderData as { hackathon: { name: string } } | undefined;
		return { meta: [{ title: `${d?.hackathon?.name ?? ""} - 採点 | Apprai'z` }] };
	},
	loader: async ({ params }) => {
		const hackathonData = await fetchScorerHackathon({
			data: params.hackathonId,
		});
		return { hackathon: hackathonData };
	},
	pendingComponent: () => <div className="bg-white">データを読み込み中...</div>,
	component: ScorerPage,
});

function ScorerPage() {
	const { hackathon: hackathonData } = Route.useLoaderData() as { hackathon: HackathonWithDetails };
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isChecking, setIsChecking] = useState(true);
	const [passwordError, setPasswordError] = useState("");

	const storageKey = `scorer_access_password_${hackathonData.id}`;
	const scoredCookieKey = `scored_${hackathonData.id}`;
	const sessionIdKey = `scorer_session_id_${hackathonData.id}`;

	const getOrCreateSessionId = () => {
		let id = localStorage.getItem(sessionIdKey);
		if (!id) {
			id = crypto.randomUUID();
			localStorage.setItem(sessionIdKey, id);
		}
		return id;
	};

	const [alreadyScored, setAlreadyScored] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const storedPassword = localStorage.getItem(storageKey);
		if (storedPassword === hackathonData.access_password) {
			setIsAuthenticated(true);
		}

		const cookieScored = document.cookie
			.split(";")
			.some((c) => c.trim().startsWith(`${scoredCookieKey}=`));

		if (cookieScored) {
			setAlreadyScored(true);
			setIsChecking(false);
			return () => {
				cancelled = true;
			};
		}

		const sessionId = getOrCreateSessionId();

		checkUaScored({
			data: { hackathonId: hackathonData.id, userAgent: sessionId },
		})
			.then((result) => {
				if (!cancelled) {
					if (result.scored) {
						setAlreadyScored(true);
						const expires = new Date(
							Date.now() + 30 * 24 * 60 * 60 * 1000,
						).toUTCString();
						document.cookie = `${scoredCookieKey}=true; expires=${expires}; path=/; SameSite=Lax`;
					}
					setIsChecking(false);
				}
			})
			.catch(() => {
				if (!cancelled) setIsChecking(false);
			});

		return () => {
			cancelled = true;
		};
	}, [
		hackathonData.access_password,
		hackathonData.id,
		storageKey,
		scoredCookieKey,
	]);

	const handlePasswordSubmit = (password: string) => {
		if (password === hackathonData.access_password) {
			localStorage.setItem(storageKey, password);
			setIsAuthenticated(true);
			setPasswordError("");
		} else {
			setPasswordError("パスワードが正しくありません");
		}
	};

	if (isChecking) {
		return <div className="min-h-screen bg-white" />;
	}

	if (alreadyScored) {
		const previewKey = `hackathon_scoring_${hackathonData.id}_preview`;
		const raw = localStorage.getItem(previewKey);
		if (raw) {
			try {
				const { judgeName, scoringData } = JSON.parse(raw) as {
					judgeName: string;
					scoringData: ScoringFormData[];
				};
				const fixedData = scoringData.map((item, index) => ({
					...item,
					comment: item.comment ?? "",
					order: item.order || index + 1,
				}));
				return <ScoringPreview judgeName={judgeName} scoringData={fixedData} />;
			} catch {
				// fall through to simple message
			}
		}
		return (
			<div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
				<p className="text-xl font-bold text-gray-800">採点は完了しています</p>
				<p className="text-sm text-gray-500">
					このハッカソンへの採点は既に送信済みです。
				</p>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<AccessPasswordForm
				hackathonId={hackathonData.id}
				hackathonName={hackathonData.name}
				onSubmit={handlePasswordSubmit}
				externalError={passwordError}
				onError={setPasswordError}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<header className="bg-white border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-[800px] mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-gray-900">
							{hackathonData.name}
						</h1>
						{/* <button
							type="button"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
						>
							{isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
						</button> */}
					</div>
				</div>
			</header>

			<div className="flex">
				{/* {isMenuOpen && (
					<aside className="w-64 bg-white border-r border-gray-200 p-4 h-screen sticky top-16 overflow-y-auto">
						<h2 className="text-lg font-bold text-gray-900 mb-4">チーム一覧</h2>
						<nav className="space-y-2">
							{hackathonData.teams.map((team) => (
								<a
									key={team.id}
									href={`#${team.id}`}
									className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
								>
									No.{team.order} : {team.name}
								</a>
							))}
						</nav>
					</aside>
				)} */}

				<main className="flex-1">
					<ScoringForm
						hackathon={hackathonData}
						sessionId={getOrCreateSessionId()}
					/>
				</main>
			</div>
		</div>
	);
}
