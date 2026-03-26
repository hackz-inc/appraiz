import styles from "./page.module.css";

export default function Home() {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Apprai'z</h1>
			<p className={styles.description}>ハッカソン採点システム</p>
		</div>
	);
}
