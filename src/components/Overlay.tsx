interface OverlayProps {
	onClick: () => void;
}

export const Overlay = ({ onClick }: OverlayProps) => {
	return (
		<div
			className="fixed inset-0 bg-black/50 z-50"
			onClick={onClick}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClick();
			}}
			role="button"
			tabIndex={0}
			aria-label="モーダルを閉じる"
		/>
	);
};
