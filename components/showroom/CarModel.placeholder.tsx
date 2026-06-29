'use client'
import { useRef } from 'react'
import { Bounds, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// TEMP DIAGNOSTIC COMPONENT
// Renders a plain box instead of loading any .glb, so we can confirm
// whether dev-server crashes are caused by GLB loading or are unrelated.
// Same props signature as CarModel.tsx so it's a drop-in swap.

type CarModelProps = {
    modelPath: string
    color?: string
    paintTargets?: string[]
}

export default function CarModelPlaceholder({ color }: CarModelProps) {
    const meshRef = useRef<THREE.Mesh>(null)

    return (
        <Bounds fit clip observe margin={1.2}>
            <mesh ref={meshRef} castShadow receiveShadow>
                <boxGeometry args={[4, 1.2, 1.8]} />
                <meshStandardMaterial color={color ?? '#888888'} />
            </mesh>
        </Bounds>
    )
}

export function CarViewerControls() {
    return (
        <OrbitControls
            enableZoom
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.6}
            minDistance={2}
            maxDistance={12}
            maxPolarAngle={Math.PI / 1.9}
        />
    )
}

export function preloadCarModel(_modelPath: string) {
    // no-op for placeholder
}
