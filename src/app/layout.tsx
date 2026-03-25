import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./styles/variables.css";
import "./styles/reset.css";
import { ModalProvider } from "@/components/providers/ModalProvider";
import { SWRProvider } from "@/components/providers/SWRProvider";

const notoSansJP = Noto_Sans_JP({
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	variable: "--font-noto-sans",
});

export const metadata: Metadata = {
	title: "Apprai'z - ハッカソン採点システム",
	description: "ハッカソンのスコアリングシステム",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja" data-scroll-behavior="smooth">
			<body className={notoSansJP.variable}>
				<SWRProvider>
					{children}
					<ModalProvider />
				</SWRProvider>
			</body>
		</html>
	);
}
