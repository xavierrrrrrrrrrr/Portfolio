import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f6f3eb",
};

export const metadata = {
  title: "Xavier Boudreault — Portfolio & Creative Tech",
  description:
    "Full-stack software engineering meets editorial art direction. Building resilient digital products, interactive media, and tactile web interfaces.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="min-h-screen bg-[#f6f3eb] text-[#0f1115] antialiased overflow-x-hidden selection:bg-[#0052ff] selection:text-white pb-[env(safe-area-inset-bottom)]">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
