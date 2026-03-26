"use client";

import Link from "next/link";
import { Card, CopyButton } from "@/components/ui";
import type { Hackathon } from "@/lib/hackathons";
import { HackathonActionButtons } from "./HackathonActionButtons";
import styles from "./index.module.css";

interface Props {
	hackathon: Hackathon;
}

export function HackathonCard({ hackathon }: Props) {
	const scoringUrl = `http://localhost:3000/score/${hackathon.id}`;

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

				<div className={styles.accessInfo}>
					<div className={styles.infoRow}>
						<div className={styles.infoLabel}>採点URL:</div>
						<div className={styles.infoValue}>
							<code className={styles.code}>{scoringUrl}</code>
							<CopyButton text={scoringUrl} />
						</div>
					</div>
					<div className={styles.infoRow}>
						<div className={styles.infoLabel}>アクセスパスワード:</div>
						<div className={styles.infoValue}>
							<code className={styles.code}>{hackathon.access_password}</code>
							<CopyButton text={hackathon.access_password} />
						</div>
					</div>
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
