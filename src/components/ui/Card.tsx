import { forwardRef } from "react";
import type { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"div">;

export const Card = forwardRef<HTMLDivElement, Props>(
	({ children, className = "", ...props }, ref) => (
		<div
			ref={ref}
			className={`rounded-xl p-6 bg-white shadow-lg ${className}`}
			{...props}
		>
			{children}
		</div>
	),
);

Card.displayName = "Card";
