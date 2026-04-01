"use client";

import type { ComponentPropsWithRef } from "react";
import { useEffect } from "react";

type Props = ComponentPropsWithRef<"div"> & {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	size?: "sm" | "md" | "lg" | "xl";
};

export const Modal = ({
	isOpen,
	onClose,
	title,
	size = "md",
	children,
	className = "",
	...props
}: Props) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const sizeClasses = {
		sm: "max-w-[448px]",
		md: "max-w-[512px]",
		lg: "max-w-[672px]",
		xl: "max-w-[896px]",
	};

	const modalClass = [
		"relative bg-white rounded-2xl shadow-[var(--shadow-xl)] w-full max-h-[90vh] overflow-y-auto animate-[zoomIn_0.2s]",
		sizeClasses[size],
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className="fixed inset-0 z-[var(--z-index-top)] flex items-center justify-center p-4 animate-[fadeIn_0.2s]">
			<div className="absolute inset-0 bg-black/60" onClick={onClose} />

			<div className={modalClass} {...props}>
				{title && (
					<div className="flex items-center justify-between px-6 py-5 border-b-2 border-[var(--yellow-primary)] bg-gradient-to-r from-[var(--yellow-lighten1)] to-white">
						<h2 className="text-2xl font-black text-[var(--black-primary)] flex items-center gap-2">
							{title}
						</h2>
						<button
							onClick={onClose}
							className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-[var(--black-lighten2)] transition-all cursor-pointer border-none bg-transparent hover:text-white hover:bg-[var(--red)]"
						>
							<svg
								style={{ width: "24px", height: "24px" }}
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				)}

				<div className="p-6">{children}</div>
			</div>
		</div>
	);
};
