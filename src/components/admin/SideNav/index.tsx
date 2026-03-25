"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

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
		<nav className="w-64 bg-white border-r border-black-lighten4 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
			<div className="p-6">
				<h3 className="text-sm font-bold text-black-lighten2 uppercase tracking-wider mb-4">
					設定メニュー
				</h3>
				<ul className="space-y-2">
					{items.map((item) => {
						const isActive = currentTab === item.query;
						return (
							<li key={item.query}>
								<Link
									href={`/admin/hackathons/${hackathonId}?tab=${item.query}`}
									className={`
										flex items-center gap-3 px-4 py-3 rounded-lg
										transition-all duration-200
										${
											isActive
												? "bg-yellow-primary text-black-primary font-bold shadow-md"
												: "text-black-lighten1 hover:bg-black-lighten5 hover:text-black-primary"
										}
									`}
								>
									<span className="text-xl">{item.icon}</span>
									<span className="text-sm">{item.label}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</nav>
	);
}
