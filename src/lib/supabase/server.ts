// 修正案：型安全性を高める
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
// 型定義は Supabase CLI で生成したものを推奨
// import type { Database } from "@/types/supabase";

export const createClient = async () => {
	const cookieStore = await cookies();

	// 環境変数の存在チェック（デバッグが楽になります）
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !key) {
		throw new Error("Missing Supabase environment variables");
	}

	return createServerClient(url, key, {
		cookies: {
			getAll: () => cookieStore.getAll(),
			setAll: (cookiesToSet) => {
				try {
					cookiesToSet.forEach(({ name, value, options }) =>
						cookieStore.set(name, value, options),
					);
				} catch {
					// サーバーコンポーネント内での更新失敗を無視
				}
			},
		},
	});
};
