import Link from "next/link";
import { Button } from "@/components/ui";

export default function IndexPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-8 bg-linear-to-br from-(--yellow-primary) to-(--yellow-lighten1)">
			<h1 className="text-[4.8rem] font-bold text-(--black-primary) mb-16 text-center">
				Apprai'zへようこそ
			</h1>

			<div className="flex flex-col gap-6 w-full max-w-md">
				<div>
					<p className="text-lg font-bold text-(--black-primary) mb-4 text-center">
						ゲストの方
					</p>
					<div className="flex flex-col gap-3">
						<Link href="/guest/auth/signup" className="w-full">
							新規登録
						</Link>
						<Link href="/guest/auth/login" className="w-full">
							ログイン
						</Link>
					</div>
				</div>

				<div className="mt-8">
					<p className="text-lg font-bold text-(--black-primary) mb-4 text-center">
						管理者の方
					</p>
					<Link href="/admin/auth/login" className="w-full">
						管理者ログイン
					</Link>
				</div>
			</div>
		</div>
	);
}
