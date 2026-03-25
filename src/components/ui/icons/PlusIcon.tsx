export const PlusIcon = ({ size = 32 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 32 32"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="16" cy="16" r="16" fill="#fabe00" />
		<path
			d="M16 8v16M8 16h16"
			stroke="#ffffff"
			strokeWidth="3"
			strokeLinecap="round"
		/>
	</svg>
);
