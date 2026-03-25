"use client";

import { useActionState } from "react";
import { Button, TextInput } from "@/components/ui";
import { useModalStore } from "@/stores";
import { createHackathon } from "@/components/features/hackathon/actions";
import styles from "./index.module.css";

type ActionState = { error?: string; success?: boolean } | null;

export const CreateHackathonForm = () => {
	const { closeModal } = useModalStore();

	const [state, formAction, isPending] = useActionState<ActionState, FormData>(
		async (_prevState, formData) => {
			const name = formData.get("name") as string;
			const scoringDate = formData.get("scoringDate") as string;

			const result = await createHackathon({
				name,
				scoring_date: scoringDate,
			});

			if (!result.success) {
				return { error: result.error || "ハッカソンの作成に失敗しました" };
			}

			closeModal();
			return { success: true };
		},
		null,
	);

	return (
		<form action={formAction} className={styles.form}>
			{state?.error && <div className={styles.error}>{state.error}</div>}

			<TextInput
				type="text"
				name="name"
				label="ハッカソン名"
				placeholder="例: Spring Hackathon 2024"
				required
				fullWidth
			/>

			<TextInput
				type="date"
				name="scoringDate"
				label="採点日"
				required
				fullWidth
			/>

			<Button
				type="submit"
				variant="primary"
				size="lg"
				isLoading={isPending}
				fullWidth
			>
				作成
			</Button>
		</form>
	);
};
