import { CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";

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
					<CopyIcon size={20} color={isCopy ? "green" : "gray"} />
				</button>
			</div>
		</div>
	);
};
