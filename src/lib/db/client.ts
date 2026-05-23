import { drizzle } from "drizzle-orm/d1";
import type { Env } from "#/types/cloudflare";
import * as schema from "./schema";

type CloudflareContext = { cloudflare?: { env?: Env } };

export function getDb(context: CloudflareContext) {
	const DB = context?.cloudflare?.env?.DB;
	if (!DB) {
		throw new Error(
			'D1 database not available. Make sure the Cloudflare context is passed correctly.',
		);
	}
	return drizzle(DB, { schema });
}
