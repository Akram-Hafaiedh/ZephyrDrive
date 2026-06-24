'use client'
import { useMemo } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useConfigStore } from '@/store/useConfigStore'
import * as THREE from 'three'

// 1. Fixed Part component with advanced Physical Materials
function Part({
    geometry,
    position,
    rotation,
    scale,
    color,
    roughness = 0.4,
    metalness = 0.1,
    clearcoat = 0,
    clearcoatRoughness = 0.1,
}: {
    geometry: THREE.BufferGeometry
    position?: [number, number, number]
    rotation?: [number, number, number]
    scale?: [number, number, number]
    color: string
    roughness?: number
    metalness?: number
    clearcoat?: number
    clearcoatRoughness?: number
}) {
    return (
        <mesh
            geometry={geometry}
            position={position}
            rotation={rotation}
            scale={scale}
            castShadow
            receiveShadow
        >
            {/* meshPhysicalMaterial gives realistic leather/plastic finishes */}
            <meshPhysicalMaterial
                color={color}
                roughness={roughness}
                metalness={metalness}
                clearcoat={clearcoat}
                clearcoatRoughness={clearcoatRoughness}
                envMapIntensity={1.2} // Boosted for richer reflections
            />
        </mesh>
    )
}

export default function Model() {
    const activeColor = useConfigStore((s) => s.activeColor)
    const mainColor = activeColor.threeValue
    
    const darkMain = useMemo(() => new THREE.Color(mainColor).multiplyScalar(0.68).getStyle(), [mainColor])
    const soleColor = '#d4c3b3'
    const midsoleColor = '#f8f8f8'
    const accentColor = '#ffffff'

    // 2. Memory Fix: Geometries are created ONCE and cached
    const geometries = useMemo(() => {
        return {
            midsole: new THREE.BoxGeometry(0.78, 0.26, 1.28),
            outsole: new THREE.BoxGeometry(0.76, 0.11, 1.26),
            heelLift: new THREE.BoxGeometry(0.7, 0.14, 0.48),
            forefoot: new THREE.BoxGeometry(0.72, 0.1, 0.65),
            toeSpring: new THREE.BoxGeometry(0.7, 0.09, 0.3),
            treadLine: new THREE.BoxGeometry(0.68, 0.018, 0.085),
            upperBody: new THREE.CapsuleGeometry(0.37, 0.72, 16, 24),
            heelCounter: new THREE.BoxGeometry(0.74, 0.52, 0.45),
            toeCap: new THREE.SphereGeometry(0.32, 28, 24),
            sideOverlay: new THREE.BoxGeometry(0.8, 0.45, 1.05),
            collar: new THREE.TorusGeometry(0.335, 0.09, 12, 28),
            tongue: new THREE.BoxGeometry(0.27, 0.55, 0.13),
            tongueTop: new THREE.BoxGeometry(0.19, 0.24, 0.09),
            eyeletOuter: new THREE.CylinderGeometry(0.04, 0.04, 0.1, 16),
            eyeletInner: new THREE.CylinderGeometry(0.023, 0.023, 0.11, 16),
            lace: new THREE.CylinderGeometry(0.019, 0.019, 1, 8), // normalized length
            swoosh: new THREE.TorusGeometry(0.49, 0.04, 10, 36, Math.PI * 1.2),
            swooshHighlight: new THREE.TorusGeometry(0.485, 0.018, 10, 36, Math.PI * 1.18),
            heelTab: new THREE.BoxGeometry(0.24, 0.14, 0.09),
        }
    }, [])

    return (
        <group>
            <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} minDistance={1.8} maxDistance={5} />

            {/* ==================== SOLE ==================== */}
            <Part geometry={geometries.midsole} position={[0, -0.09, 0]} color={midsoleColor} roughness={0.6} />
            <Part geometry={geometries.outsole} position={[0, -0.27, 0]} color={soleColor} roughness={0.8} />
            <Part geometry={geometries.heelLift} position={[0, -0.31, -0.39]} color={soleColor} roughness={0.8} />
            <Part geometry={geometries.forefoot} position={[0, -0.27, 0.3]} color={soleColor} roughness={0.8} />
            <Part geometry={geometries.toeSpring} position={[0, -0.24, 0.59]} rotation={[0.25, 0, 0]} color={soleColor} roughness={0.8} />

            {Array.from({ length: 9 }).map((_, i) => (
                <Part key={`tread-${i}`} geometry={geometries.treadLine} position={[0, -0.29, -0.48 + i * 0.145]} color="#b89e7e" roughness={0.9} />
            ))}

            {/* ==================== UPPER (Leather Look) ==================== */}
            <Part 
                geometry={geometries.upperBody} 
                position={[0, 0.19, -0.02]} 
                rotation={[Math.PI / 2, 0, 0]} 
                scale={[0.93, 1.08, 0.89]} 
                color={mainColor} 
                roughness={0.3} // Gives a soft leather reflection
                clearcoat={0.1} // Simulates leather finish
            />
            
            <Part geometry={geometries.heelCounter} position={[0, 0.24, -0.53]} rotation={[0.18, 0, 0]} color={darkMain} roughness={0.35} clearcoat={0.1} />
            <Part geometry={geometries.toeCap} position={[0, 0.08, 0.59]} scale={[0.9, 0.68, 0.65]} color={darkMain} roughness={0.4} />

            {/* Side Overlays */}
            <Part geometry={geometries.sideOverlay} position={[0.37, 0.15, 0]} rotation={[0.08, 0.25, 0]} scale={[0.24, 1, 1]} color={darkMain} roughness={0.3} clearcoat={0.1} />
            <Part geometry={geometries.sideOverlay} position={[-0.37, 0.15, 0]} rotation={[0.08, -0.25, 0]} scale={[0.24, 1, 1]} color={darkMain} roughness={0.3} clearcoat={0.1} />

            <Part geometry={geometries.collar} position={[0, 0.59, -0.19]} rotation={[Math.PI / 2, 0, 0]} scale={[1.08, 1, 0.78]} color={darkMain} roughness={0.6} />
            <Part geometry={geometries.tongue} position={[0, 0.49, 0.14]} rotation={[0.38, 0, 0]} color={mainColor} roughness={0.5} />
            <Part geometry={geometries.tongueTop} position={[0, 0.64, 0.19]} rotation={[0.45, 0, 0]} color={mainColor} roughness={0.5} />

            {/* ==================== LACES ==================== */}
            {[
                [-0.17, 0.49, 0.19], [0.17, 0.49, 0.19],
                [-0.17, 0.39, 0.24], [0.17, 0.39, 0.24],
                [-0.17, 0.30, 0.29], [0.17, 0.30, 0.29],
                [-0.16, 0.22, 0.35], [0.16, 0.22, 0.35],
            ].map((pos, i) => (
                <group key={i} position={pos as [number, number, number]}>
                    <Part geometry={geometries.eyeletOuter} rotation={[Math.PI / 2, 0, 0]} color="#222222" metalness={0.8} roughness={0.2} />
                    <Part geometry={geometries.eyeletInner} rotation={[Math.PI / 2, 0, 0]} color={accentColor} roughness={0.4} />
                </group>
            ))}

            {/* Crossed laces */}
            {[
                { from: [-0.16, 0.49, 0.23], to: [0.16, 0.39, 0.27] },
                { from: [0.16, 0.49, 0.23], to: [-0.16, 0.39, 0.27] },
                { from: [-0.16, 0.39, 0.28], to: [0.16, 0.30, 0.32] },
                { from: [0.16, 0.39, 0.28], to: [-0.16, 0.30, 0.32] },
                { from: [-0.16, 0.30, 0.33], to: [0.16, 0.22, 0.37] },
                { from: [0.16, 0.30, 0.33], to: [-0.16, 0.22, 0.37] },
            ].map((lace, i) => {
                const mid = [(lace.from[0] + lace.to[0]) / 2, (lace.from[1] + lace.to[1]) / 2, (lace.from[2] + lace.to[2]) / 2] as [number, number, number]
                const dx = lace.to[0] - lace.from[0]
                const dy = lace.to[1] - lace.from[1]
                const dz = lace.to[2] - lace.from[2]
                const length = Math.sqrt(dx * dx + dy * dy + dz * dz) * 1.18
                const angleY = Math.atan2(dz, dx)
                const angleZ = Math.atan2(dy, Math.hypot(dx, dz))

                return (
                    <Part
                        key={`lace-${i}`}
                        geometry={geometries.lace}
                        position={mid}
                        scale={[1, length, 1]} // Use scale instead of generating new geometry sizes
                        rotation={[0, angleY, angleZ]}
                        color={accentColor}
                        roughness={0.6} // Matte cotton lace look
                    />
                )
            })}

            {/* ==================== SWOOSH ==================== */}
            <Part geometry={geometries.swoosh} position={[0.38, 0.17, 0.04]} rotation={[0.15, 0.35, -0.72]} scale={[1.38, 0.58, 1]} color={accentColor} roughness={0.1} clearcoat={0.3} />
            <Part geometry={geometries.swooshHighlight} position={[0.385, 0.175, 0.05]} rotation={[0.15, 0.35, -0.72]} scale={[1.38, 0.58, 1]} color="#eeeeee" roughness={0.1} />
            <Part geometry={geometries.heelTab} position={[0, 0.73, -0.4]} rotation={[0.45, 0, 0]} color={mainColor} roughness={0.4} />
        </group>
    )
}