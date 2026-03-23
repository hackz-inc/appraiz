import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "@/styles/reset.css";
import "@/styles/global.css";

const notoSansJP = Noto_Sans_JP({
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	variable: "--font-noto-sans",
});

export const metadata: Metadata = {
	title: "Appraiz - ハッカソン採点システム",
	description: "ハッカソンのスコアリングシステム",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja" data-scroll-behavior="smooth">
			<body className={`${notoSansJP.variable} font-noto-sans`}>
				{children}
			</body>
		</html>
	);
}
