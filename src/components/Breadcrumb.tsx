import { Link } from "@tanstack/react-router";

export type BreadcrumbItem = {
	name: string;
	path?: string;
};

type BreadcrumbProps = {
	items: BreadcrumbItem[];
};

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
	return (
		<nav className="flex items-center">
			{items.map((item, index) => (
				<div key={item.name} className="flex items-center">
					{item.path ? (
						<Link
							to={item.path}
							className="text-base font-bold text-black no-underline hover:opacity-70 transition-opacity"
						>
							{item.name}
						</Link>
					) : (
						<span
							className="text-base font-bold text-black"
							data-testid="current-page"
						>
							{item.name}
						</span>
					)}
					{index < items.length - 1 && (
						<span className="mx-2 text-base font-bold text-gray-500">/</span>
					)}
				</div>
			))}
		</nav>
	);
};
