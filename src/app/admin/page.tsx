import { AdminHeader } from "./_components/AdminHeader";
import { CreateHackathonButton } from "./_components/CreateHackathonButton";
import { HackathonCardList } from "./_components/HackathonCardList";
import styles from "./page.module.css";

export default function AdminPage() {
	return (
		<>
			<AdminHeader breadcrumbs={[{ label: "ホーム" }]} />
			<main className={styles.main}>
				<div className={styles.header}>
					<p className={styles.title}>ハッカソン一覧</p>
					<CreateHackathonButton />
				</div>

				<HackathonCardList />
			</main>
		</>
	);
}
