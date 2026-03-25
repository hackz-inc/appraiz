import { Button, Card } from "@/components/ui";
import Link from "next/link";
import styles from "./HackathonCardList.module.css";

type Props = {
	hackathon: {
		id: string;
		name: string;
		scoring_date: string;
	};
};

export function HackathonCard({ hackathon }: Props) {
	return (
		<Card key={hackathon.id}>
			<div className={styles.cardContent}>
				<h3 className={styles.hackathonTitle}>{hackathon.name}</h3>
				<div className={styles.hackathonMeta}>
					<span>
						{new Date(hackathon.scoring_date).toLocaleDateString("ja-JP")}
					</span>
				</div>
			</div>
			<div className={styles.buttonGroup}>
				<Link
					key={hackathon.id}
					href={`/admin/hackathons/${hackathon.id}`}
					className={styles.cardLink}
				>
					⚙️ 設定
				</Link>
				<Link
					href={`/admin/hackathons/${hackathon.id}/results`}
					className={styles.link}
				>
					📊 結果
				</Link>
			</div>
		</Card>
	);
}
