"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { MoleculeBackground } from "@/components/MoleculeBackground";

function lcgRandom(seed: number) {
  let state = seed;
  return function () {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ParticleBackground(props: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);

  const sphere = useMemo(() => {
    const nextRand = lcgRandom(42);
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const r = 1.5 * Math.cbrt(nextRand());
      const theta = nextRand() * 2 * Math.PI;
      const phi = Math.acos(2 * nextRand() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#0e7490" size={0.005} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

export function HeroSection() {
  const { t, language } = useLanguage();
  const { scrollY } = useScroll();

  const scale = useTransform(scrollY, [0, 200], [1, 0.85]);
  const scrollOpacity = useTransform(scrollY, [0, 180], [1, 0]);
  const translateY = useTransform(scrollY, [0, 200], [0, -30]);
  const glowOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    const scrollTimes = [50, 100, 200, 300, 500, 1000];
    const timers = scrollTimes.map(delay => setTimeout(() => window.scrollTo(0, 0), delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const titleLines = t.hero.title.split("\n");

  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-background">
      {/* Particle sphere */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ParticleBackground />
        </Canvas>
      </div>

      {/* Peptide molecule network */}
      <div className="absolute inset-0 z-0 text-primary molecule-bg-slow pointer-events-none">
        <MoleculeBackground />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/20 via-background/50 to-background pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,oklch(0.50_0.16_192/8%),transparent)] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">

        {/* Standalone Brand Symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 relative flex items-center justify-center pointer-events-none"
        >
          <motion.div
            style={{ scale, opacity: scrollOpacity, y: translateY }}
            className="relative flex items-center justify-center pointer-events-none"
          >
            {/* Elegant soft glowing halo behind the symbol */}
            <motion.div 
              style={{ opacity: glowOpacity }}
              className="absolute w-48 h-48 md:w-64 md:h-64 bg-[radial-gradient(circle,oklch(0.50_0.16_192/12%)_0%,transparent_70%)] rounded-full blur-xl -translate-y-2 pointer-events-none" 
            />
            
            {/* Glassmorphic backplate for the symbol to integrate it naturally */}
            <div className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full bg-white/5 border border-white/10 backdrop-blur-[2px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_30px_rgba(0,0,0,0.02)] pointer-events-none" />

            {/* C Symbol Wrapper */}
            <div className="relative w-28 md:w-36 aspect-[435/342] transition-transform duration-500 hover:scale-105 pointer-events-auto cursor-pointer filter drop-shadow-[0_12px_24px_oklch(0.50_0.16_192/16%)]">
              <Image
                src="/cynova-c-symbol.png"
                alt="CYNAPEPT Brand Symbol"
                fill
                className="object-contain"
                sizes="(max-w-768px) 112px, 144px"
                priority
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm tracking-widest uppercase">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary mr-2 animate-pulse" />
            {t.hero.badge}
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className={language === "ru"
            ? "text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 leading-tight flex flex-col items-center justify-center min-h-[130px] md:min-h-[195px] lg:min-h-[260px]"
            : "text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-tight flex flex-col items-center justify-center min-h-[130px] md:min-h-[195px] lg:min-h-[260px]"}
        >
          {titleLines.map((line, i) => (
            <span key={i} className="block">
              {i === 0 ? (
                <span className="text-foreground">{line}</span>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-600 to-blue-600">{line}</span>
              )}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-base md:text-lg text-muted-foreground max-w-xl mb-10 font-light leading-relaxed"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            render={<Link href="#portfolio" onClick={(e) => handleScroll(e, "portfolio")} />}
            nativeButton={false}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base shadow-[0_4px_20px_oklch(0.50_0.16_192/30%)] pointer-events-auto"
          >
            {t.hero.exploreBtn}
          </Button>
          <Button
            render={<Link href="#contact" onClick={(e) => handleScroll(e, "contact")} />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base border-primary/30 hover:bg-primary/10 hover:border-primary/60 backdrop-blur-sm pointer-events-auto text-foreground"
          >
            {t.hero.contactBtn}
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce"
      >
        <ChevronDown className="h-6 w-6 text-primary/40" />
      </motion.div>
    </section>
  );
}
