"use client";

import { Breadcrumb } from "@/components/ui";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface Props {
	breadcrumbs?: BreadcrumbItem[];
	isMenuOpen?: boolean;
	onMenuToggle?: () => void;
}

export const AdminHeader = ({ breadcrumbs }: Props) => {
	return (
		<header className="sticky top-0 z-[var(--z-index-high)] backdrop-blur-[12px] bg-gradient-to-r from-[rgba(250,190,0,0.95)] via-[rgba(253,235,179,0.95)] to-[rgba(255,250,190,0.95)] border-b-4 border-[var(--yellow-primary)] shadow-[var(--shadow-xl)]">
			<div className="py-4 flex items-center justify-between">
				<div className="flex items-center gap-3 no-underline">
					<div>
						<h1 className="text-xl font-black text-[var(--black-primary)] [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.1))]">
							Apprai'z
						</h1>
						<p className="text-xs text-[var(--black-lighten1)] font-medium">
							管理画面
						</p>
					</div>
				</div>
			</div>

			{breadcrumbs && breadcrumbs.length > 0 && (
				<div className="pb-4">
					<Breadcrumb items={breadcrumbs} />
				</div>
			)}
		</header>
	);
};
