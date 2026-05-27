import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitGoal",
  description: "A beginner-friendly fitness and nutrition MVP"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
