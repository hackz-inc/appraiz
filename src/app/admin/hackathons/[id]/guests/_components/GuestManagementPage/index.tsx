"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Button, Card } from "@/components/ui";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Sidebar } from "@/components/admin/Sidebar";
import { useHackathon } from "@/hooks/useHackathons";
import { useTeams } from "@/hooks/useTeams";
import { useScoringItems } from "@/hooks/useScoringItems";
import { guests, type GuestWithInviteStatus } from "@/lib/guests";
import styles from "./index.module.css";

export function GuestManagementPage() {
	const params = useParams();
	const router = useRouter();
	const hackathonId = params.id as string;

	const { hackathon, isLoading: hackathonLoading } = useHackathon(hackathonId);
	const { teams: teamList } = useTeams(hackathonId);
	const { scoringItems: itemsList } = useScoringItems(hackathonId);
	const [guestList, setGuestList] = useState<GuestWithInviteStatus[]>([]);
	const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	useEffect(() => {
		const loadGuests = async () => {
			try {
				setLoading(true);
				const data = await guests.getAllWithInviteStatus(hackathonId);
				setGuestList(data);
				setSelectedGuestIds(data.filter((g) => g.isInvited).map((g) => g.id));
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "ゲスト一覧の取得に失敗しました",
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
			setError(err instanceof Error ? err.message : "保存に失敗しました");
		} finally {
			setSaving(false);
		}
	};

	if (loading || hackathonLoading) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.loadingContent}>
					<div className={styles.loadingIconWrapper}>
						<div className={styles.loadingIconPing} />
						<div className={styles.loadingIcon}>
							<span className={styles.loadingEmoji}>⏳</span>
						</div>
					</div>
					<p className={styles.loadingText}>読み込み中...</p>
				</div>
			</div>
		);
	}

	if (!hackathon) {
		return (
			<div className={styles.errorContainer}>
				<Card className={styles.errorCard}>
					<div className={styles.errorContent}>
						<div className={styles.errorIcon}>
							<span className={styles.errorEmoji}>❌</span>
						</div>
						<h3 className={styles.errorTitle}>
							ハッカソンが見つかりません
						</h3>
						<p className={styles.errorMessage}>
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

	const sidebarItems = [
		...(guestList || [])
			.filter((g) => g.isInvited)
			.map((guest) => ({
				id: guest.id,
				label: guest.name,
				icon: "🎤",
				type: "guest" as const,
			})),
	];

	const handleMenuToggle = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div className={styles.pageContainer}>
			<AdminHeader
				breadcrumbs={[
					{ label: "ホーム", href: "/admin" },
					{ label: hackathon.name, href: `/admin/hackathons/${hackathonId}` },
					{ label: "ゲスト管理" },
				]}
				isMenuOpen={isSidebarOpen}
				onMenuToggle={handleMenuToggle}
			/>

			<AnimatePresence>
				{isSidebarOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						onClick={handleMenuToggle}
						className={styles.overlay}
					/>
				)}
			</AnimatePresence>

			<Sidebar
				items={sidebarItems}
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				hackathonId={hackathonId}
			/>

			<Container className={styles.contentContainer}>
				<Card className={styles.headerCard}>
					<div className={styles.headerContent}>
						<div className={styles.headerIcon}>
							<span className={styles.headerEmoji}>👥</span>
						</div>
						<div className={styles.headerTextContent}>
							<h1 className={styles.headerTitle}>
								ゲスト管理
							</h1>
							<p className={styles.headerDescription}>
								{hackathon.name}に招待するゲストを選択してください
							</p>
						</div>
					</div>
				</Card>

				{error && (
					<div className={styles.errorAlert}>
						{error}
					</div>
				)}

				{successMessage && (
					<div className={styles.successAlert}>
						{successMessage}
					</div>
				)}

				{guestList.length === 0 ? (
					<Card className={styles.emptyCard}>
						<div className={styles.emptyContent}>
							<div className={styles.emptyIcon}>
								<span className={styles.emptyEmoji}>👥</span>
							</div>
							<p className={styles.emptyText}>
								ゲストがまだ登録されていません
							</p>
						</div>
					</Card>
				) : (
					<>
						<Card className={styles.guestListCard}>
							<div className={styles.guestList}>
								{guestList.map((guest) => (
									<label
										key={guest.id}
										className={styles.guestItem}
									>
										<input
											type="checkbox"
											checked={selectedGuestIds.includes(guest.id)}
											onChange={() => handleCheckboxChange(guest.id)}
											className={styles.guestCheckbox}
										/>
										<div className={styles.guestInfo}>
											<div className={styles.guestName}>
												{guest.name}
											</div>
											<div className={styles.guestDetails}>
												{guest.company_name} • {guest.email}
											</div>
										</div>
										{guest.isInvited && (
											<span className={styles.invitedBadge}>
												招待済み
											</span>
										)}
									</label>
								))}
							</div>
						</Card>

						<div className={styles.actionButtons}>
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
