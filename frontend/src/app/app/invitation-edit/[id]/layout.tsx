import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Шақыруды өңдеу",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
