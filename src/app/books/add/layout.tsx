import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BookNook | Add Book",
};

export default function AddBookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
