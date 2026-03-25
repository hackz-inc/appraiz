"use client";

import type { ComponentPropsWithRef } from "react";
import { useEffect } from "react";
import styles from "./Modal.module.css";

interface ModalProps extends ComponentPropsWithRef<"div"> {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	size?: "sm" | "md" | "lg" | "xl";
}

export const Modal = ({
	isOpen,
	onClose,
	title,
	size = "md",
	children,
	className = "",
	...props
}: ModalProps) => {
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

	const modalClass = [styles.modal, styles[size], className]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={styles.overlay}>
			<div className={styles.backdrop} onClick={onClose} />

			<div className={modalClass} {...props}>
				{title && (
					<div className={styles.header}>
						<h2 className={styles.title}>{title}</h2>
						<button onClick={onClose} className={styles.closeButton}>
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

				<div className={styles.body}>{children}</div>
			</div>
		</div>
	);
};
