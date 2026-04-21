import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Mainlayout from "@/components/layout/Mainlayout";

export const metadata: Metadata = {
  title: "X",
  description: "Social Media Platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Mainlayout>{children}</Mainlayout>
        </AuthProvider>
      </body>
    </html>
  );
}