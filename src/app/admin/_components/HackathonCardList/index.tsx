import { hackathons } from "@/lib/hackathons";
import { Card } from "@/components/ui";
import Link from "next/link";
import styles from "./index.module.css";

export async function HackathonCardList() {
	const data = await hackathons.getAll();

	if (!data || data.length === 0) {
		return <div>データがありません。</div>;
	}

	return (
		<ul className={styles.list}>
			{data.map((hackathon) => (
				<Card key={hackathon.id}>
					<div className={styles.cardContent}>
						<h3 className={styles.hackathonTitle}>{hackathon.name}</h3>
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
			))}
		</ul>
	);
}
