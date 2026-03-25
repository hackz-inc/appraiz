"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Button, Card } from "@/components/ui";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useHackathon } from "@/hooks/useHackathons";
import { guests, type GuestWithInviteStatus } from "@/lib/guests";

export default function GuestManagementPage() {
	const params = useParams();
	const router = useRouter();
	const hackathonId = params.id as string;

	const { hackathon, isLoading: hackathonLoading } = useHackathon(hackathonId);
	const [guestList, setGuestList] = useState<GuestWithInviteStatus[]>([]);
	const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		const loadGuests = async () => {
			try {
				setLoading(true);
				const data = await guests.getAllWithInviteStatus(hackathonId);
				setGuestList(data);
				setSelectedGuestIds(
					data.filter((g) => g.isInvited).map((g) => g.id),
				);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "ゲスト一覧の取得に失敗しました",
				);
			} finally {
				setLoading(false);
			}
		};

		loadGuests();
	}, [hackathonId]);

	const handleCheckboxChange = (guestId: string) => {
		setSelectedGuestIds((prev) =>
			prev.includes(guestId)
				? prev.filter((id) => id !== guestId)
				: [...prev, guestId],
		);
	};

	const handleSave = async () => {
		try {
			setSaving(true);
			setError("");
			setSuccessMessage("");
			await guests.updateInvitedGuests(hackathonId, selectedGuestIds);
			setSuccessMessage("ゲスト招待リストを保存しました");
			setTimeout(() => setSuccessMessage(""), 3000);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "保存に失敗しました",
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading || hackathonLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black-lighten5 via-white to-yellow-lighten1">
				<div className="text-center">
					<div className="relative inline-block mb-4">
						<div className="absolute inset-0 animate-ping h-16 w-16 rounded-full bg-yellow-primary opacity-20" />
						<div className="relative inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-primary shadow-lg">
							<span className="text-3xl animate-bounce">⏳</span>
						</div>
					</div>
					<p className="text-black-lighten1 font-medium">読み込み中...</p>
				</div>
			</div>
		);
	}

	if (!hackathon) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black-lighten5 via-white to-yellow-lighten1">
				<Card variant="elevated" className="max-w-md">
					<div className="text-center py-12">
						<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red/20 mb-4">
							<span className="text-4xl">❌</span>
						</div>
						<h3 className="text-2xl font-bold text-black-primary mb-3">
							ハッカソンが見つかりません
						</h3>
						<p className="text-black-lighten1 mb-6">
							指定されたハッカソンは存在しないか、削除された可能性があります
						</p>
						<Link href="/admin">
							<Button variant="primary">管理画面に戻る</Button>
						</Link>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-black-lighten5 via-white to-yellow-lighten1">
			<AdminHeader
				breadcrumbs={[
					{ label: "ホーム", href: "/admin" },
					{ label: hackathon.name, href: `/admin/hackathons/${hackathonId}` },
					{ label: "ゲスト管理" },
				]}
			/>

			<Container className="py-10">
				<Card
					variant="gradient"
					className="mb-8 border-4 border-yellow-primary"
				>
					<div className="flex items-start gap-4">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-yellow-primary shadow-lg flex-shrink-0">
							<span className="text-3xl">👥</span>
						</div>
						<div className="flex-1">
							<h1 className="text-3xl font-black text-black-primary mb-3">
								ゲスト管理
							</h1>
							<p className="text-black-lighten1">
								{hackathon.name}に招待するゲストを選択してください
							</p>
						</div>
					</div>
				</Card>

				{error && (
					<div className="mb-6 p-4 bg-red/10 border border-red rounded text-red text-sm">
						{error}
					</div>
				)}

				{successMessage && (
					<div className="mb-6 p-4 bg-green/10 border border-green rounded text-green text-sm">
						{successMessage}
					</div>
				)}

				{guestList.length === 0 ? (
					<Card
						variant="elevated"
						className="bg-gradient-to-br from-white to-blue/10"
					>
						<div className="text-center py-12">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue/20 mb-4">
								<span className="text-3xl">👥</span>
							</div>
							<p className="text-black-lighten1 font-medium">
								ゲストがまだ登録されていません
							</p>
						</div>
					</Card>
				) : (
					<>
						<Card variant="elevated" className="mb-6">
							<div className="space-y-3">
								{guestList.map((guest) => (
									<label
										key={guest.id}
										className="flex items-center gap-3 p-3 rounded-lg hover:bg-black-lighten5 transition-colors cursor-pointer"
									>
										<input
											type="checkbox"
											checked={selectedGuestIds.includes(guest.id)}
											onChange={() => handleCheckboxChange(guest.id)}
											className="w-5 h-5 rounded border-2 border-black-lighten3 text-yellow-primary focus:ring-2 focus:ring-yellow-primary cursor-pointer"
										/>
										<div className="flex-1">
											<div className="font-bold text-black-primary">
												{guest.name}
											</div>
											<div className="text-sm text-black-lighten1">
												{guest.company_name} • {guest.email}
											</div>
										</div>
										{guest.isInvited && (
											<span className="px-3 py-1 rounded-full bg-yellow-primary/20 border border-yellow-primary text-xs font-bold text-black-primary">
												招待済み
											</span>
										)}
									</label>
								))}
							</div>
						</Card>

						<div className="flex gap-4">
							<Button
								variant="secondary"
								size="lg"
								onClick={() => router.back()}
								fullWidth
							>
								キャンセル
							</Button>
							<Button
								variant="primary"
								size="lg"
								onClick={handleSave}
								isLoading={saving}
								fullWidth
							>
								保存
							</Button>
						</div>
					</>
				)}
			</Container>
		</div>
	);
}
