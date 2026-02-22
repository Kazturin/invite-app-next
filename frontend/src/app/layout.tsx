import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";

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
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
