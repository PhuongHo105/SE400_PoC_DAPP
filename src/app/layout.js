import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VotingProvider } from "@/context/Voter";
import { NavBar } from "@/components/NavBar/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DApp Voting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <VotingProvider>
          <NavBar />
          <div className="container mx-auto px-4 py-10">{children}</div>
        </VotingProvider>
      </body>
    </html>
  );
}