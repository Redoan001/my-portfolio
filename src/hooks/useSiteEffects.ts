import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';

/** Own the original reveal, hover, and focus animations inside the React tree. */
export function useSiteEffects(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const rootElement = rootRef.current;
    if (!rootElement) return;
    const root: HTMLDivElement = rootElement;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hero = root.querySelector<HTMLElement>('.hero');
    const sections = Array.from(root.querySelectorAll<HTMLElement>('.logo-banner, section'));
    const revealTargets = hero ? [hero, ...sections] : sections;
    const revealClasses = ['reveal', 'from-left', 'from-right', 'in-view'] as const;
    const originalClasses = revealTargets.map((element) => ({
      element,
      classes: revealClasses.map((className) => element.classList.contains(className)),
    }));

    hero?.classList.add('reveal', 'from-left');
    sections.forEach((element, index) => {
      element.classList.add('reveal', index % 2 === 0 ? 'from-right' : 'from-left');
    });

    function configureMotion() {
      const cleanups: Array<() => void> = [];

      if (motionPreference.matches) {
        revealTargets.forEach((element) => element.classList.add('in-view'));
        return () => {};
      }

      let animationFrame = 0;
      if (hero && !hero.classList.contains('in-view')) {
        animationFrame = window.requestAnimationFrame(() => {
          animationFrame = window.requestAnimationFrame(() => hero.classList.add('in-view'));
        });
      }
      cleanups.push(() => window.cancelAnimationFrame(animationFrame));

      if ('IntersectionObserver' in window) {
        // A heading remains observable even when a section is many viewports tall.
        const revealOwners = new Map<Element, HTMLElement>();
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              revealOwners.get(entry.target)?.classList.add('in-view');
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.12, rootMargin: '0px 0px -15% 0px' },
        );

        sections.forEach((section) => {
          if (section.classList.contains('in-view')) return;
          const trigger = section.querySelector('.section-header, .contact-info h2') ?? section;
          revealOwners.set(trigger, section);
          observer.observe(trigger);
        });
        cleanups.push(() => observer.disconnect());
      } else {
        sections.forEach((section) => section.classList.add('in-view'));
      }

      const context = gsap.context(() => {}, root);

      function listen(element: HTMLElement, type: string, handler: () => void) {
        element.addEventListener(type, handler);
        cleanups.push(() => element.removeEventListener(type, handler));
      }

      function animate(element: HTMLElement, animation: () => void) {
        // Event callbacks run after setup, so register them with the same context.
        context.add(() => {
          gsap.killTweensOf(element);
          animation();
        });
      }

      root.querySelectorAll<HTMLElement>('.btn-hire, .btn-submit').forEach((button) => {
        listen(button, 'mouseenter', () => {
          animate(button, () => {
            gsap.timeline()
              .to(button, { duration: 0.3, scale: 1.08, ease: 'back.out(1.5)' }, 0)
              .to(button, {
                duration: 0.3,
                boxShadow: '0 0 30px rgba(255, 76, 49, 0.8), 0 0 60px rgba(255, 76, 49, 0.4)',
                filter: 'brightness(1.15)',
                textShadow: '0 0 15px rgba(255, 76, 49, 0.8)',
                ease: 'power2.out',
              }, 0);
          });
        });
        listen(button, 'mouseleave', () => {
          animate(button, () => {
            gsap.to(button, {
              duration: 0.25,
              scale: 1,
              boxShadow: '0 0 0px rgba(255, 76, 49, 0)',
              filter: 'brightness(1)',
              textShadow: '0 0 0px rgba(255, 76, 49, 0)',
              ease: 'power2.out',
            });
          });
        });
      });

      root.querySelectorAll<HTMLElement>('.form-group input, .form-group textarea').forEach((input) => {
        listen(input, 'focus', () => {
          animate(input, () => {
            gsap.to(input, {
              duration: 0.3,
              borderColor: 'rgba(255, 76, 49, 1)',
              boxShadow: '0 0 20px rgba(255, 76, 49, 0.6), inset 0 0 15px rgba(255, 76, 49, 0.1)',
              background: 'rgba(255, 76, 49, 0.02)',
              ease: 'power2.out',
            });
          });
        });
        listen(input, 'blur', () => {
          animate(input, () => {
            gsap.to(input, {
              duration: 0.25,
              borderColor: 'rgba(255, 255, 255, 0.2)',
              boxShadow: '0 0 0px rgba(255, 76, 49, 0)',
              background: 'rgba(255, 255, 255, 0.03)',
              ease: 'power2.out',
            });
          });
        });
      });

      root.querySelectorAll<HTMLElement>('.expert-card').forEach((card) => {
        listen(card, 'mouseenter', () => {
          animate(card, () => {
            gsap.to(card, {
              duration: 0.3,
              y: -10,
              boxShadow: '0 20px 50px rgba(255, 76, 49, 0.5)',
              borderColor: 'rgba(255, 76, 49, 0.8)',
              ease: 'power2.out',
            });
          });
        });
        listen(card, 'mouseleave', () => {
          animate(card, () => {
            gsap.to(card, {
              duration: 0.3,
              y: 0,
              boxShadow: 'none',
              borderColor: 'whitesmoke',
              ease: 'power2.out',
            });
          });
        });
      });

      return () => {
        cleanups.forEach((cleanup) => cleanup());
        context.revert();
      };
    }

    let cleanUpMotion = configureMotion();
    const handleMotionPreference = () => {
      cleanUpMotion();
      cleanUpMotion = configureMotion();
    };
    motionPreference.addEventListener('change', handleMotionPreference);

    return () => {
      motionPreference.removeEventListener('change', handleMotionPreference);
      cleanUpMotion();
      originalClasses.forEach(({ element, classes }) => {
        revealClasses.forEach((className, index) => element.classList.toggle(className, classes[index]));
      });
    };
  }, [rootRef]);
}
