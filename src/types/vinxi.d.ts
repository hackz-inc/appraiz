declare module "vinxi/http" {
	interface CloudflareContext {
		env?: {
			DB?: D1Database;
			JWT_SECRET?: string;
		};
	}

	interface H3EventContext {
		cloudflare?: CloudflareContext;
	}

	interface H3Event {
		context: H3EventContext;
	}

	export function getEvent(): H3Event;
}
