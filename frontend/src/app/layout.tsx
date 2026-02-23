import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { roboto, mon, baltica, academy, vivaldi } from "./fonts";

export const metadata: Metadata = {
  title: "Toi-Invite - Онлайн шақыру",
  description: "Онлайн шақырту жасау сервисі",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk" className={`${roboto.variable} ${mon.variable} ${baltica.variable} ${academy.variable} ${vivaldi.variable}`}>
      <body
        className={`antialiased font-roboto`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
