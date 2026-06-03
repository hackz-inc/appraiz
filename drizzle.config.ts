import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "drizzle-kit";

function findLocalD1() {
	const dir = join(
		process.cwd(),
		".wrangler/state/v3/d1/miniflare-D1DatabaseObject",
	);
	try {
		const files = readdirSync(dir).filter(
			(f) => f.endsWith(".sqlite") && !f.includes("metadata"),
		);
		if (files.length === 0) return ".wrangler/state/v3/d1/local.sqlite";
		const newest = files.sort(
			(a, b) =>
				statSync(join(dir, b)).mtimeMs - statSync(join(dir, a)).mtimeMs,
		)[0];
		return join(dir, newest);
	} catch {
		// fall through
	}
	return ".wrangler/state/v3/d1/local.sqlite";
}

export default defineConfig({
	schema: "./src/lib/db/schema.ts",
	out: "./drizzle/migrations",
	dialect: "sqlite",
	dbCredentials: {
		url: findLocalD1(),
	},
});
