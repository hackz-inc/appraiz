import { CopyToClipboard } from "./CopyToClipboard";
import { HackathonTitle } from "./HackathonTitle";
import { LinkButton } from "./LinkButton";

interface AdminHackathonCardProps {
	hackathon: {
		id: string;
		name: string;
		scoring_date: string;
		access_password: string;
		status?: "scheduled" | "finished";
	};
	onEdit?: () => void;
	onDelete?: () => void;
}

export const AdminHackathonCard = ({
	hackathon,
	onEdit,
	onDelete,
}: AdminHackathonCardProps) => {
	return (
		<div
			className="w-full px-8 py-7 pb-10 shadow-md rounded-lg"
			id={hackathon.id}
			data-testid="hackathon-card"
		>
			<HackathonTitle
				id={hackathon.id}
				name={hackathon.name}
				scoringDate={new Date(hackathon.scoring_date)}
				status={hackathon.status}
				className="mb-6"
				onEdit={onEdit}
				onDelete={onDelete}
			/>
			<div className="flex flex-col gap-6 mb-8">
				<CopyToClipboard
					itemTitle="アクセスパスワード"
					hackathonItem={hackathon.access_password}
				/>
				<CopyToClipboard
					itemTitle="採点リンク"
					hackathonItem={`https://${
						typeof window !== "undefined" ? window.location.host : ""
					}/${hackathon.id}`}
				/>
			</div>
			<div className="flex gap-[34px] justify-center">
				{hackathon.status === "scheduled" && (
					<LinkButton to={`/admin/hackathonList/${hackathon.id}`}>
						フォームに移動
					</LinkButton>
				)}
				<LinkButton to={`/admin/result/${hackathon.id}`}>
					結果を見る
				</LinkButton>
			</div>
		</div>
	);
};
