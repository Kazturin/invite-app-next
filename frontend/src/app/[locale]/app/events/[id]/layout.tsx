import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Іс-шараны басқару",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
