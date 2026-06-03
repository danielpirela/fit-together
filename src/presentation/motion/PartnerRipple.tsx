/**
 * PartnerRipple — Concentric expanding ring animation for partner sync events.
 * Renders a fixed-position overlay with 3 purple rings that expand and fade.
 * On reduced-motion, renders a single brief opacity flash instead.
 */

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '@/presentation/motion/gsap';
import { useReducedMotion } from '@/presentation/motion/useReducedMotion';

interface PartnerRippleProps {
  /** When true, the animation fires */
  trigger: boolean;
  /** Ring color — defaults to Obsidian Pulse accent (#A855F7) */
  color?: string;
  /** Called when animation completes */
  onComplete?: () => void;
}

/** ParticleBurst — inline radial burst for celebration moments */
function ParticleBurst({
  color = '#A855F7',
  onComplete,
}: {
  color?: string;
  onComplete?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    if (!show || !ref.current) return;

    if (reducedMotion) {
      const el = ref.current;
      gsap.set(el, { opacity: 1 });
      gsap.to(el, { opacity: 0, duration: 0.15, onComplete: () => { setShow(false); onComplete?.(); } });
      return;
    }

    const particles = ref.current.querySelectorAll<HTMLDivElement>('.particle');
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => { setShow(false); onComplete?.(); } });
      particles.forEach((p, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const distance = 40 + Math.random() * 30;
        tl.set(p, { opacity: 1, scale: 1, x: 0, y: 0 }, 0);
        tl.to(p, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0.4,
          duration: 0.4,
          ease: 'quart.out',
        }, 0);
      });
    }, ref);

    return () => ctx.revert();
  }, [show, reducedMotion, onComplete]);

  if (!show) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="particle absolute w-2 h-2 rounded-full"
          style={{ background: color }}
        />
      ))}
    </div>
  );
}

export function PartnerRipple({ trigger, color = '#A855F7', onComplete }: PartnerRippleProps) {
  const reducedMotion = useReducedMotion();
  const [show, setShow] = useState(false);
  const ringsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    if (!trigger || !show) return;

    if (reducedMotion) {
      // Brief flash for reduced-motion users
      const ctx = gsap.context();
      ringsRef.current.forEach((ring) => {
        if (!ring) return;
        gsap.set(ring, { opacity: 0.8 });
        gsap.to(ring, { opacity: 0, duration: 0.15, ease: 'none' });
      });
      const timer = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 150);
      return () => {
        ctx.revert();
        clearTimeout(timer);
      };
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setShow(false);
          onComplete?.();
        },
      });

      ringsRef.current.forEach((ring, i) => {
        if (!ring) return;
        gsap.set(ring, { scale: 0.5, opacity: 0 });
        tl.to(
          ring,
          { scale: 1, opacity: 0.6, duration: 0.4, ease: 'quart.out' },
          i * 0.2
        );
        tl.to(
          ring,
          { scale: 2, opacity: 0, duration: 0.8, ease: 'quart.out' },
          i * 0.2 + 0.4
        );
      });
    });

    return () => ctx.revert();
  }, [trigger, show, reducedMotion, onComplete]);

  // Reset show when trigger becomes true
  useLayoutEffect(() => {
    if (trigger) setShow(true);
  }, [trigger]);

  if (!show) return null;

  return (
    <>
      {/* Rings */}
      <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) ringsRef.current[i] = el;
            }}
            className="absolute rounded-full border-2"
            style={{
              width: 200,
              height: 200,
              borderColor: color,
              background: 'transparent',
              transformOrigin: 'center',
            }}
          />
        ))}
      </div>
      {/* Particle burst overlay */}
      <ParticleBurst color={color} />
    </>
  );
}