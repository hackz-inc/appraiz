import { ReactNode } from "react";
import { X } from "lucide-react";
import { Overlay } from "./Overlay";

interface BaseModalProps {
	close?: (() => void) | false;
	children: ReactNode;
	className?: string;
}

export const BaseModal = ({
	close = false,
	children,
	className = "",
}: BaseModalProps) => {
	return (
		<>
			{close && <Overlay onClick={close} />}
			<div
				className={`
					w-full max-w-[640px] mx-4 px-8 py-8 pb-10
					fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
					flex flex-col
					shadow-lg bg-white rounded-lg z-50
					${className}
				`}
			>
				{close && (
					<button
						type="button"
						onClick={close}
						className="absolute top-8 right-8 z-50 hover:opacity-70 transition-opacity"
						aria-label="閉じる"
					>
						<X size={24} />
					</button>
				)}
				{children}
			</div>
		</>
	);
};
