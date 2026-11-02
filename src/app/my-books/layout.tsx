import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Books",
};

export default function MyBooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
