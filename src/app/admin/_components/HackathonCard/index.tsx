import Link from "next/link";
import { Card } from "@/components/ui";
import type { Hackathon } from "@/lib/hackathons";
import { HackathonActionButtons } from "./HackathonActionButtons";
import styles from "./index.module.css";

interface Props {
	hackathon: Hackathon;
}

export function HackathonCard({ hackathon }: Props) {
	return (
		<Card>
			<div className={styles.cardContent}>
				<div className={styles.titleRow}>
					<h3 className={styles.hackathonTitle}>{hackathon.name}</h3>
					<HackathonActionButtons hackathonId={hackathon.id} />
				</div>
				<div className={styles.hackathonMeta}>
					{new Date(hackathon.scoring_date).toLocaleDateString("ja-JP")}
				</div>
			</div>

			<div className={styles.buttonGroup}>
				<Link
					href={`/admin/hackathons/${hackathon.id}`}
					className={styles.link}
				>
					フォーム一覧
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
