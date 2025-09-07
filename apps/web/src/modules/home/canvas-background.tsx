import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { ShaderMaterial, Mesh } from "three";
import {
  gradientFragment,
  gradientVertex,
} from "./shaders/gradient-shader.glsl";

export function CanvasBackground() {
  const meshRef = useRef<Mesh>(null);

  const shaderMaterial = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          u_time: { value: 0 },
          u_resolution: { value: [window.innerWidth, window.innerHeight] },
        },
        vertexShader: gradientVertex,
        fragmentShader: gradientFragment,
      }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as ShaderMaterial).uniforms.u_time.value =
        state.clock.getElapsedTime();
    }
  });

  return (
    <mesh
      ref={meshRef}
      material={shaderMaterial}
      position={[0, 0, -5]}
      scale={[50, 50, 1]}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
