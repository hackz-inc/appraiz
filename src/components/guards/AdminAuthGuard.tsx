"use client";

import { AuthGuard } from "./AuthGuard";

type Props = {
	children: React.ReactNode;
};

export const AdminAuthGuard = ({ children }: Props) => {
	return (
		<AuthGuard requiredRole="admin" redirectTo="/admin/auth/login">
			{children}
		</AuthGuard>
	);
};
