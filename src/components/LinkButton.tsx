import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface LinkButtonProps {
	to: string;
	params?: Record<string, string>;
	children: ReactNode;
	className?: string;
}

export const LinkButton = ({
	to,
	params,
	children,
	className = "",
}: LinkButtonProps) => {
	return (
		<Link
			to={to}
			params={params}
			className={`
				w-[244px] h-11 flex justify-center items-center
				rounded-tl-[26px] rounded-bl-none rounded-br-[26px] rounded-tr-none
				text-base font-bold cursor-pointer
				border-2 border-yellow-500
				shadow-md
				bg-gradient-to-r from-white from-0% via-white via-50% to-yellow-500 to-50%
				bg-[length:200%_auto] bg-right
				hover:bg-left
				transition-all duration-300
				${className}
			`}
		>
			{children}
		</Link>
	);
};
