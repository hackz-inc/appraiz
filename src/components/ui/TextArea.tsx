import { type ComponentPropsWithRef, forwardRef } from "react";

type Props = ComponentPropsWithRef<"textarea"> & {
	label?: string;
	error?: string;
	fullWidth?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
	({ label, error, fullWidth = true, className = "", ...props }, ref) => {
		const wrapperClass = fullWidth ? "w-full" : "";
		const textareaClass = [
			"px-4 py-3 text-base rounded-lg border border-gray-300 bg-gray-50 transition-all resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent",
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
				<textarea ref={ref} className={textareaClass} {...props} />
				{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
			</div>
		);
	},
);

TextArea.displayName = "TextArea";
