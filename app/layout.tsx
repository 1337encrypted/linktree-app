import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { Instrument_Serif } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-static"
import { LinksProvider } from "@/lib/links-static"
import { LogoProvider } from "@/lib/logo"
import { BackgroundThemeProvider } from "@/lib/background-themes"
import { CustomIconsProvider } from "@/lib/custom-icons"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
})

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  display: "swap",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Linktree",
  description: "Your personal link hub",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${figtree.style.fontFamily};
  --font-sans: ${figtree.variable};
  --font-mono: ${geistMono.variable};
  --font-instrument-serif: ${instrumentSerif.variable};
  --font-geist-sans: ${geistSans.variable};
}
        `}</style>
      </head>
      <body className={`${figtree.variable} ${instrumentSerif.variable} ${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <LinksProvider>
            <LogoProvider>
              <CustomIconsProvider>
                <BackgroundThemeProvider>
                  {children}
                </BackgroundThemeProvider>
              </CustomIconsProvider>
            </LogoProvider>
          </LinksProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
