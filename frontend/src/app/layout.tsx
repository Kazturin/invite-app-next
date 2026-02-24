import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { roboto } from "./fonts";

export const metadata: Metadata = {
  title: {
    template: "%s | toi-invite.kz",
    default: "Тойға онлайн шақыру жасау | toi-invite.kz",
  },
  description: "Онлайн шақырту жасау сервисі",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk" className={`${roboto.variable}`}>
      <body
        className={`antialiased font-roboto`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
