import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SheetsProvider } from "@/contexts/SheetsContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Google Sheets AI - Assistant intelligent pour feuilles de calcul",
  description: "Créez, analysez et optimisez vos données Google Sheets grâce à l'intelligence artificielle. Générez des insights, des formules et des visualisations automatiquement.",
  keywords: "Google Sheets, IA, OpenAI, feuilles de calcul, analyse de données, assistant intelligent",
  authors: [{ name: "Google Sheets AI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <SheetsProvider>
          {children}
        </SheetsProvider>
      </body>
    </html>
  );
}
