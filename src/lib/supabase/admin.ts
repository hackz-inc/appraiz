import { createClient } from "@supabase/supabase-js";
// import type { Database } from "./types"; // 型定義のパスに合わせて調整してください

export const createAdminClient = () => {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!, // 注意：ANON_KEY ではなく SERVICE_ROLE_KEY
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		},
	);
};
