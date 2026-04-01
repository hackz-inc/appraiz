import type { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"button"> & {
	variant?: "primary" | "secondary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
	fullWidth?: boolean;
};

export const Button = ({
	variant = "primary",
	size = "md",
	isLoading = false,
	fullWidth = false,
	disabled,
	children,
	className = "",
	...props
}: Props) => {
	const baseClasses =
		"inline-flex items-center justify-center gap-2 font-bold transition-all rounded-xl shadow-sm cursor-pointer border-2 border-transparent hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

	const variantClasses = {
		primary:
			"bg-[var(--yellow-primary)] text-[var(--black-primary)] border-[var(--yellow-primary)] hover:bg-[var(--yellow-lighten2)] hover:border-[var(--yellow-lighten1)] disabled:hover:bg-[var(--yellow-primary)] disabled:hover:border-[var(--yellow-primary)]",
		secondary:
			"bg-white text-[var(--black-primary)] border-[var(--black-lighten3)] hover:bg-[var(--black-lighten4)] hover:border-[var(--black-lighten2)] disabled:hover:bg-white disabled:hover:border-[var(--black-lighten3)]",
		ghost:
			"bg-transparent text-[var(--black-primary)] border-transparent hover:bg-[var(--black-lighten4)] hover:border-[var(--black-lighten3)] disabled:hover:bg-transparent disabled:hover:border-transparent",
		danger:
			"bg-[var(--red)] text-white border-[var(--red)] hover:bg-[rgba(235,83,83,0.9)] hover:border-[rgba(235,83,83,0.9)] disabled:hover:bg-[var(--red)] disabled:hover:border-[var(--red)]",
	};

	const sizeClasses = {
		sm: "px-4 py-2 text-sm h-9",
		md: "px-6 py-2.5 text-base h-11",
		lg: "px-8 py-3 text-lg h-12",
	};

	const widthClass = fullWidth ? "w-full" : "";

	const classNames = [
		baseClasses,
		variantClasses[variant],
		sizeClasses[size],
		widthClass,
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<button className={classNames} disabled={disabled || isLoading} {...props}>
			{isLoading ? (
				<div className="inline-block w-5 h-5 border-2 border-[var(--black-primary)] border-t-transparent rounded-full animate-spin" />
			) : (
				children
			)}
		</button>
	);
};
