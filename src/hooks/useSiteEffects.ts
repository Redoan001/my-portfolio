import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';

type RevealVariant =
  | 'reveal-heading'
  | 'reveal-hero-copy'
  | 'reveal-portrait'
  | 'reveal-veil'
  | 'reveal-panel'
  | 'reveal-item'
  | 'reveal-media'
  | 'reveal-contact-left'
  | 'reveal-contact-right';

interface RevealTarget {
  element: HTMLElement;
  trigger: Element;
  variant: RevealVariant;
  delay: number;
}

const revealClasses = [
  'reveal',
  'reveal-heading',
  'reveal-hero-copy',
  'reveal-portrait',
  'reveal-veil',
  'reveal-panel',
  'reveal-item',
  'reveal-media',
  'reveal-contact-left',
  'reveal-contact-right',
  'in-view',
] as const;

/** Own the scroll choreography, hover, and focus animations inside the React tree. */
export function useSiteEffects(rootRef: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const rootElement = rootRef.current;
    if (!rootElement) return;
    const root: HTMLDivElement = rootElement;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hero = root.querySelector<HTMLElement>('.hero');
    const revealTargets: RevealTarget[] = [];

    function addReveal(
      element: Element | null,
      trigger: Element | null,
      variant: RevealVariant,
      delay = 0,
    ) {
      if (!(element instanceof HTMLElement) || !trigger) return;
      revealTargets.push({ element, trigger, variant, delay });
    }

    addReveal(hero?.querySelector('.hero-content') ?? null, hero, 'reveal-hero-copy');
    addReveal(hero?.querySelector('.hero-image') ?? null, hero, 'reveal-portrait', 90);

    const banner = root.querySelector('.logo-banner');
    addReveal(banner, banner, 'reveal-veil');

    const about = root.querySelector('#about-me');
    const aboutHeading = about?.querySelector('.section-header') ?? null;
    addReveal(aboutHeading, aboutHeading, 'reveal-heading');
    addReveal(about?.querySelector('.about-content') ?? null, aboutHeading, 'reveal-panel', 70);

    const services = root.querySelector('#services');
    const servicesHeading = services?.querySelector('.section-header') ?? null;
    addReveal(servicesHeading, servicesHeading, 'reveal-heading');
    services?.querySelectorAll('.expert-card').forEach((card, index) => {
      addReveal(card, servicesHeading, 'reveal-item', 55 + index * 55);
    });

    const portfolio = root.querySelector('#portfolio');
    const portfolioHeading = portfolio?.querySelector('.section-header') ?? null;
    addReveal(portfolioHeading, portfolioHeading, 'reveal-heading');
    portfolio?.querySelectorAll('.portfolio-category').forEach((category) => {
      const heading = category.querySelector('h3');
      addReveal(heading, heading, 'reveal-heading');
      addReveal(category.querySelector('.carousel-wrap'), heading, 'reveal-media', 70);
    });

    const explore = root.querySelector('#explore');
    const exploreHeading = explore?.querySelector('.section-header') ?? null;
    addReveal(exploreHeading, exploreHeading, 'reveal-heading');
    explore?.querySelectorAll('.explore-btn').forEach((button, index) => {
      addReveal(button, exploreHeading, 'reveal-item', 70 + index * 65);
    });

    const contact = root.querySelector('#contact-me');
    const contactHeading = contact?.querySelector('.contact-info h2') ?? null;
    addReveal(contact?.querySelector('.contact-info') ?? null, contactHeading, 'reveal-contact-left');
    addReveal(contact?.querySelector('.contact-form-container') ?? null, contactHeading, 'reveal-contact-right', 90);

    const originalState = revealTargets.map(({ element }) => ({
      element,
      classes: revealClasses.map((className) => element.classList.contains(className)),
      delay: element.style.getPropertyValue('--reveal-delay'),
    }));

    revealTargets.forEach(({ element, variant, delay }) => {
      element.classList.add('reveal', variant);
      element.style.setProperty('--reveal-delay', `${delay}ms`);
    });

    function configureMotion() {
      const cleanups: Array<() => void> = [];
      const revealElements = revealTargets.map(({ element }) => element);

      if (motionPreference.matches) {
        revealElements.forEach((element) => element.classList.add('in-view'));
        return () => {};
      }

      revealElements.forEach((element) => element.classList.remove('in-view'));

      let animationFrame = 0;
      const heroTargets = revealTargets.filter(({ trigger }) => trigger === hero);
      if (heroTargets.length) {
        animationFrame = window.requestAnimationFrame(() => {
          animationFrame = window.requestAnimationFrame(() => {
            heroTargets.forEach(({ element }) => element.classList.add('in-view'));
          });
        });
      }
      cleanups.push(() => window.cancelAnimationFrame(animationFrame));

      if ('IntersectionObserver' in window) {
        const targetsByTrigger = new Map<Element, HTMLElement[]>();
        revealTargets.forEach(({ element, trigger }) => {
          if (trigger === hero) return;
          const targets = targetsByTrigger.get(trigger) ?? [];
          targets.push(element);
          targetsByTrigger.set(trigger, targets);
        });

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              // Reveal skipped groups after fast anchor jumps as well as normal scrolling.
              if (!entry.isIntersecting && entry.boundingClientRect.top >= 0) return;
              targetsByTrigger.get(entry.target)?.forEach((element) => element.classList.add('in-view'));
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.14, rootMargin: '0px 0px -10% 0px' },
        );

        targetsByTrigger.forEach((_, trigger) => observer.observe(trigger));

        let scrollFrame = 0;
        const revealPassedTargets = () => {
          targetsByTrigger.forEach((targets, trigger) => {
            if (targets.every((element) => element.classList.contains('in-view'))) return;
            if (trigger.getBoundingClientRect().top >= window.innerHeight * 0.9) return;
            targets.forEach((element) => element.classList.add('in-view'));
            observer.unobserve(trigger);
          });
        };
        const handleScroll = () => {
          window.cancelAnimationFrame(scrollFrame);
          scrollFrame = window.requestAnimationFrame(revealPassedTargets);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        scrollFrame = window.requestAnimationFrame(revealPassedTargets);
        cleanups.push(() => {
          observer.disconnect();
          window.removeEventListener('scroll', handleScroll);
          window.cancelAnimationFrame(scrollFrame);
        });
      } else {
        revealElements.forEach((element) => element.classList.add('in-view'));
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
      originalState.forEach(({ element, classes, delay }) => {
        revealClasses.forEach((className, index) => element.classList.toggle(className, classes[index]));
        if (delay) element.style.setProperty('--reveal-delay', delay);
        else element.style.removeProperty('--reveal-delay');
      });
    };
  }, [rootRef]);
}
