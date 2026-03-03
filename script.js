// -- Set dynamic year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Hover effect for portfolio items
document.querySelectorAll("[data-hover]").forEach(el => {
    el.addEventListener("mouseenter", () => {
        el.style.transform = "translateY(-20px)";
    });
    el.addEventListener("mouseleave", () => {
        el.style.transform = "translateY(0)";
    });
});


// -- Typewriter Effect for Name
const typewriterElement = document.getElementById("typewriter");
const typewriterText = "MD. REDOAN";

let charIndex = 0;
let isDeleting = false;

const typeSpeed = 400;      // typing speed
const deleteSpeed = 200;     // deleting speed
const pauseAfterType = 2000; // pause when fully typed
const pauseAfterDelete = 500; // pause when fully deleted

function typeLoop() {
  if (!typewriterElement) return;

  if (!isDeleting) {
    // typing
    typewriterElement.textContent = typewriterText.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === typewriterText.length) {
      // reached end, pause then start deleting
      isDeleting = true;
      setTimeout(typeLoop, pauseAfterType);
      return;
    }

    setTimeout(typeLoop, typeSpeed);
  } else {
    // deleting
    typewriterElement.textContent = typewriterText.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      // fully deleted, pause then type again
      isDeleting = false;
      setTimeout(typeLoop, pauseAfterDelete);
      return;
    }

    setTimeout(typeLoop, deleteSpeed);
  }
}

window.addEventListener("load", typeLoop);

// --- Scroll Reveal (Hero first, then sections on scroll) ---

(function initScrollReveal() {
    const hero = document.querySelector(".hero");
    // HERO: slide from left on entry
    if (hero) {
        hero.classList.add("reveal", "from-left");
        requestAnimationFrame(() => hero.classList.add("in-view"));
    }

    // Auto-pick reveal blocks in page order (includes portfolio reliably)
    const revealTargets = Array.from(
        document.querySelectorAll(".logo-banner, section")
        ).filter((el) => !el.classList.contains("hero"));

    // Alternate directions: right, left, right, left...
    revealTargets.forEach((el, i) => {
        el.classList.add("reveal", i % 2 === 0 ? "from-right" : "from-left");
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    observer.unobserve(entry.target);
                }
            });
        },
    {
        threshold: 0.12,
        rootMargin: "0px 0px -15% 0px",
    }
  );

  // Start observing after layout is stable (helps heavy iframe sections like portfolio)
  window.addEventListener("load", () => {
    revealTargets.forEach((el) => observer.observe(el));
  });
})();



// Form Handling Script
const form = document.getElementById("my-form");
const successMessage = document.getElementById("success-message");

async function handleSubmit(event) {
    event.preventDefault();
    const status = document.querySelector(".btn-submit");
    const data = new FormData(event.target);

    status.innerHTML = "Sending...";
    status.disabled = true;

    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            form.style.display = "none";
            successMessage.style.display = "block";
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    alert(data.errors.map(error => error.message).join(", "));
                } else {
                    alert("Oops! There was a problem submitting your form");
                }
            });
        }
    })
    .catch(() => {
        alert("Oops! There was a problem submitting your form");
    })
    .finally(() => {
        status.innerHTML = "Submit";
        status.disabled = false;
    });
}

form.addEventListener("submit", handleSubmit);

// Back to top button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('toggle');
});

// Close menu on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('toggle');
    });
});

// --- JS Responsive Breakpoints
(function responsiveClasses() {
  const body = document.body;

  function apply() {
    const w = window.innerWidth;
    body.classList.remove("is-mobile", "is-tablet", "is-desktop");
    if (w < 768) body.classList.add("is-mobile");
    else if (w < 1024) body.classList.add("is-tablet");
    else body.classList.add("is-desktop");
  }

  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(apply, 120);
  });

  window.addEventListener("load", apply);
  apply();
})();

// --- Portfolio Carousel (mobile) ---
(function initPortfolioCarousel() {
  const carousels = document.querySelectorAll(".grid-reels, .grid-ads, .grid-promo");
  if (!carousels.length) return;

  function wrapWithControls(track) {
    // Prevent double init
    if (track.closest(".carousel-wrap")) return;

    const wrap = document.createElement("div");
    wrap.className = "carousel-wrap";

    // Insert wrap before track and move track inside
    track.parentNode.insertBefore(wrap, track);
    wrap.appendChild(track);

    const prev = document.createElement("button");
    prev.className = "carousel-btn prev";
    prev.type = "button";
    prev.setAttribute("aria-label", "Previous");
    prev.textContent = "‹";

    const next = document.createElement("button");
    next.className = "carousel-btn next";
    next.type = "button";
    next.setAttribute("aria-label", "Next");
    next.textContent = "›";

    wrap.appendChild(prev);
    wrap.appendChild(next);

    const scrollByOne = (dir) => {
      // Find a reasonable step: first visible item width + gap
      const firstItem = track.querySelector(".portfolio-item");
      if (!firstItem) return;

      const itemRect = firstItem.getBoundingClientRect();
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || "0") || 0;

      const step = itemRect.width + gap;
      track.scrollBy({ left: dir * step, behavior: "smooth" });
    };

    prev.addEventListener("click", () => scrollByOne(-1));
    next.addEventListener("click", () => scrollByOne(1));
  }

  function applyCarouselMode() {
    const isMobile = document.body.classList.contains("is-mobile");

    carousels.forEach((track) => {
      if (isMobile) {
        wrapWithControls(track);
      }
      // On tablet/desktop we keep your existing grid layout.
      // (Controls auto-hidden via CSS)
    });
  }

  window.addEventListener("load", applyCarouselMode);
  window.addEventListener("resize", applyCarouselMode);
  applyCarouselMode();
})();

// CLICK RIPPLE + PARTICLE BURST ─────────────────────────────────────
// On every click, two effects fire simultaneously from the click point:
//    A ripple ring expands outward and fades — like a water drop
//    20 small particles explode outward in random directions and shrink away

document.addEventListener('click', e => {
  const x = e.clientX;
  const y = e.clientY;
  const CLICK_COLORS = ['#3bdf91', '#58a6ff', '#e3b341', '#f85149', '#bc8cff'];

  // ── Ripple ring ──────────────────────────────────────────────────────
  const rippleColor = CLICK_COLORS[Math.floor(Math.random() * CLICK_COLORS.length)];
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 0px;
    height: 0px;
    border-radius: 50%;
    border: 2px solid ${rippleColor};
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 9998;
    animation: rippleExpand 0.6s ease-out forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);

  // ── Particle burst ───────────────────────────────────────────────────
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    const color    = CLICK_COLORS[Math.floor(Math.random() * CLICK_COLORS.length)];
    const size     = Math.random() * 6+3;          // 3px – 9px
    const angle    = Math.random() * 360;             // random direction
    const distance = Math.random() * 40 + 20;        // 40px – 120px spread
    const tx       = Math.cos(angle * Math.PI / 180) * distance;
    const ty       = Math.sin(angle * Math.PI / 180) * distance;
    const duration = Math.random() * 400 + 500;      // 500ms – 900ms

    particle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9998;
      animation: particleFly ${duration}ms ease-out forwards;
      --tx: ${tx}px;
      --ty: ${ty}px;
    `;
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), duration);
  }
});

// ── Keyframes ─────────────────────────────────────────────────────────────
const clickEffectStyle = document.createElement('style');
clickEffectStyle.textContent = `
  @keyframes rippleExpand {
    to {
      width: 120px;
      height: 120px;
      opacity: 0;
    }
  }
  @keyframes particleFly {
    to {
      transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty)));
      opacity: 0;
      width: 0px;
      height: 0px;
    }
  }
`;
document.head.appendChild(clickEffectStyle);