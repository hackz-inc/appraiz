"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./index.module.css";

type SideNavItem = {
	label: string;
	query: string;
	icon: string;
};

type SideNavProps = {
	hackathonId: string;
	items: SideNavItem[];
};

export function SideNav({ hackathonId, items }: SideNavProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentTab = searchParams.get("tab") || "teams";

	return (
		<nav className={styles.nav}>
			<div className={styles.container}>
				<h3 className={styles.heading}>
					設定メニュー
				</h3>
				<ul className={styles.list}>
					{items.map((item) => {
						const isActive = currentTab === item.query;
						return (
							<li key={item.query}>
								<Link
									href={`/admin/hackathons/${hackathonId}?tab=${item.query}`}
									className={`${styles.link} ${isActive ? styles.linkActive : styles.linkInactive}`}
								>
									<span className={styles.icon}>{item.icon}</span>
									<span className={styles.label}>{item.label}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</nav>
	);
}
