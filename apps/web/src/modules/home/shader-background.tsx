import { Canvas } from "@react-three/fiber";
import { CanvasBackground } from "./canvas-background";
import { FluidSphere } from "./fluid-sphere-model";

interface ShaderBackgroundProps {
  children: React.ReactNode;
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen -z-10">
        <Canvas
          frameloop="always"
          performance={{ min: 0.2 }}
          camera={{ position: [0, 0, 5], fov: 270 }}
          dpr={[1, 1.25]}
          gl={{ antialias: true, alpha: false }}
        >
          <CanvasBackground />
          <FluidSphere />
        </Canvas>
      </div>
      <div className="relative z-10 w-full h-full">{children}</div>
    </>
  );
}
