import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	console.log("Middleware called for path:", request.nextUrl.pathname);

	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					);
					response = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// /admin/auth/* paths don't require authentication
	if (request.nextUrl.pathname.startsWith("/admin/auth/")) {
		return response;
	}

	// /admin/* paths require admin authentication
	if (request.nextUrl.pathname.startsWith("/admin")) {
		console.log("user", user);
		if (!user) {
			return NextResponse.redirect(new URL("/admin/auth/login", request.url));
		}

		const userRole = user.user_metadata?.role;
		if (userRole !== "admin") {
			return NextResponse.redirect(new URL("/guest", request.url));
		}
	}

	// /guest/auth/* paths don't require authentication
	if (request.nextUrl.pathname.startsWith("/guest/auth/")) {
		return response;
	}

	// /guest/* paths require guest authentication
	if (request.nextUrl.pathname.startsWith("/guest")) {
		if (!user) {
			return NextResponse.redirect(new URL("/guest/auth/login", request.url));
		}
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
