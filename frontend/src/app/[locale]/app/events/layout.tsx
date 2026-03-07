import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Менің іс-шараларым",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
