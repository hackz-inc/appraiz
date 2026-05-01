import { ComponentPropsWithRef } from "react";

export type SliderProps = Omit<ComponentPropsWithRef<"input">, "onChange"> & {
	min?: number;
	max?: number;
	value?: number;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: number) => void;
};

export function Slider({
	min = 0,
	max = 100,
	value = 0,
	onChange,
	className = "",
	...props
}: SliderProps) {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = Number(event.target.value);
		if (onChange) {
			onChange(event, newValue);
		}
	};

	return (
		<input
			type="range"
			min={min}
			max={max}
			value={value}
			onChange={handleChange}
			className={`
				flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer
				[&::-webkit-slider-track]:bg-gray-300
				[&::-webkit-slider-track]:rounded-lg
				[&::-webkit-slider-track]:h-1
				[&::-webkit-slider-thumb]:appearance-none
				[&::-webkit-slider-thumb]:w-5
				[&::-webkit-slider-thumb]:h-5
				[&::-webkit-slider-thumb]:rounded-full
				[&::-webkit-slider-thumb]:bg-yellow-500
				[&::-webkit-slider-thumb]:cursor-pointer
				[&::-webkit-slider-thumb]:shadow-sm
				[&::-webkit-slider-thumb]:hover:shadow-[0_0_0_10px_rgba(234,179,8,0.3)]
				[&::-webkit-slider-thumb]:transition-shadow
				[&::-moz-range-track]:bg-gray-300
				[&::-moz-range-track]:rounded-lg
				[&::-moz-range-track]:h-1
				[&::-moz-range-thumb]:appearance-none
				[&::-moz-range-thumb]:w-5
				[&::-moz-range-thumb]:h-5
				[&::-moz-range-thumb]:rounded-full
				[&::-moz-range-thumb]:bg-yellow-500
				[&::-moz-range-thumb]:cursor-pointer
				[&::-moz-range-thumb]:border-0
				[&::-moz-range-thumb]:shadow-sm
				[&::-moz-range-thumb]:hover:shadow-[0_0_0_10px_rgba(234,179,8,0.3)]
				[&::-moz-range-thumb]:transition-shadow
				${className}
			`}
			{...props}
		/>
	);
}
