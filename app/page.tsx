'use client'

import dynamic from 'next/dynamic'
import ProductInfo from '@/components/configurator/ProductInfo'
import ColorPicker from '@/components/configurator/ColorPicker'

const Scene = dynamic(() => import('@/components/configurator/Scene'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center text-4xl font-bold">
      Loading...
    </div>
  ),
})

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <Scene />
      <ProductInfo />
      <ColorPicker />
    </main>
  )
}