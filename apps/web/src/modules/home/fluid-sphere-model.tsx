import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, ShaderMaterial, SphereGeometry, Vector3 } from "three";
import {
  fluidSphereFragment,
  fluidSphereVertex,
} from "./shaders/fluid-sphere-shader.glsl";

export function FluidSphere() {
  const meshRef = useRef<Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const handleScroll = () => (scrollRef.current = window.scrollY);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const geometry = useMemo(() => new SphereGeometry(1, 86, 86), []);

  const shaderMaterial = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          u_time: { value: 0 },
          u_intensity: { value: 0.5 },
          u_lightPos: { value: new Vector3(1, 1, 1) },
        },
        vertexShader: fluidSphereVertex,
        fragmentShader: fluidSphereFragment,
        transparent: true,
      }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const material = meshRef.current.material as ShaderMaterial;

    material.uniforms.u_time.value = time;
    material.uniforms.u_lightPos.value.set(
      Math.sin(time * 0.5) * 3,
      Math.cos(time * 0.6) * 2 + 1,
      Math.sin(time * 0.4) * 2 + 2
    );

    const { x, y } = mouseRef.current;
    const scrollY = scrollRef.current;

    meshRef.current.position.x = Math.sin(time * 0.3) * 2 - x * 0.2;
    meshRef.current.position.y =
      Math.cos(time * 0.6) * 0.9 - y * 0.2 + scrollY * 0.002;
    meshRef.current.position.z =
      Math.sin(time * 0.2 + Math.cos(time * 0.1)) * 2;

    meshRef.current.rotation.x = time * 0.04;
    meshRef.current.rotation.y = time * 0.02;

    const scale = 1.4 + Math.sin(time * 0.05) * 0.2;
    meshRef.current.scale.setScalar(scale);
  });

  return <mesh ref={meshRef} geometry={geometry} material={shaderMaterial} />;
}
