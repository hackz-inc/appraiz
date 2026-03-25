"use client";

import Link from "next/link";
import { Container, Breadcrumb } from "@/components/ui";
import styles from "./AdminHeader.module.css";
import { SignOutButton } from "./SignOutButton";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface AdminHeaderProps {
	breadcrumbs?: BreadcrumbItem[];
	showMenuButton?: boolean;
	isMenuOpen?: boolean;
	onMenuToggle?: () => void;
}

export const AdminHeader = ({
	breadcrumbs,
	showMenuButton,
	isMenuOpen,
	onMenuToggle,
}: AdminHeaderProps) => {
	return (
		<header className={styles.header}>
			<Container>
				<div className={styles.content}>
					<div className={styles.left}>
						{showMenuButton && onMenuToggle && (
							<button
								className={styles.menuButton}
								onClick={onMenuToggle}
								aria-label="メニューを開く"
							>
								<div
									className={`${styles.hamburger} ${
										isMenuOpen ? styles.hamburgerOpen : ""
									}`}
								>
									<span></span>
									<span></span>
									<span></span>
								</div>
							</button>
						)}
						<Link href="/admin" className={styles.logoLink}>
							<div className={styles.logo}>
								<h1 className={styles.title}>Apprai'z</h1>
								<p className={styles.subtitle}>管理画面</p>
							</div>
						</Link>
					</div>
					<SignOutButton />
				</div>

				{breadcrumbs && breadcrumbs.length > 0 && (
					<div className={styles.breadcrumbWrapper}>
						<Breadcrumb items={breadcrumbs} />
					</div>
				)}
			</Container>
		</header>
	);
};
