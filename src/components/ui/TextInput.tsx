import { type ComponentPropsWithRef, forwardRef } from "react";

type Props = ComponentPropsWithRef<"input"> & {
	label?: string;
	error?: string;
	fullWidth?: boolean;
};

export const TextInput = forwardRef<HTMLInputElement, Props>(
	({ label, error, fullWidth = true, className = "", ...props }, ref) => {
		const wrapperClass = fullWidth ? "w-full" : "";
		const inputClass = [
			"px-4 py-3 text-base rounded-lg border border-gray-300 bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent",
			fullWidth && "w-full",
			error && "border-red-500",
			className,
		]

			.filter(Boolean)
			.join(" ");

		return (
			<div className={wrapperClass}>
				{label && (
					<label className="block text-sm font-semibold text-black mb-2">
						{label}
					</label>
				)}
				<input ref={ref} className={inputClass} {...props} />
				{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
			</div>
		);
	},
);

TextInput.displayName = "TextInput";
