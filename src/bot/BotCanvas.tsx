import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import Bot from "./Bot";

export default function BotCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 5.4], fov: 35 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "auto", touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <pointLight position={[0, 0, 2.5]} color="#00ff7f" intensity={6} distance={8} />

      {/* Local studio lights: no network fetch for an HDR file */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2} position={[0, 3, 3]} scale={[6, 3, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.5} position={[-4, 0, 2]} scale={[2, 4, 1]} color="#00ff7f" />
        <Lightformer form="rect" intensity={1.5} position={[4, 1, -2]} scale={[2, 4, 1]} color="#ffffff" />
      </Environment>

      <Bot />

      <ContactShadows position={[0, -1.25, 0]} opacity={0.5} scale={5} blur={2.6} far={2} color="#00ff7f" />

      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.6} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
