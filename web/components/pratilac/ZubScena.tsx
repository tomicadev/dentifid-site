"use client";

import { useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";
import ZubHologram from "@/components/three/ZubHologram";

export type StanjePratioca = {
  /** Položaj miša u odnosu na zub, od -1 do 1 po obe ose. */
  misX: number;
  misY: number;
  /** Dodatni zamah okretanja; raste dok zub putuje, pa se smiruje. */
  zamah: number;
  /** Da li je pokazivač iznad zuba. */
  iznad: boolean;
};

type Props = {
  stanje: MutableRefObject<StanjePratioca>;
  mirno: boolean;
  naPlavom?: boolean;
};

function Zub({ stanje, mirno, naPlavom }: Props) {
  const grupa = useRef<Group>(null);
  const okret = useRef(0);

  useFrame((kadar, delta) => {
    const g = grupa.current;
    if (!g) return;
    const s = stanje.current;

    if (mirno) {
      g.rotation.set(0.12, -0.5, 0);
      return;
    }

    // Stalno, sporo okretanje, koje se ubrza dok zub putuje po strani.
    okret.current += delta * (0.45 + s.zamah * 5);
    s.zamah *= 0.94;

    const t = kadar.clock.elapsedTime;
    const ciljX = 0.12 + s.misY * 0.35;
    const nagib = s.misX * 0.45;

    g.rotation.y = okret.current + nagib;
    g.rotation.x += (ciljX - g.rotation.x) * Math.min(delta * 4, 1);
    g.rotation.z = Math.sin(t * 0.9) * 0.08;
    g.position.y = Math.sin(t * 1.3) * 0.05;

    const mera = s.iznad ? 1.1 : 1;
    g.scale.x += (mera - g.scale.x) * Math.min(delta * 8, 1);
    g.scale.y = g.scale.x;
    g.scale.z = g.scale.x;
  });

  return (
    <group ref={grupa}>
      <ZubHologram naPlavom={naPlavom} />
    </group>
  );
}

/** Mala scena samo za zub. Hologram ne zavisi od svetla, pa u sceni nema
 *  ni lampi ni okoline — samo kamera i zub. */
export default function ZubScena({ stanje, mirno, naPlavom }: Props) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 2.35], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={mirno ? "demand" : "always"}
    >
      <Zub stanje={stanje} mirno={mirno} naPlavom={naPlavom} />
    </Canvas>
  );
}
