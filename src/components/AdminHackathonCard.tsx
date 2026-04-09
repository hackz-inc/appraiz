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
	onEdit?: () => void;
	onDelete?: () => void;
	onCollaboratorClick?: () => void;
};

export const AdminHackathonCard = ({
	hackathon,
	onEdit,
	onDelete,
	onCollaboratorClick,
}: Props) => {
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
				onCollaboratorClick={onCollaboratorClick}
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
				<LinkButton to={`/admin/hackathonList/${hackathon.id}/setting`}>
					チーム・採点項目を設定
				</LinkButton>

				<LinkButton to={`/admin/hackathonList/${hackathon.id}/result`}>
					結果を見る
				</LinkButton>
			</div>
		</div>
	);
};
