"use client";

import { Breadcrumb } from "@/components/ui";
import styles from "./AdminHeader.module.css";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface AdminHeaderProps {
	breadcrumbs?: BreadcrumbItem[];
	isMenuOpen?: boolean;
	onMenuToggle?: () => void;
}

export const AdminHeader = ({ breadcrumbs }: AdminHeaderProps) => {
	return (
		<header className={styles.header}>
			<div className={styles.content}>
				<div className={styles.logo}>
					<h1 className={styles.title}>Apprai'z</h1>
					<p className={styles.subtitle}>管理画面</p>
				</div>
			</div>

			{breadcrumbs && breadcrumbs.length > 0 && (
				<div className={styles.breadcrumbWrapper}>
					<Breadcrumb items={breadcrumbs} />
				</div>
			)}
		</header>
	);
};
