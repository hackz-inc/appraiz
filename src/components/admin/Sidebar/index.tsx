"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SidebarItem = {
	id: string;
	label: string;
	icon: string;
	type: "team" | "criteria" | "guest" | "hackathon" | "tab";
};

type Props = {
	items: SidebarItem[];
	isOpen: boolean;
	currentHash?: string;
	currentTab?: string;
	onClose?: () => void;
	hackathonId: string;
};

export const Sidebar = ({
	items,
	isOpen,
	currentHash,
	currentTab,
	onClose,
	hackathonId,
}: Props) => {
	const router = useRouter();

	// チーム、採点項目、ゲスト、ハッカソン、タブでグループ化
	const tabs = items.filter((item) => item.type === "tab");
	const teams = items.filter((item) => item.type === "team");
	const criteria = items.filter((item) => item.type === "criteria");
	const guests = items.filter((item) => item.type === "guest");
	const hackathons = items.filter((item) => item.type === "hackathon");

	// ページ遷移処理
	const handleNavigate = (
		e: React.MouseEvent<HTMLAnchorElement>,
		item: SidebarItem,
	) => {
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

		// サイドバーを閉じる（モバイル）
		if (onClose) {
			onClose();
		}

		router.push(path);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.aside
					className="w-[200px] py-10 px-4 flex flex-col fixed top-[120px] -left-[200px] rounded-r shadow-[2px_2px_8px_0_rgba(33,33,33,0.1)] bg-white z-[1000] max-h-[calc(100vh-120px)] overflow-y-auto xl:py-6 xl:shadow-none xl:rounded-none xl:left-20 xl:border-r xl:border-[var(--black-lighten4)]"
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -200 }}
					initial={{ opacity: 0, x: -200 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				>
					<div className="flex flex-col gap-8">
						{/* タブ一覧 */}
						{tabs.length > 0 && (
							<div className="flex flex-col gap-2">
								<ul className="list-none p-0 m-0 flex flex-col gap-1">
									{tabs.map((tab) => (
										<li key={tab.id}>
											<Link
												href={`/admin/hackathons/${hackathonId}?tab=${tab.id}`}
												className={`flex items-center gap-3 px-3 py-3 rounded-lg no-underline text-[var(--black-lighten1)] text-sm font-medium transition-all cursor-pointer hover:bg-[var(--black-lighten5)] hover:text-[var(--black-primary)] ${
													currentTab === tab.id
														? "bg-[var(--yellow-primary)] text-[var(--black-primary)] font-bold shadow-[var(--shadow-md)]"
														: ""
												}`}
												onClick={(e) => handleNavigate(e, tab)}
											>
												<span className="text-xl shrink-0">{tab.icon}</span>
												<span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
													{tab.label}
												</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}

						{/* ハッカソン一覧 */}
						{hackathons.length > 0 && (
							<div className="flex flex-col gap-2">
								<Link
									href="/admin"
									className="no-underline rounded-lg transition-all p-2 -m-2 hover:bg-[var(--black-lighten5)] [&:hover_.section-title]:text-[var(--black-primary)]"
									onClick={() => {
										if (onClose) {
											onClose();
										}
									}}
								>
									<h3 className="section-title flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--black-lighten2)] transition-colors">
										<span className="text-base">🎯</span>
										ハッカソン
									</h3>
								</Link>
								<p className="py-2 px-3 text-sm text-[var(--black-lighten1)] font-semibold bg-[var(--black-lighten5)] rounded-md text-center">
									{hackathons.length}件
								</p>
							</div>
						)}

						{/* チーム一覧 */}
						{teams.length > 0 && (
							<div className="flex flex-col gap-2">
								<Link
									href={`/admin/hackathons/${hackathonId}/teams`}
									className="no-underline rounded-lg transition-all p-2 -m-2 hover:bg-[var(--black-lighten5)] [&:hover_.section-title]:text-[var(--black-primary)]"
									onClick={() => {
										if (onClose) {
											onClose();
										}
									}}
								>
									<h3 className="section-title flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--black-lighten2)] transition-colors">
										<span className="text-base">👥</span>
										チーム
									</h3>
								</Link>
								<p className="py-2 px-3 text-sm text-[var(--black-lighten1)] font-semibold bg-[var(--black-lighten5)] rounded-md text-center">
									{teams.length}件
								</p>
							</div>
						)}

						{/* 採点項目一覧 */}
						{criteria.length > 0 && (
							<div className="flex flex-col gap-2">
								<Link
									href={`/admin/hackathons/${hackathonId}/criteria`}
									className="no-underline rounded-lg transition-all p-2 -m-2 hover:bg-[var(--black-lighten5)] [&:hover_.section-title]:text-[var(--black-primary)]"
									onClick={() => {
										if (onClose) {
											onClose();
										}
									}}
								>
									<h3 className="section-title flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--black-lighten2)] transition-colors">
										<span className="text-base">📋</span>
										採点項目
									</h3>
								</Link>
								<p className="py-2 px-3 text-sm text-[var(--black-lighten1)] font-semibold bg-[var(--black-lighten5)] rounded-md text-center">
									{criteria.length}件
								</p>
							</div>
						)}

						{/* ゲスト一覧 */}
						{guests.length > 0 && (
							<div className="flex flex-col gap-2">
								<Link
									href={`/admin/hackathons/${hackathonId}/guests`}
									className="no-underline rounded-lg transition-all p-2 -m-2 hover:bg-[var(--black-lighten5)] [&:hover_.section-title]:text-[var(--black-primary)]"
									onClick={() => {
										if (onClose) {
											onClose();
										}
									}}
								>
									<h3 className="section-title flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--black-lighten2)] transition-colors">
										<span className="text-base">🎤</span>
										ゲスト
									</h3>
								</Link>
								<p className="py-2 px-3 text-sm text-[var(--black-lighten1)] font-semibold bg-[var(--black-lighten5)] rounded-md text-center">
									{guests.length}件
								</p>
							</div>
						)}
					</div>
				</motion.aside>
			)}
		</AnimatePresence>
	);
}
