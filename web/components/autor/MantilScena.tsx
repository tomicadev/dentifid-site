"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import {
  DONJI_DZEP,
  DUGMAD,
  DZEP,
  KROJ,
  OKVIR_KROJA,
  OKVIR_REVERA,
  SREDINA,
  ivicePanela,
  iviceRevera,
  lerp,
  mestoKopce,
  mestoOlovke,
  napraviBluzu,
  napraviDeo,
  napraviKragnu,
  napraviRukav,
  napraviTraku,
  napraviUnutrasnjost,
  normala,
  postaviDeo,
  postaviRukav,
  redDzepa,
  tacka,
} from "./mantil";
import {
  napraviLiceKartice,
  oblikKartice,
  teksturaBluze,
  teksturaDzepa,
  teksturaKragne,
  teksturaRevera,
  teksturaRukava,
  teksturaSenke,
  teksturaTela,
  teksturaTkanja,
  teksturaTrake,
  teksturaUnutrasnjosti,
} from "./teksture";

export type StanjeMantila = {
  /** Položaj miša u odnosu na pozornicu, od -1 do 1. */
  misX: number;
  misY: number;
};

type Props = {
  ime: string;
  titula: string;
  slika?: string;
  aktivno: boolean;
  mirno: boolean;
  stanje: MutableRefObject<StanjeMantila>;
  onSpremno: () => void;
};

/** Ceo mantil u prostoru: lebdi, polako se okreće ka mišu, porub i rukavi lepršaju. */
export default function MantilScena({ aktivno, mirno, onSpremno, ...ostalo }: Props) {
  return (
    <Canvas
      camera={{ position: [0, -0.1, 8.3], fov: 30 }}
      dpr={[1.5, 2]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={mirno ? "demand" : aktivno ? "always" : "never"}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1;
        onSpremno();
      }}
    >
      <Svetla />
      <Mantil mirno={mirno} {...ostalo} />
    </Canvas>
  );
}

function Svetla() {
  return (
    <>
      <hemisphereLight args={["#ffffff", "#cddcf0", 0.55]} />
      <directionalLight
        position={[-3.2, 4.6, 5.5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0004}
        shadow-intensity={0.5}
        shadow-radius={5}
        shadow-normalBias={0.025}
        shadow-camera-left={-2.8}
        shadow-camera-right={2.8}
        shadow-camera-top={2.6}
        shadow-camera-bottom={-2.6}
        shadow-camera-near={1}
        shadow-camera-far={16}
      />
      {/* hladno svetlo otpozadi ocrtava beo mantil na beloj pozadini */}
      <directionalLight position={[4, 1.2, -3]} intensity={0.8} color="#cfe0ff" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={1.6} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-5, 1, 3]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer
          form="rect"
          intensity={0.8}
          color="#cfe2ff"
          position={[5, 0, -2]}
          rotation-y={-Math.PI / 2}
          scale={[6, 5, 1]}
        />
        <Lightformer form="rect" intensity={0.5} position={[0, -4, 2]} rotation-x={-Math.PI / 2} scale={[10, 4, 1]} />
      </Environment>
    </>
  );
}

/** Delovi kroja. Obe polovine koriste iste geometrije; desna je odraz leve. */
function napraviDelove() {
  const O = OKVIR_KROJA;
  const R = OKVIR_REVERA;
  const telo = napraviDeo(
    96,
    40,
    (v) => {
      const y = lerp(KROJ.vrh, KROJ.dno, v);
      const [x0, x1] = ivicePanela(y);
      return { y, x0, x1 };
    },
    () => 0,
    (x, y) => [(x - O.x0) / (O.x1 - O.x0), (y - O.y0) / (O.y1 - O.y0)],
  );
  // rever leži na telu; uz liniju preloma je deblji, jer je tu tkanina presavijena
  const rever = napraviDeo(
    40,
    16,
    (v) => {
      const y = lerp(KROJ.vrat[1], KROJ.prelom, v);
      const [x0, x1] = iviceRevera(y);
      return { y, x0, x1 };
    },
    (u) => 0.014 + 0.03 * u ** 3 + 0.01 * (1 - u) ** 6,
    (x, y) => [(x - R.x0) / (R.x1 - R.x0), (y - R.y0) / (R.y1 - R.y0)],
  );
  // gornji džep se na otvoru odvaja od tela, jer je u njemu olovka
  const dzep = napraviDeo(
    16,
    16,
    redDzepa(DZEP),
    (u, v) => 0.012 + 0.05 * Math.sin(Math.PI * u) ** 0.7 * (1 - v) ** 2,
    (_x, _y, u, v) => [u, 1 - v],
  );
  const donjiDzep = napraviDeo(
    16,
    20,
    redDzepa(DONJI_DZEP),
    (u, v) => 0.012 + 0.02 * Math.sin(Math.PI * u) ** 0.7 * (1 - v),
    (_x, _y, u, v) => [u, 1 - v],
  );
  postaviDeo(rever, 0, 0);
  postaviDeo(dzep, 0, 0);
  return {
    telo,
    rever,
    dzep,
    donjiDzep,
    rukav: napraviRukav(),
    kragna: napraviKragnu(),
    traka: napraviTraku(),
    bluza: napraviBluzu(),
    unutra: napraviUnutrasnjost(),
    kopca: mestoKopce(),
    olovka: mestoOlovke(),
  };
}

function napraviMaterijale() {
  const tkanje = teksturaTkanja();
  const tkanina = (map: THREE.Texture, ponavljanje: [number, number]) => {
    const normale = tkanje.clone();
    normale.repeat.set(...ponavljanje);
    normale.needsUpdate = true;
    return new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      map,
      normalMap: normale,
      normalScale: new THREE.Vector2(0.3, 0.3),
      roughness: 0.9,
      sheen: 0.35,
      sheenRoughness: 0.75,
      sheenColor: new THREE.Color("#e3ecff"),
      side: THREE.DoubleSide,
    });
  };
  return {
    teloLevo: tkanina(teksturaTela({ desna: false }), [20, 50]),
    teloDesno: tkanina(teksturaTela({ desna: true }), [20, 50]),
    rever: tkanina(teksturaRevera(), [9, 20]),
    dzep: tkanina(teksturaDzepa(), [5, 6]),
    rukav: tkanina(teksturaRukava(), [22, 32]),
    kragna: tkanina(teksturaKragne(), [24, 3]),
    bluza: tkanina(teksturaBluze(), [18, 22]),
    unutra: tkanina(teksturaUnutrasnjosti(), [14, 4]),
    traka: new THREE.MeshPhysicalMaterial({
      map: teksturaTrake(),
      roughness: 0.55,
      sheen: 0.4,
      sheenColor: new THREE.Color("#9cc3ff"),
      side: THREE.DoubleSide,
    }),
    plastika: new THREE.MeshPhysicalMaterial({
      color: "#f5f8fc",
      roughness: 0.35,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
    }),
    metal: new THREE.MeshStandardMaterial({ color: "#d9dee6", metalness: 1, roughness: 0.28 }),
    dugme: new THREE.MeshPhysicalMaterial({ color: "#f3f6fb", roughness: 0.3, clearcoat: 0.7 }),
    olovka: new THREE.MeshPhysicalMaterial({ color: "#0e62e0", roughness: 0.25, clearcoat: 1 }),
    senka: new THREE.MeshBasicMaterial({ map: teksturaSenke(), transparent: true, depthWrite: false }),
  };
}

type Delovi = ReturnType<typeof napraviDelove>;
type Materijali = ReturnType<typeof napraviMaterijale>;

type MantilProps = Omit<Props, "aktivno" | "onSpremno">;

function Mantil({ ime, titula, slika, mirno, stanje }: MantilProps) {
  const spolja = useRef<THREE.Group>(null);
  const kartica = useRef<THREE.Group>(null);
  const senka = useRef<THREE.Mesh>(null);
  const dugmad = useRef<(THREE.Mesh | null)[]>([]);
  const pocetak = useRef<number | null>(null);

  const invalidate = useThree((st) => st.invalidate);
  const delovi = useMemo(napraviDelove, []);
  const materijali = useMemo(napraviMaterijale, []);

  // Lice kartice je tekstura na samoj pločici, pa se nikad ne odvaja od nje.
  // Crta se u veličini u kojoj se kartica vidi (uz malu rezervu), da bude oštra.
  const visinaPlatna = useThree((st) => st.size.height);
  const gustina = useThree((st) => st.viewport.dpr);
  const pikselaPoJedinici = visinaPlatna / (2 * 7.2 * Math.tan((15 * Math.PI) / 180));
  const visinaLica = Math.min(
    2048,
    Math.max(384, Math.round((1.35 * pikselaPoJedinici * gustina * 1.3) / 48) * 48),
  );
  const lice = useMemo(
    () => napraviLiceKartice(ime, titula, slika, visinaLica),
    [ime, titula, slika, visinaLica],
  );
  const oblikLica = useMemo(() => oblikKartice(0.9, 1.35, 0.05), []);
  useEffect(() => () => oblikLica.dispose(), [oblikLica]);
  const liceMaterijal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: lice.tekstura,
        emissive: "#ffffff",
        emissiveMap: lice.tekstura,
        emissiveIntensity: 0.45,
        roughness: 0.5,
      }),
    [lice],
  );
  useEffect(() => {
    let ziv = true;
    lice.gotovo.then(() => {
      if (ziv) invalidate();
    });
    return () => {
      ziv = false;
      lice.tekstura.dispose();
      liceMaterijal.dispose();
    };
  }, [lice, liceMaterijal, invalidate]);

  useEffect(
    () => () => {
      Object.values(materijali).forEach((m) => {
        const s = m as THREE.MeshStandardMaterial;
        s.map?.dispose();
        s.normalMap?.dispose();
        m.dispose();
      });
      Object.values(delovi).forEach((d) => {
        if (d instanceof THREE.BufferGeometry) d.dispose();
        else if (d && typeof d === "object" && "geometrija" in d) d.geometrija.dispose();
      });
    },
    [materijali, delovi],
  );

  const p = useMemo(() => new THREE.Vector3(), []);
  const n = useMemo(() => new THREE.Vector3(), []);
  const gore = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame((s, delta) => {
    if (pocetak.current === null) pocetak.current = s.clock.elapsedTime;
    const t = s.clock.elapsedTime - pocetak.current;
    const snaga = mirno ? 0 : 1;
    const tt = mirno ? 0 : t;

    // geometrije su zajedničke za obe polovine, pa se računaju jednom
    postaviDeo(delovi.telo, tt, snaga);
    postaviDeo(delovi.donjiDzep, tt, snaga);
    postaviRukav(delovi.rukav, tt, snaga);

    DUGMAD.forEach(([x, y], i) => {
      const dugme = dugmad.current[i];
      if (!dugme) return;
      tacka(x, y, tt, snaga, 0.012, p);
      normala(x, y, tt, snaga, n);
      dugme.position.copy(p);
      dugme.quaternion.setFromUnitVectors(gore, n);
    });

    const g = spolja.current;
    if (g) {
      const ulaz = mirno ? 1 : 1 - (1 - Math.min(t / 1.6, 1)) ** 3;
      const cilj = -0.12 + stanje.current.misX * 0.14 + (mirno ? 0 : Math.sin(t * 0.37) * 0.05);
      const k = Math.min(delta * 3, 1);
      g.position.y = (mirno ? 0 : Math.sin(t * 0.8) * 0.07) - (1 - ulaz) * 0.35;
      g.rotation.y += (cilj - (1 - ulaz) * 0.4 - g.rotation.y) * k;
      g.rotation.x += (0.03 + stanje.current.misY * 0.05 - g.rotation.x) * k;
      g.rotation.z = mirno ? 0 : Math.sin(t * 0.6) * 0.015;

      const pod = senka.current;
      if (pod) {
        const visina = g.position.y;
        pod.scale.setScalar(1 - visina * 0.5);
        (pod.material as THREE.MeshBasicMaterial).opacity = 0.8 - visina * 0.9;
      }
    }

    // kartica se njiše na traci; pri ulasku jače, pa se smiri
    const kt = kartica.current;
    if (kt) {
      const pocetno = mirno ? 0 : Math.exp(-t * 0.9) * 0.2;
      const z = mirno ? 0 : 1;
      kt.rotation.z = z * (Math.sin(t * 1.25) * 0.04 + pocetno * Math.sin(t * 3.1));
      kt.rotation.x = -0.04 + z * Math.sin(t * 0.9 + 0.7) * 0.025;
      kt.rotation.y = z * Math.sin(t * 0.7) * 0.05;
    }
  });

  const { kopca, olovka } = delovi;

  return (
    <>
      <group ref={spolja}>
        <group position-x={-SREDINA}>
          <Polovina delovi={delovi} materijali={materijali} telo={materijali.teloLevo} />

          {/* desna polovina je odraz leve, malo ispred, jer preklapa levu na zakopčavanju */}
          <group position={[2 * SREDINA, 0, 0.012]} scale={[-1, 1, 1]}>
            <Polovina delovi={delovi} materijali={materijali} telo={materijali.teloDesno} />
            <mesh geometry={delovi.dzep.geometrija} material={materijali.dzep} castShadow receiveShadow />
            <group position={olovka.polozaj} rotation={[0, 0, 0.06]}>
              <mesh material={materijali.olovka} castShadow>
                <cylinderGeometry args={[0.022, 0.022, 0.34, 20]} />
              </mesh>
              <mesh position={[0, 0.19, 0]} material={materijali.metal}>
                <cylinderGeometry args={[0.012, 0.022, 0.04, 20]} />
              </mesh>
              <mesh position={[0, 0.1, 0.028]} material={materijali.metal} castShadow>
                <boxGeometry args={[0.012, 0.13, 0.008]} />
              </mesh>
            </group>
            {DUGMAD.map((_, i) => (
              <mesh
                key={i}
                ref={(m) => {
                  dugmad.current[i] = m;
                }}
                material={materijali.dugme}
                castShadow
              >
                <cylinderGeometry args={[0.036, 0.034, 0.014, 24]} />
              </mesh>
            ))}
          </group>

          <mesh geometry={delovi.bluza} material={materijali.bluza} receiveShadow />
          <mesh geometry={delovi.unutra} material={materijali.unutra} />

          <group ref={kartica} position={kopca}>
            <mesh position={[0, 0.03, 0]} material={materijali.metal} castShadow>
              <cylinderGeometry args={[0.024, 0.024, 0.06, 18]} />
            </mesh>
            <mesh position={[0, -0.04, 0]} rotation={[0, Math.PI / 2, 0]} material={materijali.metal}>
              <torusGeometry args={[0.034, 0.008, 10, 28]} />
            </mesh>
            {/* pločica kartice daje debljinu i senku na mantilu */}
            <RoundedBox
              args={[0.9, 1.35, 0.02]}
              radius={0.05}
              smoothness={4}
              position={[0, -0.735, 0]}
              material={materijali.plastika}
              castShadow
            />
            <mesh position={[0, -0.735, 0.0105]} geometry={oblikLica} material={liceMaterijal} />
          </group>
        </group>
      </group>

      <mesh ref={senka} position={[0, -2.12, 0.4]} rotation={[-Math.PI / 2, 0, 0]} material={materijali.senka}>
        <planeGeometry args={[4.4, 1.6]} />
      </mesh>
    </>
  );
}

function Polovina({ delovi, materijali, telo }: { delovi: Delovi; materijali: Materijali; telo: THREE.Material }) {
  return (
    <>
      <mesh geometry={delovi.telo.geometrija} material={telo} castShadow receiveShadow frustumCulled={false} />
      <mesh geometry={delovi.rever.geometrija} material={materijali.rever} castShadow receiveShadow />
      <mesh geometry={delovi.kragna} material={materijali.kragna} castShadow receiveShadow />
      <mesh
        geometry={delovi.donjiDzep.geometrija}
        material={materijali.dzep}
        receiveShadow
        frustumCulled={false}
      />
      <mesh
        geometry={delovi.rukav.geometrija}
        material={materijali.rukav}
        castShadow
        receiveShadow
        frustumCulled={false}
      />
      <mesh geometry={delovi.traka} material={materijali.traka} castShadow receiveShadow />
    </>
  );
}
