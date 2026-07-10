// File: src/components/star.tsx
import { useRef, useEffect, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { useStore, type StarSystemData } from '../store/store'
import './star.css'

interface StarFieldProps {
  systems: StarSystemData[]
}

const vertexShader = `
attribute float aClass;
attribute float aMass;

varying vec2 vUv;
varying float vClass;
varying float vMass;

void main() {
  vUv = uv;
  vClass = aClass;
  vMass = aMass;
  
  // Extract position from instance matrix
  vec3 iPosition = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
  
  // Get camera right and up vectors for billboarding
  vec3 camRight = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 camUp = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  
  // Compressed size based on mass (logarithmic scale)
  float size = 1.5 + log(max(aMass, 0.0) + 1.0) * 1.5;
  
  // Billboard the plane to always face the camera
  vec3 pos = iPosition + (camRight * position.x + camUp * position.y) * size;
  
  gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
varying float vClass;
varying float vMass;

// Map spectral class (0-6) to star color
vec3 getStarColor(float c) {
  vec3 colors[7];
  colors[0] = vec3(0.4, 0.6, 1.0); // O - Blue
  colors[1] = vec3(0.6, 0.7, 1.0); // B - Blue-White
  colors[2] = vec3(0.9, 0.9, 1.0); // A - White
  colors[3] = vec3(1.0, 1.0, 0.9); // F - Yellow-White
  colors[4] = vec3(1.0, 0.9, 0.6); // G - Yellow
  colors[5] = vec3(1.0, 0.7, 0.4); // K - Orange
  colors[6] = vec3(1.0, 0.4, 0.2); // M - Red
  
  int index = int(floor(c + 0.5));
  if (index < 0) index = 0;
  if (index > 6) index = 6;
  return colors[index];
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0; // Center UV from -1 to 1
  float dist = length(uv);
  
  vec3 baseColor = getStarColor(vClass);
  
  // Bright core
  float core = smoothstep(0.1, 0.0, dist);
  core = pow(core, 2.5);
  
  // Inner corona
  float corona1 = smoothstep(0.5, 0.05, dist);
  corona1 = pow(corona1, 3.0) * 0.7;
  
  // Outer corona / glow
  float corona2 = smoothstep(1.0, 0.0, dist);
  corona2 = pow(corona2, 1.2) * 0.4;
  
  // Diffraction spikes (rays) for hotter stars (O, B, A classes)
  float angle = atan(uv.y, uv.x);
  float rays = 0.0;
  if (vClass < 3.0) {
    float rayIntensity = (3.0 - vClass) / 3.0;
    rays = abs(sin(angle * 4.0)) * smoothstep(0.9, 0.2, dist) * 0.3 * rayIntensity;
    rays += abs(cos(angle * 4.0)) * smoothstep(0.9, 0.3, dist) * 0.15 * rayIntensity;
  }
  
  float finalAlpha = core + corona1 + corona2 + rays;
  vec3 finalColor = baseColor * (core * 4.0 + corona1 * 2.0 + corona2 + rays * 1.5);
  
  // Add white-hot center
  finalColor += vec3(1.0, 0.95, 0.9) * core * 0.9;
  
  if (finalAlpha < 0.01) discard;
  
  gl_FragColor = vec4(finalColor, finalAlpha);
}
`

export default function StarField({ systems }: StarFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { camera, gl, raycaster } = useThree()
  const setSelectedStar = useStore(s => s.setSelectedStar)
  const setHoveredSystem = useStore(s => s.setHoveredSystem)
  const hoveredSystem = useStore(s => s.hoveredSystem)
  
  // Теперь systems - это массив звезд, каждая система = одна звезда
  const allStars = useMemo(() => {
    return systems.map((system, index) => ({
      ...system,
      systemIndex: index,
    }))
  }, [systems])

  const classMap: Record<string, number> = {
    'O': 0, 'B': 1, 'A': 2, 'F': 3, 'G': 4, 'K': 5, 'M': 6
  }

  // Create geometry once
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1), [])

  useEffect(() => {
    if (!meshRef.current || allStars.length === 0) return
    
    const dummy = new THREE.Object3D()
    const classArray = new Float32Array(allStars.length)
    const massArray = new Float32Array(allStars.length)
    
    allStars.forEach((star, i) => {
      dummy.position.set(star.x, star.y, star.z)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      
      // Используем spect для спектрального класса и mag для массы/яркости
      const spectralClass = star.spect ? star.spect.charAt(0).toUpperCase() : 'G'
      classArray[i] = classMap[spectralClass] ?? 4
      
      // Используем абсолютную величину как меру массы/яркости
      // Чем меньше mag, тем ярче звезда
      const brightness = star.mag ? Math.max(0.1, 10 - star.mag) : 1.0
      massArray[i] = brightness
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
    
    // Update or add instanced attributes
    if (geometry.getAttribute('aClass')) {
      (geometry.getAttribute('aClass') as THREE.InstancedBufferAttribute).set(classArray)
      ;(geometry.getAttribute('aMass') as THREE.InstancedBufferAttribute).set(massArray)
    } else {
      geometry.setAttribute('aClass', new THREE.InstancedBufferAttribute(classArray, 1))
      geometry.setAttribute('aMass', new THREE.InstancedBufferAttribute(massArray, 1))
    }
    
  }, [allStars, geometry])

  // Функция для проецирования 3D позиции на 2D экран
  const projectToScreen = useCallback((position: THREE.Vector3) => {
    const vector = position.clone()
    vector.project(camera)
    
    const width = gl.domElement.clientWidth
    const height = gl.domElement.clientHeight
    
    return {
      x: (vector.x * 0.5 + 0.5) * width,
      y: (-vector.y * 0.5 + 0.5) * height,
      visible: vector.z < 1 // Проверяем что объект перед камерой
    }
  }, [camera, gl])

  // Функция для поиска ближайшей звезды к позиции мыши
  const findClosestStarToMouse = useCallback((clientX: number, clientY: number) => {
    if (!meshRef.current || allStars.length === 0) return null
    
    const rect = gl.domElement.getBoundingClientRect()
    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    )
    
    raycaster.setFromCamera(mouse, camera)
    
    // Проверяем пересечение луча с позициями звезд
    let closestStar = null
    let minDistance = Infinity
    const threshold = 3.0 // Радиус поиска в мировых координатах
    
    for (let i = 0; i < allStars.length; i++) {
      const star = allStars[i]
      const starPosition = new THREE.Vector3(star.x, star.y, star.z)
      
      // Вычисляем расстояние от луча до позиции звезды
      const rayDistance = raycaster.ray.distanceToPoint(starPosition)
      
      // Также проверяем что звезда перед камерой
      const cameraDistance = camera.position.distanceTo(starPosition)
      
      // Используем комбинированную метрику: расстояние от луча + штраф за удаленность
      const combinedDistance = rayDistance + cameraDistance * 0.01
      
      if (rayDistance < threshold && combinedDistance < minDistance) {
        minDistance = combinedDistance
        closestStar = { star, index: i }
      }
    }
    
    return closestStar
  }, [allStars, camera, gl, raycaster])

  // Обновление позиции hover на каждом кадре если есть hoveredSystem
  useFrame(() => {
    if (!hoveredSystem) return
    
    const hoverElement = document.querySelector('.star-hover') as HTMLElement
    if (!hoverElement) return
    
    // Проецируем 3D позицию звезды на 2D экран
    const starPosition = new THREE.Vector3(hoveredSystem.x, hoveredSystem.y, hoveredSystem.z)
    const screenPos = projectToScreen(starPosition)
    
    if (screenPos.visible) {
      // Позиционируем hover с учетом границ экрана
      const hoverWidth = hoverElement.offsetWidth || 160
      const hoverHeight = hoverElement.offsetHeight || 100
      const canvasWidth = gl.domElement.clientWidth
      const canvasHeight = gl.domElement.clientHeight
      
      let left = screenPos.x + 15
      let top = screenPos.y + 15
      
      // Проверяем правую границу
      if (left + hoverWidth > canvasWidth) {
        left = screenPos.x - hoverWidth - 15
      }
      
      // Проверяем нижнюю границу
      if (top + hoverHeight > canvasHeight) {
        top = screenPos.y - hoverHeight - 15
      }
      
      // Проверяем левую границу
      if (left < 0) {
        left = 10
      }
      
      // Проверяем верхнюю границу
      if (top < 0) {
        top = 10
      }
      
      hoverElement.style.left = `${left}px`
      hoverElement.style.top = `${top}px`
    }
  })

  // Обработчик клика
  useEffect(() => {
    const canvas = gl.domElement
    
    const handleClick = (e: MouseEvent) => {
      const closestStar = findClosestStarToMouse(e.clientX, e.clientY)
      if (closestStar) {
        setSelectedStar(allStars[closestStar.index])
      }
    }
    
    canvas.addEventListener('click', handleClick)
    return () => canvas.removeEventListener('click', handleClick)
  }, [findClosestStarToMouse, allStars, setSelectedStar, gl])

  // Обработчик движения мыши для hover
  useEffect(() => {
    const canvas = gl.domElement
    
    const handlePointerMove = (e: MouseEvent) => {
      const closestStar = findClosestStarToMouse(e.clientX, e.clientY)
      
      if (closestStar) {
        const star = allStars[closestStar.index]
        setHoveredSystem(star)
      } else {
        setHoveredSystem(null)
      }
    }
    
    const handlePointerOut = () => {
      setHoveredSystem(null)
    }
    
    canvas.addEventListener('mousemove', handlePointerMove)
    canvas.addEventListener('mouseout', handlePointerOut)
    
    return () => {
      canvas.removeEventListener('mousemove', handlePointerMove)
      canvas.removeEventListener('mouseout', handlePointerOut)
    }
  }, [findClosestStarToMouse, allStars, setHoveredSystem, gl])

  if (allStars.length === 0) return null

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, allStars.length]}
      frustumCulled={false}
    >
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  )
}