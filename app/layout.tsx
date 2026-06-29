import type { Metadata } from 'next'
import './globals.css'
import Cursor from '@/components/ui/Cursor'

export const metadata: Metadata = {
  title: 'ZephyrDrive | Digital 3D Car Showroom',
  description: 'An interactive 3D car showroom — browse, compare, and configure vehicles in real time.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        <Cursor />
        {children}
      </body>
    </html>
  )
}