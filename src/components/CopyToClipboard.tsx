import { useState, useEffect } from "react";

interface CopyToClipboardProps {
	itemTitle: string;
	hackathonItem: string;
	className?: string;
}

export const CopyToClipboard = ({
	itemTitle,
	hackathonItem,
	className = "",
}: CopyToClipboardProps) => {
	const [isChecked, setIsChecked] = useState(false);
	const [isCopy, setIsCopy] = useState(false);

	useEffect(() => {
		if (isChecked) {
			const timeoutId = setTimeout(() => setIsChecked(false), 1500);
			return () => clearTimeout(timeoutId);
		}
	}, [isChecked]);

	const copyText = async () => {
		if (isCopy) return;

		try {
			await navigator.clipboard.writeText(hackathonItem);
			setIsCopy(true);
			setTimeout(() => {
				setIsCopy(false);
			}, 2000);
		} catch (error) {
			console.warn(error);
		}
	};

	return (
		<div className={className}>
			<p className="py-1 text-gray-600 text-base font-bold">{itemTitle}</p>
			<div className="relative w-full h-11 px-3 py-2.5 bg-gray-100 rounded flex justify-between items-center">
				<p className="text-gray-600 text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis">
					{hackathonItem}
				</p>
				{isChecked && (
					<span className="absolute -top-5 right-2 w-[86px] h-5 px-2 py-0.5 text-xs text-white bg-black rounded before:content-[''] before:block before:absolute before:right-2 before:top-4 before:border-solid before:border-t-8 before:border-x-[6px] before:border-b-0 before:border-t-black before:border-x-transparent">
						コピーしました
					</span>
				)}
				<button
					type="button"
					onClick={() => {
						copyText();
						setIsChecked(true);
					}}
					className="flex-shrink-0"
					data-testid="copy-button"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M13.333 10.75v4.583a1.917 1.917 0 01-1.916 1.917H4.583a1.917 1.917 0 01-1.916-1.917V8.5a1.917 1.917 0 011.916-1.917h4.584"
							stroke="#333"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M17.333 2.667H10.5a1.917 1.917 0 00-1.917 1.916v6.834a1.917 1.917 0 001.917 1.916h6.833a1.917 1.917 0 001.917-1.916V4.583a1.917 1.917 0 00-1.917-1.916z"
							stroke="#333"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};
