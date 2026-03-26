export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// 認証チェックはmiddleware.tsで実施
	// ModalManagerはルートレイアウトのModalProviderで表示
	return <>{children}</>;
}
