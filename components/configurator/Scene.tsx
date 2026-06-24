'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'
import Model from './Model'
import Loader from './Loader'

export default function Scene() {
    return (
        <div className="h-screen w-full relative">
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }} shadows>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <Suspense fallback={null}>
                    <Model />
                    <Environment preset="city" />
                    <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2.5} far={4} />
                </Suspense>
            </Canvas>
            <Loader />
        </div>
    )
}