import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Apprai'z" }] }),
	component: TopPage,
});

function TopPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<div className="flex-1 flex flex-col items-center justify-center bg-linear-to-br from-brand-teal to-brand-yellow px-6 py-20">
				<div className="text-center mb-16">
					<h1 className="text-6xl sm:text-8xl font-black tracking-tight mb-4">
						Apprai'z
					</h1>
					<p className="text-lg sm:text-xl font-medium">
						ハッカソン採点プラットフォームああああ
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
					{/* Guest */}
					<Link
						to="/guest/hackathonList"
						className="flex-1 group bg-white rounded-[28px_0_28px_28px] p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
					>
						<div className="mb-4">
							<span className="inline-block text-3xl mb-3">🤝</span>
							<h2 className="text-xl font-black text-gray-900">共同開催者</h2>
						</div>
						<p className="text-sm text-gray-500 mb-6 leading-relaxed">
							ハッカソンのチームや採点項目を管理し、結果を確認できます。
						</p>
						<div className="flex items-center gap-2 text-sm font-bold text-brand-teal group-hover:gap-3 transition-all">
							<span>ログイン</span>
							<span>→</span>
						</div>
					</Link>

					{/* Scorer */}
					<button
						type="button"
						className="flex-1 group bg-white rounded-[28px_0_28px_28px] p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-left"
					>
						<div className="mb-4">
							<span className="inline-block text-3xl mb-3">✍️</span>
							<h2 className="text-xl font-black text-gray-900">採点者</h2>
						</div>
						<p className="text-sm text-gray-500 mb-6 leading-relaxed">
							主催者から共有された採点URLからアクセスしてください。
						</p>
					</button>
				</div>
			</div>
		</div>
	);
}
