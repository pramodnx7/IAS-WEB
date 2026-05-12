const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelectorAll(".nav-links a");
const toast = document.querySelector("[data-toast]");
const pageLoader = document.querySelector("#pageLoader");

// Hide loader when page is fully loaded
if (pageLoader) {
  window.addEventListener("load", () => {
    pageLoader.classList.add("hidden");
  });
  
  // Also hide after a minimum time to ensure smooth UX
  setTimeout(() => {
    if (pageLoader && !pageLoader.classList.contains("hidden")) {
      pageLoader.classList.add("hidden");
    }
  }, 5000);
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  const href = link.getAttribute("href");
  const page = body.dataset.page;
  if (href && page && href.includes(page)) {
    link.classList.add("active");
  }
  if (page === "home" && href === "index.html") {
    link.classList.add("active");
  }
  link.addEventListener("click", () => body.classList.remove("menu-open"));
});

function animateCounters(element) {
  const counters = element.querySelectorAll("[data-count]");
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-count"), 10);
    const suffix = counter.getAttribute("data-suffix") || "";
    const duration = 1500;
    const start = Date.now();
    
    function updateCounter() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      counter.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + suffix;
      }
    }
    
    updateCounter();
  });
}

const revealEls = document.querySelectorAll(".reveal, .card, .section-header, .cta");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          animateCounters(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
} else {
  revealEls.forEach((el) => {
    el.classList.add("visible");
    animateCounters(el);
  });
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3200);
}

document.querySelectorAll("form[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.reset();
    showToast("Thanks! Your message has been captured for the demo website.");
  });
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((btn) => btn.classList.remove("btn-primary"));
    button.classList.add("btn-primary");
    document.querySelectorAll("[data-event-year]").forEach((card) => {
      const visible = filter === "all" || card.dataset.eventYear === filter;
      card.style.display = visible ? "" : "none";
    });
  });
});

const mentorForm = document.querySelector("[data-mentor-form]");
if (mentorForm) {
  const steps = Array.from(mentorForm.querySelectorAll(".form-step"));
  const dots = Array.from(document.querySelectorAll("[data-form-dot]"));
  let currentStep = 0;

  const renderStep = () => {
    steps.forEach((step, index) => step.classList.toggle("active", index === currentStep));
    dots.forEach((dot, index) => dot.classList.toggle("active", index <= currentStep));
  };

  mentorForm.querySelectorAll("[data-next-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const fields = Array.from(steps[currentStep].querySelectorAll("input, select, textarea"));
      const invalid = fields.find((field) => !field.checkValidity());
      if (invalid) {
        invalid.reportValidity();
        return;
      }
      currentStep = Math.min(currentStep + 1, steps.length - 1);
      renderStep();
    });
  });

  mentorForm.querySelectorAll("[data-prev-step]").forEach((button) => {
    button.addEventListener("click", () => {
      currentStep = Math.max(currentStep - 1, 0);
      renderStep();
    });
  });

  mentorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!mentorForm.checkValidity()) {
      mentorForm.reportValidity();
      return;
    }
    mentorForm.reset();
    currentStep = 0;
    renderStep();
    showToast("Mentor registration demo submitted successfully.");
  });

  renderStep();
}
