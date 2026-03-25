"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";

type SidebarItem = {
	id: string;
	label: string;
	icon: string;
	type: "team" | "criteria" | "guest" | "hackathon" | "tab";
};

type SidebarProps = {
	items: SidebarItem[];
	isOpen: boolean;
	currentHash?: string;
	currentTab?: string;
	onClose?: () => void;
	hackathonId: string;
};

export function Sidebar({ items, isOpen, currentHash, currentTab, onClose, hackathonId }: SidebarProps) {
	const router = useRouter();
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

	// チーム、採点項目、ゲスト、ハッカソン、タブでグループ化
	const tabs = items.filter((item) => item.type === "tab");
	const teams = items.filter((item) => item.type === "team");
	const criteria = items.filter((item) => item.type === "criteria");
	const guests = items.filter((item) => item.type === "guest");
	const hackathons = items.filter((item) => item.type === "hackathon");

	// ページ遷移処理
	const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, item: SidebarItem) => {
		e.preventDefault();

		let path = "";
		if (item.type === "tab") {
			path = `/admin/hackathons/${hackathonId}?tab=${item.id}`;
		} else if (item.type === "team") {
			path = `/admin/hackathons/${hackathonId}/teams/${item.id}`;
		} else if (item.type === "criteria") {
			path = `/admin/hackathons/${hackathonId}/criteria/${item.id}`;
		} else if (item.type === "guest") {
			path = `/admin/hackathons/${hackathonId}/guests`;
		} else if (item.type === "hackathon") {
			path = `/admin/hackathons/${item.id}`;
		}

		// モバイルの場合はサイドバーを閉じる
		if (windowWidth < 1280 && onClose) {
			onClose();
		}

		router.push(path);
	};

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
						{/* タブ一覧 */}
						{tabs.length > 0 && (
							<div className={styles.section}>
								<ul className={styles.itemList}>
									{tabs.map((tab) => (
										<li key={tab.id}>
											<Link
												href={`/admin/hackathons/${hackathonId}?tab=${tab.id}`}
												className={`${styles.item} ${currentTab === tab.id ? styles.itemActive : ""}`}
												onClick={(e) => handleNavigate(e, tab)}
											>
												<span className={styles.itemIcon}>{tab.icon}</span>
												<span className={styles.itemLabel}>{tab.label}</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}

						{/* ハッカソン一覧 */}
						{hackathons.length > 0 && (
							<div className={styles.section}>
								<Link
									href="/admin"
									className={styles.sectionTitleLink}
									onClick={() => {
										if (windowWidth < 1280 && onClose) {
											onClose();
										}
									}}
								>
									<h3 className={styles.sectionTitle}>
										<span className={styles.sectionIcon}>🎯</span>
										ハッカソン
									</h3>
								</Link>
								<p className={styles.sectionCount}>{hackathons.length}件</p>
							</div>
						)}

						{/* チーム一覧 */}
						{teams.length > 0 && (
							<div className={styles.section}>
								<Link
									href={`/admin/hackathons/${hackathonId}/teams`}
									className={styles.sectionTitleLink}
									onClick={() => {
										if (windowWidth < 1280 && onClose) {
											onClose();
										}
									}}
								>
									<h3 className={styles.sectionTitle}>
										<span className={styles.sectionIcon}>👥</span>
										チーム
									</h3>
								</Link>
								<p className={styles.sectionCount}>{teams.length}件</p>
							</div>
						)}

						{/* 採点項目一覧 */}
						{criteria.length > 0 && (
							<div className={styles.section}>
								<Link
									href={`/admin/hackathons/${hackathonId}/criteria`}
									className={styles.sectionTitleLink}
									onClick={() => {
										if (windowWidth < 1280 && onClose) {
											onClose();
										}
									}}
								>
									<h3 className={styles.sectionTitle}>
										<span className={styles.sectionIcon}>📋</span>
										採点項目
									</h3>
								</Link>
								<p className={styles.sectionCount}>{criteria.length}件</p>
							</div>
						)}

						{/* ゲスト一覧 */}
						{guests.length > 0 && (
							<div className={styles.section}>
								<Link
									href={`/admin/hackathons/${hackathonId}/guests`}
									className={styles.sectionTitleLink}
									onClick={() => {
										if (windowWidth < 1280 && onClose) {
											onClose();
										}
									}}
								>
									<h3 className={styles.sectionTitle}>
										<span className={styles.sectionIcon}>🎤</span>
										ゲスト
									</h3>
								</Link>
								<p className={styles.sectionCount}>{guests.length}件</p>
							</div>
						)}
					</div>
				</motion.aside>
			)}
		</AnimatePresence>
	);
}
