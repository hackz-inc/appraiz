import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import type { Env, ExecutionContext } from "./types/cloudflare";
import "./types/cloudflare";

const startHandler = createStartHandler(defaultStreamHandler);

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return startHandler(request, {
			context: { cloudflare: { env, ctx } },
		});
	},
};
