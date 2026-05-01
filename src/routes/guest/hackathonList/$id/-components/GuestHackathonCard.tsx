import { CopyToClipboard } from "#/components/CopyToClipboard";
import { HackathonTitle } from "#/components/HackathonTitle";
import { LinkButton } from "#/components/LinkButton";

type Props = {
	hackathon: {
		id: string;
		name: string;
		scoring_date: string;
		access_password: string;
	};
};

export const GuestHackathonCard = ({ hackathon }: Props) => {
	return (
		<div
			className="w-full px-8 py-7 pb-10 shadow-md rounded-lg bg-white"
			id={hackathon.id}
			data-testid="guest-hackathon-card"
		>
			<HackathonTitle
				id={hackathon.id}
				name={hackathon.name}
				scoringDate={new Date(hackathon.scoring_date)}
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
				<LinkButton to={`/guest/hackathonList/${hackathon.id}/result`}>
					結果を見る
				</LinkButton>
			</div>
		</div>
	);
};
