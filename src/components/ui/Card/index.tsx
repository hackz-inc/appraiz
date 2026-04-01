import { forwardRef } from "react";
import type { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"div">;

export const Card = forwardRef<HTMLDivElement, Props>(
	({ children, className = "", ...props }, ref) => (
		<div
			ref={ref}
			className={`rounded-xl p-6 bg-white shadow-[0_4px_8px_var(--black-lighten1)] ${className}`}
			{...props}
		>
			{children}
		</div>
	),
);

Card.displayName = "Card";
