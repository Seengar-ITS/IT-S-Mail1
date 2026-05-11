import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'IT-S Mail1 — Email, Reimagined.',
  description: 'A premium Gmail-level email platform by IT-S Universe.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://its-mail1.vercel.app'),
  openGraph: {
    title: 'IT-S Mail1',
    description: 'Email, Reimagined.',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster theme="dark" richColors position="top-right" />
      </body>
    </html>
  )
}
