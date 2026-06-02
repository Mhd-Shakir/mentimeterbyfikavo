import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mentimeter by Fikavo",
  description: "Realtime interactive presentations powered by Supabase."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
