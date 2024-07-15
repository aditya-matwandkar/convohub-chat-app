import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ConvoHub - Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      {children}
    </div>
  );
}
