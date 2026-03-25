import { getHackathons } from "@/lib/server/hackathons";
import { HackathonCard } from "../HackathonCard";
import styles from "./index.module.css";

export async function HackathonCardList() {
	const data = await getHackathons();

	if (!data || data.length === 0) {
		return <div>データがありません。</div>;
	}

	return (
		<ul className={styles.list}>
			{data.map((hackathon) => (
				<li key={hackathon.id}>
					<HackathonCard hackathon={hackathon} />
				</li>
			))}
		</ul>
	);
}
