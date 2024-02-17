import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { UserButton } from "@clerk/nextjs";


import Link from 'next/link'
import { User } from 'lucide-react'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Whiskey Tasting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen relative flex flex-col">
            <header className="sticky top-0 w-full border-b border-border/40 shadow-sm">
              <div className="container flex flex-row w-mx-auto justify-center h-10 items-center">
                  <h1 className="text-xl font-medium mr-10"><Link href={'/'}>Whiskey Tasting</Link></h1>

                  <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <UserButton showName={true} afterSignOutUrl="/"/>
                  </div>
              </div>
            </header>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}