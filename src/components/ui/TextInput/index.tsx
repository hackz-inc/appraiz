import { type ComponentPropsWithRef, forwardRef } from "react";

interface TextInputProps extends ComponentPropsWithRef<"input"> {
	label?: string;
	error?: string;
	fullWidth?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	({ label, error, fullWidth = true, className = "", ...props }, ref) => {
		const wrapperClass = fullWidth ? "w-full" : "";
		const inputClass = [
			"px-4 py-3 text-base rounded-lg border border-[var(--black-lighten3)] bg-[var(--black-lighten4)] transition-all focus:outline-none focus:shadow-[0_0_0_2px_var(--yellow-primary)] focus:border-transparent",
			fullWidth && "w-full",
			error && "border-[var(--red)]",
			className,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<div className={wrapperClass}>
				{label && <label className="block text-sm font-semibold text-[var(--black-primary)] mb-2">{label}</label>}
				<input ref={ref} className={inputClass} {...props} />
				{error && <p className="mt-1 text-sm text-[var(--red)]">{error}</p>}
			</div>
		);
	},
);

TextInput.displayName = "TextInput";
