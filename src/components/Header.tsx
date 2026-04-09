export default function Header({ children }: { children: React.ReactNode }) {
	return (
		<header className="sticky h-26 top-0 z-50 bg-white shadow-md px-4 py-6 md:px-20 flex items-center gap-7 justify-between">
			{children}
		</header>
	);
}
