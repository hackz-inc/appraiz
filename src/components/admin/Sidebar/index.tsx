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
	type: "team" | "criteria" | "guest";
};

type SidebarProps = {
	items: SidebarItem[];
	isOpen: boolean;
	currentHash?: string;
	onClose?: () => void;
	hackathonId: string;
};

export function Sidebar({ items, isOpen, currentHash, onClose, hackathonId }: SidebarProps) {
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

	// チーム、採点項目、ゲストでグループ化
	const teams = items.filter((item) => item.type === "team");
	const criteria = items.filter((item) => item.type === "criteria");
	const guests = items.filter((item) => item.type === "guest");

	// ページ遷移処理
	const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, item: SidebarItem) => {
		e.preventDefault();

		let path = "";
		if (item.type === "team") {
			path = `/admin/hackathons/${hackathonId}/teams/${item.id}`;
		} else if (item.type === "criteria") {
			path = `/admin/hackathons/${hackathonId}/criteria/${item.id}`;
		} else if (item.type === "guest") {
			path = `/admin/hackathons/${hackathonId}/guests`;
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
						{/* チーム一覧 */}
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
							{teams.length > 0 ? (
								<p className={styles.sectionCount}>{teams.length}件</p>
							) : (
								<p className={styles.emptyMessage}>
									チームがまだ登録されていません
								</p>
							)}
						</div>

						{/* 採点項目一覧 */}
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
							{criteria.length > 0 ? (
								<p className={styles.sectionCount}>{criteria.length}件</p>
							) : (
								<p className={styles.emptyMessage}>
									採点項目がまだ登録されていません
								</p>
							)}
						</div>

						{/* ゲスト一覧 */}
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
							{guests.length > 0 ? (
								<p className={styles.sectionCount}>{guests.length}件</p>
							) : (
								<p className={styles.emptyMessage}>
									ゲストがまだ登録されていません
								</p>
							)}
						</div>
					</div>
				</motion.aside>
			)}
		</AnimatePresence>
	);
}
