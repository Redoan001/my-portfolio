import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

const CLICK_COLORS = ['#3bdf91', '#58a6ff', '#e3b341', '#f85149', '#bc8cff'];

type EffectStyle = CSSProperties & { '--tx'?: string; '--ty'?: string };

interface ClickEffect {
  id: number;
  className: 'click-ripple' | 'click-particle';
  duration: number;
  style: EffectStyle;
}

const randomColor = () => CLICK_COLORS[Math.floor(Math.random() * CLICK_COLORS.length)];

/** Render the original document-wide click bursts outside the app's layout. */
export function ClickEffects() {
  const [effects, setEffects] = useState<ClickEffect[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timers = new Set<number>();

    const clearTimers = () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };

    const handleClick = (event: MouseEvent) => {
      if (motionPreference.matches) return;

      const sharedStyle: EffectStyle = {
        position: 'fixed',
        left: event.clientX,
        top: event.clientY,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9998,
      };

      const burst: ClickEffect[] = [{
        id: nextId.current++,
        className: 'click-ripple',
        duration: 600,
        style: {
          ...sharedStyle,
          width: 0,
          height: 0,
          border: `2px solid ${randomColor()}`,
          animation: 'rippleExpand 0.6s ease-out forwards',
        },
      }];

      for (let index = 0; index < 20; index += 1) {
        const color = randomColor();
        const size = Math.random() * 6 + 3;
        const angle = Math.random() * 360;
        const distance = Math.random() * 40 + 20;
        const duration = Math.random() * 400 + 500;

        burst.push({
          id: nextId.current++,
          className: 'click-particle',
          duration,
          style: {
            ...sharedStyle,
            width: size,
            height: size,
            background: color,
            animation: `particleFly ${duration}ms ease-out forwards`,
            '--tx': `${Math.cos(angle * Math.PI / 180) * distance}px`,
            '--ty': `${Math.sin(angle * Math.PI / 180) * distance}px`,
          },
        });
      }

      setEffects((current) => [...current, ...burst]);
      burst.forEach((effect) => {
        const timer = window.setTimeout(() => {
          timers.delete(timer);
          setEffects((current) => current.filter((item) => item.id !== effect.id));
        }, effect.duration);
        timers.add(timer);
      });
    };

    const handleMotionPreference = () => {
      if (!motionPreference.matches) return;
      clearTimers();
      setEffects([]);
    };

    document.addEventListener('click', handleClick);
    motionPreference.addEventListener('change', handleMotionPreference);

    return () => {
      document.removeEventListener('click', handleClick);
      motionPreference.removeEventListener('change', handleMotionPreference);
      clearTimers();
    };
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {effects.map((effect) => (
        <div key={effect.id} className={effect.className} style={effect.style} aria-hidden="true" />
      ))}
    </>,
    document.body,
  );
}
