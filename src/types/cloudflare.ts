import type { D1Database, ExecutionContext } from "@cloudflare/workers-types";
import type {} from "@tanstack/router-core";

export type { ExecutionContext };

export interface Env {
	DB: D1Database;
	JWT_SECRET?: string;
}

declare module "@tanstack/router-core" {
	interface Register {
		server: {
			requestContext: {
				cloudflare: { env: Env; ctx: ExecutionContext };
			};
		};
	}
}
