import { useEffect, useRef, useState } from "react";
import {
	CalendarDaysIcon,
	EllipsisVerticalIcon,
	HandshakeIcon,
	PenLineIcon,
	Trash2Icon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CopyToClipboard } from "./CopyToClipboard";
import { HackathonTitle } from "./HackathonTitle";
import { LinkButton } from "./LinkButton";

type Props = {
	hackathon: {
		id: string;
		name: string;
		scoring_date: string;
		access_password: string;
		status?: "scheduled" | "finished";
	};
	onEditName?: () => void;
	onEditDate?: () => void;
	onDelete?: () => void;
};

export const AdminHackathonCard = ({
	hackathon,
	onEditName,
	onEditDate,
	onDelete,
}: Props) => {
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const handleAction = (fn?: () => void) => {
		setMenuOpen(false);
		fn?.();
	};

	return (
		<div
			className="relative w-full px-8 py-7 pb-10 shadow-md rounded-lg bg-white"
			id={hackathon.id}
			data-testid="hackathon-card"
		>
			{/* ⋮ メニュー */}
			<div ref={menuRef} className="absolute top-4 right-4">
				<button
					type="button"
					onClick={() => setMenuOpen((v) => !v)}
					aria-label="メニューを開く"
					className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
				>
					<EllipsisVerticalIcon size={20} />
				</button>

				{menuOpen && (
					<div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20">
						<Link
							to="/admin/hackathonList/$id/setting"
							params={{ id: hackathon.id }}
							search={{ tab: "guest" }}
							onClick={() => setMenuOpen(false)}
							className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
						>
							<HandshakeIcon size={15} className="text-gray-400 shrink-0" />
							共同開催者を招待
						</Link>

						<button
							type="button"
							onClick={() => handleAction(onEditName)}
							className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
						>
							<PenLineIcon size={15} className="text-gray-400 shrink-0" />
							タイトルを編集
						</button>

						<button
							type="button"
							onClick={() => handleAction(onEditDate)}
							className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
						>
							<CalendarDaysIcon size={15} className="text-gray-400 shrink-0" />
							採点日を編集
						</button>

						<div className="my-1.5 border-t border-gray-100" />

						<button
							type="button"
							onClick={() => handleAction(onDelete)}
							className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
						>
							<Trash2Icon size={15} className="shrink-0" />
							削除
						</button>
					</div>
				)}
			</div>

			<HackathonTitle
				id={hackathon.id}
				name={hackathon.name}
				scoringDate={new Date(hackathon.scoring_date)}
				status={hackathon.status}
				className="mb-6"
			/>

			<div className="flex flex-col gap-6 mb-8">
				<CopyToClipboard
					itemTitle="アクセスパスワード"
					hackathonItem={hackathon.access_password}
				/>
				<CopyToClipboard
					itemTitle="採点リンク"
					hackathonItem={`http://${
						typeof window !== "undefined" ? window.location.host : ""
					}/scorer/${hackathon.id}`}
				/>
			</div>

			<div className="flex gap-[34px] justify-center">
				<LinkButton to={`/admin/hackathonList/${hackathon.id}/setting`}>
					フォームの設定
				</LinkButton>
				<LinkButton to={`/admin/hackathonList/${hackathon.id}/result`}>
					結果を見る
				</LinkButton>
			</div>
		</div>
	);
};
