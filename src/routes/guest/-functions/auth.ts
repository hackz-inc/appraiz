import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "#/lib/supabase/server";

interface SignUpData {
	email: string;
	password: string;
	name: string;
	company_name: string;
}

interface LoginData {
	email: string;
	password: string;
}

export const signUpGuest = createServerFn({ method: "POST" }).handler(
	async ({ data }: { data: SignUpData }) => {
		const supabase = getSupabaseServerClient();

		// Supabaseでユーザーを作成
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email: data.email,
			password: data.password,
		});

		if (authError) {
			throw new Error(authError.message);
		}

		if (!authData.user) {
			throw new Error("ユーザーの作成に失敗しました");
		}

		// guestテーブルにユーザー情報を保存
		const { error: insertError } = await supabase.from("guest").insert({
			id: authData.user.id,
			email: data.email,
			name: data.name,
			company_name: data.company_name,
		});

		if (insertError) {
			throw new Error(insertError.message);
		}

		return { success: true, user: authData.user };
	},
);

export const loginGuest = createServerFn({ method: "POST" }).handler(
	async ({ data }: { data: LoginData }) => {
		const supabase = getSupabaseServerClient();

		const { data: authData, error } = await supabase.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		});

		if (error) {
			throw new Error(error.message);
		}

		if (!authData.user) {
			throw new Error("ログインに失敗しました");
		}

		// guestテーブルからユーザー情報を取得
		const { data: guestData, error: guestError } = await supabase
			.from("guest")
			.select("*")
			.eq("id", authData.user.id)
			.single();

		if (guestError) {
			throw new Error("ゲスト情報の取得に失敗しました");
		}

		return { success: true, user: authData.user, guest: guestData };
	},
);

export const logoutGuest = createServerFn({ method: "POST" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();

		const { error } = await supabase.auth.signOut();

		if (error) {
			throw new Error(error.message);
		}

		return { success: true };
	},
);
