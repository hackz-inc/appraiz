import Link from "next/link";
import { Card, CopyButton } from "@/components/ui";
import type { Hackathon } from "@/lib/hackathons";
import { HackathonActionButtons } from "./HackathonActionButtons";

interface Props {
	hackathon: Hackathon;
}

export function HackathonCard({ hackathon }: Props) {
	return (
		<Card>
			<div className="mb-4">
				<div className="flex justify-between items-center mb-2">
					<h3 className="text-xl font-bold text-[var(--black-primary)]">
						{hackathon.name}
					</h3>
					<HackathonActionButtons hackathon={hackathon} />
				</div>
				<div className="flex items-center gap-2 text-sm text-[var(--black-lighten1)] mb-4">
					{new Date(hackathon.scoring_date).toLocaleDateString("ja-JP")}
				</div>

				<div className="flex flex-col gap-3 p-4 bg-[#f5f5f5] rounded-lg mt-3">
					<div className="flex flex-col gap-2">
						<div className="text-xs font-semibold text-[var(--black-lighten1)] uppercase tracking-wide">
							採点URL:
						</div>
						<div className="flex items-center gap-2 flex-wrap">
							<code className="font-['Monaco','Courier_New',monospace] text-[13px] px-3 py-1.5 bg-white border border-[#ddd] rounded text-[var(--black-primary)] break-all flex-1 min-w-0">
								{`http://localhost/score/${hackathon.id}`}
							</code>
							<CopyButton text={`http://localhost/score/${hackathon.id}`} />
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<div className="text-xs font-semibold text-[var(--black-lighten1)] uppercase tracking-wide">
							アクセスパスワード:
						</div>
						<div className="flex items-center gap-2 flex-wrap">
							<code className="font-['Monaco','Courier_New',monospace] text-[13px] px-3 py-1.5 bg-white border border-[#ddd] rounded text-[var(--black-primary)] break-all flex-1 min-w-0">
								{hackathon.access_password}
							</code>
							<CopyButton text={hackathon.access_password} />
						</div>
					</div>
				</div>
			</div>

			<div className="flex gap-2 mt-4">
				<Link
					href={`/admin/hackathons/${hackathon.id}`}
					className="inline-flex items-center justify-center px-8 py-3 bg-[var(--yellow-primary)] text-[var(--black-primary)] font-bold text-base rounded-3xl no-underline transition-opacity hover:opacity-90"
				>
					フォーム一覧
				</Link>

				<Link
					href={`/admin/hackathons/${hackathon.id}/results`}
					className="inline-flex items-center justify-center px-8 py-3 bg-[var(--yellow-primary)] text-[var(--black-primary)] font-bold text-base rounded-3xl no-underline transition-opacity hover:opacity-90"
				>
					📊 結果
				</Link>
			</div>
		</Card>
	);
}
