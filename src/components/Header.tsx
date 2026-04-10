import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

interface HeaderProps {
	breadcrumbItems?: BreadcrumbItem[];
	actions?: React.ReactNode;
}

export default function Header({ breadcrumbItems, actions }: HeaderProps) {
	return (
		<header className="sticky h-26 top-0 z-50 bg-white shadow-md px-4 py-6 md:px-20 flex items-center gap-7 justify-between">
			{breadcrumbItems && breadcrumbItems.length > 0 && (
				<Breadcrumb items={breadcrumbItems} />
			)}
			{actions && <div className="flex items-center gap-4">{actions}</div>}
		</header>
	);
}
