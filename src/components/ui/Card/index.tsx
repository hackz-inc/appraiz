import { forwardRef } from "react";
import type { ComponentPropsWithRef } from "react";
import styles from "./index.module.css";

type CardProps = ComponentPropsWithRef<"div">;

export const Card = forwardRef<HTMLDivElement, CardProps>(
	({ children, className = "", ...props }, ref) => (
		<div ref={ref} className={`${styles.card} ${className}`} {...props}>
			{children}
		</div>
	),
);

Card.displayName = "Card";
