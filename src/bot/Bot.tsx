import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useCursorTarget } from "./useCursorTarget";
import { botState, say, setExpression } from "./botStore";
import { lines } from "./botLines";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

const { damp, clamp } = THREE.MathUtils;

const MAX_YAW = 0.7;
const MAX_PITCH = 0.4;
const HEAD_SMOOTH = 6;
const EYE_SMOOTH = 12;

const GREEN = "#00ff7f";
const SHELL = "#111613";
const METAL = "#1b231f";
const WHITE = "#f4f7f5";

const pick = (a: readonly string[]) => a[Math.floor(Math.random() * a.length)];

export default function Bot() {
  const reduced = usePrefersReducedMotion();

  const root = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Group>(null!);
  const torso = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);
  const antenna = useRef<THREE.Group>(null!);
  const halo = useRef<THREE.Group>(null!);
  const eyeL = useRef<THREE.Mesh>(null!);
  const eyeR = useRef<THREE.Mesh>(null!);
  const led = useRef<THREE.Mesh>(null!);

  const cursor = useCursorTarget();
  const m = useRef({
    blinkT: 0,
    blinkNext: 2.5,
    eyeOpen: 0,
    eyeSY: 1,
    eyeSX: 1,
    eyeY: 0,
    vx: 0,
    vy: 0,
    downAt: 0,
    grabSaid: false,
    sleepSaid: false,
    cx: 0,
    cy: 0,
    rectAt: 0,
  });

  // Release handling: a short press is a click, a long one is a drag.
  useEffect(() => {
    const up = () => {
      if (!botState.grabbed) return;
      botState.grabbed = false;
      document.body.style.cursor = "";
      const held = performance.now() - m.current.downAt;
      if (held < 250) {
        botState.squash = 1;
        setExpression("happy", 1400);
        say(pick(lines.click));
      } else {
        setExpression("surprised", 1200);
        say(lines.dropped);
      }
      m.current.grabSaid = false;
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.body.style.cursor = "";
    };
  }, []);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const t = state.clock.elapsedTime;
    const now = performance.now();
    const c = cursor.current;
    const s = m.current;
    const idleFor = (now - c.lastMove) / 1000;

    // Where is the bot on screen? (cached, rect reads are not free)
    if (now - s.rectAt > 100) {
      const r = state.gl.domElement.getBoundingClientRect();
      s.cx = r.left + r.width / 2;
      s.cy = r.top + r.height * 0.42;
      s.rectAt = now;
    }

    // ---- Look target, normalised to -1..1 around the bot ----
    const W = Math.max(window.innerWidth, 1) * 0.35;
    const H = Math.max(window.innerHeight, 1) * 0.35;
    let tx = 0;
    let ty = 0;
    if (botState.lookAt) {
      tx = clamp((botState.lookAt.px - s.cx) / W, -1, 1);
      ty = clamp(-(botState.lookAt.py - s.cy) / H, -1, 1);
    } else if (!c.active && c.leftAt > 0) {
      // Cursor left the window: look ahead, then peek up toward the tab bar.
      ty = (now - c.leftAt) / 1000 < 1.5 ? 0 : 0.9;
    } else if (!c.active || idleFor > 4) {
      // Nobody is steering: drift around lazily.
      const k = reduced ? 0 : 1;
      tx = Math.sin(t * 0.6) * 0.4 * k;
      ty = Math.cos(t * 0.4) * 0.15 * k;
    } else {
      tx = clamp((c.px - s.cx) / W, -1, 1);
      ty = clamp(-(c.py - s.cy) / H, -1, 1);
    }

    // ---- Expression ----
    const temp = now < botState.expressionUntil ? botState.expression : null;
    const exp = temp ?? (idleFor > 10 && c.lastMove > 0 ? "sleepy" : "idle");
    if (exp === "sleepy" && !s.sleepSaid) {
      s.sleepSaid = true;
      say(lines.sleepy);
    }
    if (idleFor < 2) s.sleepSaid = false;

    // ---- Head ----
    const yaw = clamp(tx * MAX_YAW, -MAX_YAW, MAX_YAW);
    const pitch = clamp(-ty * MAX_PITCH, -MAX_PITCH, MAX_PITCH);
    const h = head.current;
    h.rotation.y = damp(h.rotation.y, yaw, HEAD_SMOOTH, dt);
    h.rotation.x = damp(h.rotation.x, pitch, HEAD_SMOOTH, dt);

    // Torso follows the head a little; antenna and halo lag behind it.
    torso.current.rotation.y = damp(torso.current.rotation.y, h.rotation.y * 0.35, 4, dt);
    antenna.current.rotation.z = damp(
      antenna.current.rotation.z,
      -h.rotation.y * 0.9 + (reduced ? 0 : Math.sin(t * 2) * 0.03),
      4,
      dt
    );
    antenna.current.rotation.x = damp(antenna.current.rotation.x, -h.rotation.x * 0.9, 4, dt);
    halo.current.rotation.x = damp(
      halo.current.rotation.x,
      Math.PI / 2 + h.rotation.x * 0.6 + (reduced ? 0 : Math.sin(t * 1.3) * 0.08),
      3,
      dt
    );
    halo.current.rotation.z = damp(halo.current.rotation.z, h.rotation.y * 0.6, 3, dt);

    // ---- Eyes ----
    const tSY = exp === "happy" ? 0.5 : exp === "surprised" ? 1.3 : exp === "sleepy" ? 0.3 : 1;
    const tSX = exp === "happy" ? 1.25 : exp === "surprised" ? 1.15 : 1;
    const tY = exp === "happy" ? 0.05 : 0;

    s.blinkT += dt;
    if (s.blinkT > s.blinkNext) {
      s.blinkT = 0;
      s.blinkNext = 2 + Math.random() * 3;
    }
    const blinking = s.blinkT < 0.12 && exp !== "sleepy";
    s.eyeSY = damp(s.eyeSY, tSY * (blinking ? 0.06 : 1), 28, dt);
    s.eyeSX = damp(s.eyeSX, tSX, 12, dt);
    s.eyeY = damp(s.eyeY, tY, 12, dt);
    s.eyeOpen = damp(s.eyeOpen, botState.awake ? 1 : 0, 4, dt);
    const sy = Math.max(0.02, s.eyeSY * s.eyeOpen);

    const ex = tx * 0.07;
    const ey = ty * 0.045;
    const eyes: [THREE.Mesh, number][] = [
      [eyeL.current, -0.18],
      [eyeR.current, 0.18],
    ];
    for (const [eye, baseX] of eyes) {
      eye.scale.set(s.eyeSX, sy, 1);
      eye.position.x = damp(eye.position.x, baseX + ex, EYE_SMOOTH, dt);
      eye.position.y = damp(eye.position.y, ey + s.eyeY, EYE_SMOOTH, dt);
    }

    // ---- Body: bob and squash ----
    body.current.position.y = reduced ? 0 : Math.sin(t * 1.6) * 0.03;
    botState.squash = damp(botState.squash, 0, 5, dt);
    const q = botState.squash;
    body.current.scale.set(1 + 0.06 * q, 1 - 0.08 * q, 1 + 0.06 * q);

    (led.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      2 + (reduced ? 0 : Math.sin(t * 3) * 1.2);

    // ---- Grab and throw: a spring toward the pointer (or back home) ----
    const grabbed = botState.grabbed;
    let gx = 0;
    let gy = 0;
    if (grabbed) {
      gx = state.pointer.x * state.viewport.width * 0.5 * 0.85;
      gy = state.pointer.y * state.viewport.height * 0.5 * 0.85;
      if (!s.grabSaid && now - s.downAt > 250) {
        s.grabSaid = true;
        say(lines.grab);
        document.body.style.cursor = "grabbing";
      }
    }
    const k = grabbed ? 90 : 40;
    const damping = grabbed ? 12 : 5;
    const r = root.current;
    s.vx += ((gx - r.position.x) * k - s.vx * damping) * dt;
    s.vy += ((gy - r.position.y) * k - s.vy * damping) * dt;
    r.position.x += s.vx * dt;
    r.position.y += s.vy * dt;
    r.rotation.z = clamp(-s.vx * 0.06, -0.35, 0.35);
  });

  return (
    <group
      ref={root}
      onPointerDown={(e) => {
        e.stopPropagation();
        botState.grabbed = true;
        m.current.downAt = performance.now();
        m.current.grabSaid = false;
      }}
      onPointerOver={() => {
        if (!botState.grabbed) document.body.style.cursor = "grab";
      }}
      onPointerOut={() => {
        if (!botState.grabbed) document.body.style.cursor = "";
      }}
    >
      <group ref={body}>
        {/* ---------- Torso ---------- */}
        <group ref={torso}>
          <mesh position={[0, -0.075, 0]}>
            <cylinderGeometry args={[0.17, 0.2, 0.3, 16]} />
            <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.4} />
          </mesh>
          <RoundedBox args={[0.95, 0.8, 0.55]} radius={0.12} smoothness={4} position={[0, -0.62, 0]}>
            <meshStandardMaterial color={SHELL} metalness={0.6} roughness={0.35} />
          </RoundedBox>
          {/* white accent stripe */}
          <mesh position={[0, -0.88, 0]}>
            <boxGeometry args={[0.97, 0.035, 0.57]} />
            <meshStandardMaterial color={WHITE} roughness={0.5} />
          </mesh>
          {/* chest panel */}
          <RoundedBox args={[0.46, 0.24, 0.03]} radius={0.02} position={[0, -0.55, 0.285]}>
            <meshStandardMaterial color="#050605" metalness={0.8} roughness={0.2} />
          </RoundedBox>
          <mesh ref={led} position={[-0.13, -0.55, 0.31]}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={2} />
          </mesh>
          {[0, 1].map((i) => (
            <mesh key={i} position={[0.06 + i * 0.09, -0.55, 0.305]}>
              <boxGeometry args={[0.06, 0.025, 0.01]} />
              <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={1.6} />
            </mesh>
          ))}
          {/* shoulders and arms */}
          {[-1, 1].map((side) => (
            <group key={side}>
              <mesh position={[side * 0.58, -0.38, 0]}>
                <sphereGeometry args={[0.16, 20, 20]} />
                <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.35} />
              </mesh>
              <mesh position={[side * 0.62, -0.72, 0]}>
                <capsuleGeometry args={[0.09, 0.32, 4, 10]} />
                <meshStandardMaterial color={SHELL} metalness={0.6} roughness={0.35} />
              </mesh>
            </group>
          ))}
        </group>

        {/* ---------- Head ---------- */}
        <group ref={head} position={[0, 0.55, 0]}>
          <RoundedBox args={[1.2, 0.95, 1]} radius={0.14} smoothness={4}>
            <meshStandardMaterial color={SHELL} metalness={0.6} roughness={0.35} />
          </RoundedBox>
          {/* visor */}
          <RoundedBox args={[1.0, 0.62, 0.04]} radius={0.06} position={[0, 0, 0.5]}>
            <meshStandardMaterial color="#020403" metalness={0.9} roughness={0.12} />
          </RoundedBox>
          {/* light bar above the visor */}
          <mesh position={[0, 0.4, 0.5]}>
            <boxGeometry args={[0.5, 0.02, 0.02]} />
            <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={1.8} />
          </mesh>
          {/* eyes */}
          <mesh ref={eyeL} position={[-0.18, 0, 0.53]}>
            <capsuleGeometry args={[0.07, 0.12, 4, 12]} />
            <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={2.5} />
          </mesh>
          <mesh ref={eyeR} position={[0.18, 0, 0.53]}>
            <capsuleGeometry args={[0.07, 0.12, 4, 12]} />
            <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={2.5} />
          </mesh>
          {/* ear pods */}
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.66, 0, 0]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.15, 0.14, 24]} />
                <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.35} />
              </mesh>
              <mesh position={[side * 0.075, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.1, 0.014, 8, 32]} />
                <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={2} />
              </mesh>
            </group>
          ))}
          {/* antenna */}
          <group ref={antenna} position={[0, 0.475, 0]}>
            <mesh position={[0, 0.175, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.35, 10]} />
              <meshStandardMaterial color={WHITE} />
            </mesh>
            <mesh position={[0, 0.375, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={3} />
            </mesh>
          </group>
        </group>

        {/* floating halo that lags behind the head */}
        <group ref={halo} position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.42, 0.012, 8, 64]} />
            <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={1.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
