"use client";

import { AuthGuard } from "./AuthGuard";

type Props = {
	children: React.ReactNode;
};

export const GuestAuthGuard = ({ children }: Props) => {
	return (
		<AuthGuard requiredRole="guest" redirectTo="/guest/auth/login">
			{children}
		</AuthGuard>
	);
};
