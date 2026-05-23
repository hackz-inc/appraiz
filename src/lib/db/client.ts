import { drizzle } from "drizzle-orm/d1";
import { getEvent } from "vinxi/http";
import * as schema from "./schema";

export function getDb() {
	const event = getEvent() as unknown as {
		context?: { cloudflare?: { env?: { DB?: D1Database } } };
	};
	const DB = event?.context?.cloudflare?.env?.DB;

	if (!DB) {
		throw new Error(
			"Cloudflare D1 binding \"DB\" not found.\n" +
			"ローカル開発は `pnpm dev:wrangler` を使用してください。\n" +
			"または wrangler.toml の database_id を設定後、wrangler pages dev を実行してください。",
		);
	}

	return drizzle(DB, { schema });
}
