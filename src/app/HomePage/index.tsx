import styles from './index.module.css';

export default function HomePage() {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>
				Apprai'z
			</h1>
			<p className={styles.description}>
				ハッカソン採点システム
			</p>
		</div>
	);
}
