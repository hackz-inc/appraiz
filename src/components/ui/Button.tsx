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
			"bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300 hover:border-yellow-300 disabled:hover:bg-yellow-400 disabled:hover:border-yellow-400",
		secondary:
			"bg-white text-black border-gray-300 hover:bg-gray-100 hover:border-gray-400 disabled:hover:bg-white disabled:hover:border-gray-300",
		ghost:
			"bg-transparent text-black border-transparent hover:bg-gray-100 hover:border-gray-300 disabled:hover:bg-transparent disabled:hover:border-transparent",
		danger:
			"bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 disabled:hover:bg-red-500 disabled:hover:border-red-500",
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
				<div className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
			) : (
				children
			)}
		</button>
	);
};
