import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M. Alfa Ridzi - Mathematician & Full-Stack Developer",
  description: "Portfolio of M. Alfa Ridzi, S.Mat - A mathematician and full-stack developer showcasing innovative projects in math tools, mobile apps, desktop apps, utility tools, web apps, and publications.",
  keywords: ["M. Alfa Ridzi", "Mathematician", "Full-Stack Developer", "Portfolio", "Math Tools", "Web Apps", "Mobile Apps"],
  authors: [{ name: "M. Alfa Ridzi" }],
  openGraph: {
    title: "M. Alfa Ridzi - Mathematician & Full-Stack Developer",
    description: "Explore the portfolio of M. Alfa Ridzi, featuring projects in mathematics, software development, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
