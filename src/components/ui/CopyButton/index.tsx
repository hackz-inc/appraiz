"use client";

import { useState } from "react";
import { Button } from "../Button";

type Props = {
	text: string;
	label?: string;
	className?: string;
};

export const CopyButton = ({ text, label, className }: Props) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<Button
			variant="secondary"
			size="sm"
			onClick={handleCopy}
			className={className}
		>
			{copied ? "✓ コピーしました" : label || "コピー"}
		</Button>
	);
};
