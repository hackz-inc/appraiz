import { PlusIcon } from "lucide-react";

type Props = {} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const PlusIconButton = ({ ...props }: Props) => {
	return (
		<button
			type="button"
			className="size-12 flex justify-center items-center rounded-full rounded-tr-none bg-yellow-500 hover:bg-yellow-600 transition-colors cursor-pointer"
			{...props}
		>
			<PlusIcon size={32} color="white" />
		</button>
	);
};
