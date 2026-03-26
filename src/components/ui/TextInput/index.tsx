import { type ComponentPropsWithRef, forwardRef } from "react";
import styles from "./index.module.css";

interface TextInputProps extends ComponentPropsWithRef<"input"> {
	label?: string;
	error?: string;
	fullWidth?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	({ label, error, fullWidth = true, className = "", ...props }, ref) => {
		const wrapperClass = fullWidth ? styles.fullWidth : "";
		const inputClass = [
			styles.input,
			fullWidth && styles.fullWidth,
			error && styles.inputError,
			className,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<div className={wrapperClass}>
				{label && <label className={styles.label}>{label}</label>}
				<input ref={ref} className={inputClass} {...props} />
				{error && <p className={styles.error}>{error}</p>}
			</div>
		);
	},
);

TextInput.displayName = "TextInput";
