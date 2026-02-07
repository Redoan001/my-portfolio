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


// Start typing after page load
window.addEventListener("load", typeWriter);


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
