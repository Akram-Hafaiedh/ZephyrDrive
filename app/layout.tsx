import type { Metadata } from 'next'
import './globals.css'
import Cursor from '@/components/ui/Cursor'

export const metadata: Metadata = {
  title: 'Aether Runner | Interactive 3D Configurator',
  description: 'A high-fidelity 3D product customizer',
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