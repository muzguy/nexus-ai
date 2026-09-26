'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '@/context/theme-context';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  currentAlpha: number;
  phase: number;
  pulseSpeed: number;
  tint: 'primary' | 'cool' | 'ruby';
  depthTier: 'distant' | 'mid' | 'anchor';
}

export function AtmosphericBackground() {
  const { theme, isMounted } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const dimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Monitor prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Initialize particles with 3 spatial depth tiers
  const initParticles = useCallback((width: number, height: number, isDark: boolean) => {
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    // Density: ~34 on mobile, ~54 on tablet, ~82 on desktop
    const count = isMobile ? 34 : isTablet ? 54 : 82;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      const tint: 'primary' | 'cool' | 'ruby' =
        rand < 0.14 ? 'ruby' : rand < 0.46 ? 'cool' : 'primary';

      // 3 Depth Tiers: distant background (40%), midground (45%), anchor nodes (15%)
      const tierRand = Math.random();
      let depthTier: 'distant' | 'mid' | 'anchor';
      let radius: number;
      let baseAlpha: number;
      let speedScale: number;

      if (tierRand < 0.40) {
        depthTier = 'distant';
        radius = 0.65 + Math.random() * 0.35; // 0.65px - 1.0px
        baseAlpha = isDark
          ? 0.22 + Math.random() * 0.25 // 0.22 - 0.47
          : 0.20 + Math.random() * 0.22; // 0.20 - 0.42
        speedScale = 0.035;
      } else if (tierRand < 0.85) {
        depthTier = 'mid';
        radius = 1.1 + Math.random() * 0.55; // 1.1px - 1.65px
        baseAlpha = isDark
          ? 0.45 + Math.random() * 0.30 // 0.45 - 0.75
          : 0.38 + Math.random() * 0.28; // 0.38 - 0.66
        speedScale = 0.065;
      } else {
        depthTier = 'anchor';
        radius = 1.8 + Math.random() * 0.75; // 1.8px - 2.55px
        baseAlpha = isDark
          ? 0.72 + Math.random() * 0.25 // 0.72 - 0.97 (bright anchor node)
          : 0.62 + Math.random() * 0.28; // 0.62 - 0.90
        speedScale = 0.085;
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? speedScale * 0.75 : speedScale),
        vy: (Math.random() - 0.5) * (isMobile ? speedScale * 0.75 : speedScale),
        radius,
        baseAlpha,
        currentAlpha: baseAlpha,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.003 + Math.random() * 0.007,
        tint,
        depthTier,
      });
    }

    particlesRef.current = particles;
  }, []);

  // Setup canvas and run rendering loop
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const isDark = theme === 'dark';

    // Handle high DPI displays safely (capped at 2x)
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      dimensionsRef.current = { width, height };

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const expectedCount = isMobile ? 34 : isTablet ? 54 : 82;

      // Re-initialize particles if uninitialized or screen size class shifted
      if (particlesRef.current.length === 0 || Math.abs(particlesRef.current.length - expectedCount) > 6) {
        initParticles(width, height, isDark);
      } else {
        // Proportionately re-bound existing particles and update baseAlpha for active theme
        particlesRef.current.forEach((p) => {
          if (p.depthTier === 'distant') {
            p.baseAlpha = isDark ? 0.22 + Math.random() * 0.25 : 0.20 + Math.random() * 0.22;
          } else if (p.depthTier === 'mid') {
            p.baseAlpha = isDark ? 0.45 + Math.random() * 0.30 : 0.38 + Math.random() * 0.28;
          } else {
            p.baseAlpha = isDark ? 0.72 + Math.random() * 0.25 : 0.62 + Math.random() * 0.28;
          }
          p.currentAlpha = p.baseAlpha;
          if (p.x > width) p.x = Math.random() * width;
          if (p.y > height) p.y = Math.random() * height;
        });
      }
    };

    handleResize();

    let resizeTimeout: NodeJS.Timeout;
    const onWindowResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        handleResize();
        if (isReducedMotion) {
          drawFrame(ctx, isDark);
        }
      }, 100);
    };

    window.addEventListener('resize', onWindowResize);

    // Particle color lookup
    const getParticleColor = (tint: 'primary' | 'cool' | 'ruby', alpha: number) => {
      if (isDark) {
        switch (tint) {
          case 'ruby':
            return `rgba(251, 113, 133, ${alpha * 0.95})`;
          case 'cool':
            return `rgba(135, 185, 255, ${alpha})`;
          case 'primary':
          default:
            return `rgba(230, 240, 255, ${alpha})`;
        }
      } else {
        switch (tint) {
          case 'ruby':
            return `rgba(190, 24, 70, ${alpha * 0.88})`;
          case 'cool':
            return `rgba(35, 75, 130, ${alpha})`;
          case 'primary':
          default:
            return `rgba(50, 62, 82, ${alpha})`;
        }
      }
    };

    // Draw single frame (used for both animation and static reduced-motion)
    const drawFrame = (context: CanvasRenderingContext2D, dark: boolean) => {
      const { width, height } = dimensionsRef.current;
      if (width === 0 || height === 0) return;

      context.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const isMobile = width < 768;
      const maxDistance = isMobile ? 130 : 165;

      // 1. Constellation Geometry: Connect selected neighboring particles
      // Max 2 connections per particle to maintain balanced negative space
      const connectionCounts = new Uint8Array(particles.length);

      context.lineWidth = 0.8;

      for (let i = 0; i < particles.length; i++) {
        if (connectionCounts[i] >= 2) continue;
        if (particles[i].depthTier === 'distant') continue; // Only connect mid and anchor particles

        for (let j = i + 1; j < particles.length; j++) {
          if (connectionCounts[j] >= 2) continue;
          if (particles[j].depthTier === 'distant') continue;

          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            connectionCounts[i]++;
            connectionCounts[j]++;

            const distRatio = 1 - dist / maxDistance;
            const lineAlpha =
              distRatio *
              (dark ? 0.38 : 0.32) *
              Math.min(particles[i].currentAlpha, particles[j].currentAlpha);

            context.strokeStyle = dark
              ? `rgba(175, 205, 255, ${lineAlpha})`
              : `rgba(55, 80, 118, ${lineAlpha})`;

            context.beginPath();
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.stroke();
          }
        }
      }

      // 2. Draw Sparse Multi-Depth Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Breathing alpha oscillation
        p.currentAlpha = p.baseAlpha * (0.82 + 0.18 * Math.sin(p.phase));

        context.beginPath();
        context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        context.fillStyle = getParticleColor(p.tint, p.currentAlpha);
        context.fill();

        // Atmospheric halo aura for anchor nodes
        if (p.depthTier === 'anchor') {
          context.beginPath();
          context.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          context.fillStyle = getParticleColor(
            p.tint,
            p.currentAlpha * (dark ? 0.26 : 0.18)
          );
          context.fill();
        }

        // Motion update (only when reduced motion is NOT requested)
        if (!isReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          const buffer = 30;
          if (p.x < -buffer) p.x = width + buffer;
          else if (p.x > width + buffer) p.x = -buffer;
          if (p.y < -buffer) p.y = height + buffer;
          else if (p.y > height + buffer) p.y = -buffer;

          p.phase += p.pulseSpeed;
        }
      }
    };

    // Animation Loop
    const render = () => {
      drawFrame(ctx, isDark);
      if (!isReducedMotion) {
        animFrameId.current = requestAnimationFrame(render);
      }
    };

    // If reduced motion is active, render only once statically
    if (isReducedMotion) {
      drawFrame(ctx, isDark);
    } else {
      animFrameId.current = requestAnimationFrame(render);
    }

    // Visibility-aware execution: pause when tab is hidden to conserve CPU/battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameId.current) {
          cancelAnimationFrame(animFrameId.current);
          animFrameId.current = null;
        }
      } else {
        if (!isReducedMotion && !animFrameId.current) {
          animFrameId.current = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(resizeTimeout);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [theme, isReducedMotion, initParticles]);

  const isDark = !isMounted || theme === 'dark';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* ==================================================== */}
      {/* LAYER 0: DARK MODE ATMOSPHERE (Deep Obsidian Canvas + Indigo/Blue Zones) */}
      {/* ==================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundColor: '#070608',
          backgroundImage: `
            radial-gradient(ellipse 70% 55% at 10% 0%, rgba(30, 58, 128, 0.60) 0%, rgba(18, 32, 75, 0.35) 45%, transparent 75%),
            radial-gradient(ellipse 65% 50% at 35% 45%, rgba(24, 45, 95, 0.40) 0%, rgba(14, 25, 55, 0.20) 50%, transparent 75%),
            radial-gradient(ellipse 75% 65% at 90% 90%, rgba(28, 38, 78, 0.50) 0%, rgba(15, 22, 45, 0.25) 50%, transparent 80%),
            radial-gradient(ellipse 50% 35% at 85% 10%, rgba(190, 18, 60, 0.14) 0%, rgba(127, 29, 29, 0.06) 45%, transparent 70%),
            radial-gradient(circle 600px at 0% 100%, rgba(20, 30, 60, 0.35) 0%, transparent 70%)
          `,
        }}
      />

      {/* ==================================================== */}
      {/* LAYER 0: LIGHT MODE ATMOSPHERE (Technical Warm Ivory + Architectural Zones) */}
      {/* ==================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          !isDark ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundColor: '#F6F4EE',
          backgroundImage: `
            radial-gradient(ellipse 75% 60% at 12% 0%, rgba(185, 210, 240, 0.75) 0%, rgba(210, 228, 248, 0.40) 45%, transparent 75%),
            radial-gradient(ellipse 70% 60% at 75% 40%, rgba(235, 222, 202, 0.80) 0%, rgba(244, 236, 224, 0.45) 50%, transparent 80%),
            radial-gradient(ellipse 80% 70% at 90% 95%, rgba(228, 215, 195, 0.85) 0%, rgba(240, 232, 218, 0.40) 55%, transparent 80%),
            radial-gradient(ellipse 45% 30% at 85% 8%, rgba(225, 120, 145, 0.15) 0%, rgba(240, 180, 195, 0.05) 50%, transparent 70%),
            radial-gradient(circle 700px at 5% 95%, rgba(200, 218, 238, 0.55) 0%, transparent 70%)
          `,
        }}
      />

      {/* ==================================================== */}
      {/* LAYER 1: TACTILE FILM GRAIN / TECHNICAL PAPER TEXTURE */}
      {/* ==================================================== */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isDark
            ? 'opacity-[0.075] mix-blend-screen'
            : 'opacity-[0.085] mix-blend-multiply'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* ==================================================== */}
      {/* LAYER 2: SPARSE PARTICLES & CONSTELLATION GEOMETRY */}
      {/* ==================================================== */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}

