"use client";

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { useTeams } from "@/hooks/useTeams";
import { DeleteTeamButton } from "../DeleteTeamButton";
import styles from "./index.module.css";

type TeamsSectionProps = {
	hackathonId: string;
};

export function TeamsSection({ hackathonId }: TeamsSectionProps) {
	const { teams: teamList, isLoading: teamsLoading } = useTeams(hackathonId);

	if (teamsLoading) {
		return (
			<div className={styles.loadingContent}>
				<div className={styles.loadingIconWrapper}>
					<div className={styles.loadingIconPing} />
					<div className={styles.loadingIcon}>
						<span className={styles.loadingEmoji}>⏳</span>
					</div>
				</div>
				<p className={styles.loadingText}>読み込み中...</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.headerText}>
					<h2 className={styles.headerTitle}>
						<span className={styles.headerTitleEmoji}>👥</span>
						<span>チーム</span>
					</h2>
					<p className={styles.headerDescription}>参加チームを管理します</p>
				</div>
				<Link href={`/admin/hackathons/${hackathonId}/teams/new`}>
					<Button variant="primary">➕ チーム追加</Button>
				</Link>
			</div>
			{!teamList || teamList.length === 0 ? (
				<Card className={styles.emptyCard}>
					<div className={styles.emptyContent}>
						<div className={styles.emptyIcon}>
							<span className={styles.emptyEmoji}>👥</span>
						</div>
						<p className={styles.emptyText}>
							チームがまだ登録されていません
						</p>
					</div>
				</Card>
			) : (
				<div className={styles.teamsGrid}>
					{teamList.map((team) => (
						<Card key={team.id}>
							<div className={styles.teamCard}>
								<div className={styles.teamIcon}>
									<span className={styles.teamEmoji}>👥</span>
								</div>
								<div className={styles.teamContent}>
									<h3 className={styles.teamName}>
										{team.name}
									</h3>
									<div className={styles.teamActions}>
										<Link
											href={`/admin/hackathons/${hackathonId}/teams/${team.id}`}
											className={styles.teamEditLink}
										>
											<Button variant="secondary" size="sm" fullWidth>
												✏️ 編集
											</Button>
										</Link>
										<DeleteTeamButton
											teamId={team.id}
											hackathonId={hackathonId}
										/>
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
