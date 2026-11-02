import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Borrows",
};

export default function MyBorrowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
