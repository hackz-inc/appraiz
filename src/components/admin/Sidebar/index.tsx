"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./index.module.css";

type SidebarItem = {
	id: string;
	label: string;
	icon: string;
	type: "team" | "criteria";
};

type SidebarProps = {
	items: SidebarItem[];
	isOpen: boolean;
	currentHash?: string;
};

export function Sidebar({ items, isOpen, currentHash }: SidebarProps) {
	const [windowWidth, setWindowWidth] = useState(
		typeof window !== "undefined" ? window.innerWidth : 1280
	);
	const [animate, setAnimate] = useState({ opacity: 0, x: 0 });
	const [exit, setExit] = useState({ opacity: 0, x: 0 });

	// ウィンドウサイズの監視
	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// レスポンシブアニメーション設定
	useEffect(() => {
		const breakpoint = 1280; // lg breakpoint
		if (windowWidth < breakpoint) {
			// モバイル: スライドアニメーション
			setAnimate({ opacity: 1, x: 200 });
			setExit({ opacity: 0, x: -200 });
		} else {
			// デスクトップ: フェードのみ
			setAnimate({ opacity: 1, x: 0 });
			setExit({ opacity: 0, x: 0 });
		}
	}, [windowWidth]);

	// チームと採点項目でグループ化
	const teams = items.filter((item) => item.type === "team");
	const criteria = items.filter((item) => item.type === "criteria");

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.aside
					className={styles.sidebar}
					animate={animate}
					exit={exit}
					initial={{ opacity: 0, x: windowWidth < 1280 ? -200 : 0 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				>
					<div className={styles.sidebarContent}>
						{/* チーム一覧 */}
						<div className={styles.section}>
							<h3 className={styles.sectionTitle}>
								<span className={styles.sectionIcon}>👥</span>
								チーム
							</h3>
							{teams.length > 0 ? (
								<ul className={styles.itemList}>
									{teams.map((item) => {
										const isActive = currentHash === `#team-${item.id}`;
										return (
											<li key={item.id}>
												<Link
													href={`#team-${item.id}`}
													className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
												>
													<span className={styles.itemIcon}>{item.icon}</span>
													<span className={styles.itemLabel}>{item.label}</span>
												</Link>
											</li>
										);
									})}
								</ul>
							) : (
								<p className={styles.emptyMessage}>
									チームがまだ登録されていません
								</p>
							)}
						</div>

						{/* 採点項目一覧 */}
						<div className={styles.section}>
							<h3 className={styles.sectionTitle}>
								<span className={styles.sectionIcon}>📋</span>
								採点項目
							</h3>
							{criteria.length > 0 ? (
								<ul className={styles.itemList}>
									{criteria.map((item) => {
										const isActive = currentHash === `#criteria-${item.id}`;
										return (
											<li key={item.id}>
												<Link
													href={`#criteria-${item.id}`}
													className={`${styles.item} ${isActive ? styles.itemActive : ""}`}
												>
													<span className={styles.itemIcon}>{item.icon}</span>
													<span className={styles.itemLabel}>{item.label}</span>
												</Link>
											</li>
										);
									})}
								</ul>
							) : (
								<p className={styles.emptyMessage}>
									採点項目がまだ登録されていません
								</p>
							)}
						</div>
					</div>
				</motion.aside>
			)}
		</AnimatePresence>
	);
}
