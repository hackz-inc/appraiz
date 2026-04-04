import Link from "next/link";

export default function IndexPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-32 bg-gradient-to-br from-[var(--color-yellow-primary)] to-[var(--color-yellow-lighten1)]">
			<h1 className="text-[4.8rem] font-bold text-[var(--color-black-primary)] mb-32 text-center">
				Apprai'zへようこそ
			</h1>

			<div className="flex flex-col gap-6 w-full max-w-md">
				<Link href="/guest" className="w-full">
					ゲストとして参加
				</Link>

				<Link href="/scoring" className="w-full">
					採点者として参加
				</Link>
			</div>
		</div>
	);
}
