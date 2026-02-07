// Set dynamic year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Typewriter Effect for Name
const typewriterElement = document.getElementById("typewriter");
const typewriterText = "MD. REDOAN";

let charIndex = 0;
let isDeleting = false;

const typeSpeed = 400;      // typing speed
const deleteSpeed = 200;     // deleting speed
const pauseAfterType = 800; // pause when fully typed
const pauseAfterDelete = 400; // pause when fully deleted

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
        document.querySelectorAll(".logo-banner, section, footer")
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
