'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows, Bounds } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'
import CarModel, { CarViewerControls, PartConfig } from './CarModel'
import Loader from './Loader'

type ShowroomSceneProps = {
    modelPath: string
    partConfigs: PartConfig[]
    activePartId?: string
}

export default function ShowroomScene({ modelPath, partConfigs, activePartId }: ShowroomSceneProps) {
    return (
        <div className="h-screen w-full relative">
            <Canvas 
                camera={{ position: [4, 1.5, 6], fov: 45 }} 
                shadows={{ type: THREE.PCFShadowMap }}
            >
                <ambientLight intensity={0.4} />
                <spotLight position={[10, 12, 10]} angle={0.2} penumbra={1} intensity={1.2} castShadow />
                <spotLight position={[-10, 8, -10]} angle={0.3} penumbra={1} intensity={0.4} />
                <Suspense fallback={null}>
                    <Bounds fit clip observe margin={1.2}>
                        <CarModel modelPath={modelPath} partConfigs={partConfigs} activePartId={activePartId} />
                    </Bounds>
                    <Environment preset="city" />
                    <ContactShadows position={[0, -0.05, 0]} opacity={0.55} scale={12} blur={2.2} far={6} />
                </Suspense>
                <CarViewerControls autoRotate={activePartId === 'body' || !activePartId} />
            </Canvas>
            <Loader />
        </div>
    )
}
