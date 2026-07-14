'use client'
import { useEffect, useMemo } from 'react'
import { useGLTF, useBounds, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export type PartConfig = {
    paintTargets: string[]
    color: string
}

type CarModelProps = {
    modelPath: string
    partConfigs?: PartConfig[]
    activePartId?: string
}

export default function CarModel({ modelPath, partConfigs = [], activePartId }: CarModelProps) {
    const { scene } = useGLTF(modelPath)
    const bounds = useBounds()

    const configsKey = JSON.stringify(partConfigs)

    const cloned = useMemo(() => {
        const clone = scene.clone(true)

        const box = new THREE.Box3().setFromObject(clone)
        const size = new THREE.Vector3()
        box.getSize(size)
        const center = new THREE.Vector3()
        box.getCenter(center)

        clone.position.x = -center.x
        clone.position.z = -center.z
        clone.position.y = -box.min.y

        const maxDim = Math.max(size.x, size.y, size.z)
        if (maxDim > 0) {
            const scaleFactor = 4.5 / maxDim
            clone.scale.setScalar(scaleFactor)
            clone.position.multiplyScalar(scaleFactor)
        }

        // Deep-clone the materials so we own them independently
        clone.traverse((child) => {
            if (child.type === 'Mesh') {
                const mesh = child as THREE.Mesh
                if (mesh.material) {
                    const processMaterial = (m: THREE.Material) => {
                        const clonedMat = m.clone()
                        const matName = clonedMat.name ?? ''
                        
                        // If it's a wheel material, patch the shader to desaturate the texture map.
                        // This prevents baked-in blue colors from mixing with custom paint selections.
                        if (matName.toLowerCase().includes('wheel')) {
                            clonedMat.onBeforeCompile = (shader) => {
                                shader.fragmentShader = shader.fragmentShader.replace(
                                    'diffuseColor *= texelColor;',
                                    `
                                    float luma = dot(texelColor.rgb, vec3(0.299, 0.587, 0.114));
                                    texelColor.rgb = vec3(luma);
                                    diffuseColor *= texelColor;
                                    `
                                )
                            }
                            clonedMat.customProgramCacheKey = () => 'desaturated-wheel-map'
                        }
                        return clonedMat
                    }

                    if (Array.isArray(mesh.material)) {
                        mesh.material = mesh.material.map(processMaterial)
                    } else {
                        mesh.material = processMaterial(mesh.material)
                    }
                }
            }
        })

        return clone
    }, [scene])

    // Apply colors based on configurations
    useEffect(() => {
        if (!cloned || partConfigs.length === 0) return

        cloned.traverse((child) => {
            if (child.type === 'Mesh') {
                const mesh = child as THREE.Mesh
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
                
                materials.forEach((mat) => {
                    if (!mat) return
                    const matName = mat.name ?? ''
                    
                    // Find if there is a matching configuration for this material
                    const matchingConfig = partConfigs.find((config) =>
                        config.paintTargets.some((target) =>
                            matName.toLowerCase().includes(target.toLowerCase())
                        )
                    )
                    
                    if (matchingConfig && 'color' in mat) {
                        const standardMat = mat as THREE.MeshStandardMaterial
                        standardMat.color.set(matchingConfig.color)
                        
                        // Specialized window material handling for transparency/tint level
                        if (matName.toLowerCase().includes('window')) {
                            standardMat.transparent = true
                            if (matchingConfig.color === '#ffffff') {
                                standardMat.opacity = 0.25 // clear transparent glass
                            } else if (matchingConfig.color === '#333333') {
                                standardMat.opacity = 0.6 // smoke tint
                            } else if (matchingConfig.color === '#111111') {
                                standardMat.opacity = 0.85 // dark stealth tint
                            }
                        }
                        
                        standardMat.needsUpdate = true
                    }
                })
            }
        })
    }, [cloned, configsKey])

    // Dynamically focus camera on active configuration part
    useEffect(() => {
        if (!bounds || !cloned) return

        if (activePartId === 'interior' || activePartId === 'stitching') {
            // Position the camera looking directly into the cockpit
            const box = new THREE.Box3()
            // The cabin center is typically at x=0, y=0.7 (steering wheel height), z=0.2 (front seats)
            const cabinCenter = new THREE.Vector3(0, 0.7, 0.2)
            box.setFromCenterAndSize(cabinCenter, new THREE.Vector3(2.0, 2.0, 2.0))
            bounds.refresh(box).fit()
        } else if (activePartId && activePartId !== 'body') {
            const targets: THREE.Object3D[] = []
            
            cloned.traverse((child) => {
                if (child.type === 'Mesh') {
                    const mesh = child as THREE.Mesh
                    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
                    
                    const matchesPart = materials.some((mat) => {
                        if (!mat) return false
                        const matName = mat.name ?? ''
                        if (activePartId === 'wheels') {
                            return matName.toLowerCase().includes('wheel')
                        } else if (activePartId === 'calipers') {
                            return matName.toLowerCase().includes('calip') || matName.toLowerCase().includes('calli')
                        } else if (activePartId === 'windows') {
                            return matName.toLowerCase().includes('window')
                        } else if (activePartId === 'accents') {
                            return matName.toLowerCase().includes('carbon') || matName.toLowerCase().includes('colour')
                        }
                        return false
                    })
                    
                    if (matchesPart) {
                        targets.push(mesh)
                    }
                }
            })

            if (targets.length > 0) {
                // Focus on the first matching mesh, calculating a cushioned bounds box.
                const box = new THREE.Box3().setFromObject(targets[0])
                const center = new THREE.Vector3()
                box.getCenter(center)
                
                const size = new THREE.Vector3()
                box.getSize(size)
                
                // First expand the box proportionally by 75%
                box.expandByVector(size.clone().multiplyScalar(0.75))
                box.getSize(size)
                
                // Ensure a minimum bounding box size to prevent the camera from fitting
                // closer than the OrbitControls' minDistance (2.0), avoiding snap-back jitter.
                // We make the box slightly larger for windows/accents to see a broader view.
                const minBoxSize = activePartId === 'windows' ? 3.0 : 2.4
                const halfMin = minBoxSize / 2
                
                if (size.x < minBoxSize) {
                    box.min.x = center.x - halfMin
                    box.max.x = center.x + halfMin
                }
                if (size.y < minBoxSize) {
                    box.min.y = center.y - halfMin
                    box.max.y = center.y + halfMin
                }
                if (size.z < minBoxSize) {
                    box.min.z = center.z - halfMin
                    box.max.z = center.z + halfMin
                }
                
                bounds.refresh(box).fit()
            }
        } else {
            // Focus out to show the full car
            bounds.refresh(cloned).fit()
        }
    }, [activePartId, cloned, bounds])

    return <primitive object={cloned} />
}

export function CarViewerControls({ autoRotate = true }: { autoRotate?: boolean }) {
    return (
        <OrbitControls
            makeDefault
            enableZoom
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={0.6}
            minDistance={2}
            maxDistance={12}
            maxPolarAngle={Math.PI / 1.9}
        />
    )
}

export function preloadCarModel(modelPath: string) {
    useGLTF.preload(modelPath)
}
