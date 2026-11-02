const STORE_LINKS = {
  quran: "",
  github: "",
  instagram: "",
  linkedin: ""
};

const header = document.getElementById("siteHeader");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const themeToggle = document.getElementById("themeToggle");
const toTop = document.getElementById("toTop");
const toast = document.getElementById("toast");
const yearEl = document.getElementById("year");
const themeMeta = document.querySelector('meta[name="theme-color"]');

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  try { localStorage.setItem("kodnest-theme", mode); } catch (e) {}
  if (themeMeta) themeMeta.setAttribute("content", mode === "dark" ? "#05070f" : "#f4f6fc");
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

let toastTimer = null;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

document.querySelectorAll("[data-store]").forEach((link) => {
  const key = link.getAttribute("data-store");
  const name = link.getAttribute("data-store-name") || "this page";
  if (STORE_LINKS[key]) {
    link.setAttribute("href", STORE_LINKS[key]);
    link.removeAttribute("aria-disabled");
  } else {
    link.setAttribute("aria-disabled", "true");
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showToast(`${name} link coming soon — reach us at apps.kodnest@gmail.com`);
    });
  }
});

function onScrollHeader() {
  header.classList.toggle("scrolled", window.scrollY > 14);
  toTop.classList.toggle("show", window.scrollY > 620);
}
window.addEventListener("scroll", onScrollHeader, { passive: true });
onScrollHeader();

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
});

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});

navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  });
}, { rootMargin: "-45% 0px -50% 0px" });

document.querySelectorAll("main section[id]").forEach((sec) => sectionObserver.observe(sec));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    counterObserver.unobserve(el);
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const duration = 1400;
    const start = performance.now();
    if (prefersReduced) { el.textContent = target; return; }
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.6 });

document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
if (finePointer && !prefersReduced) {
  const heroVisual = document.querySelector(".hero-visual");
  const phoneEx = document.getElementById("phoneEx");
  const phoneQur = document.getElementById("phoneQur");

  if (heroVisual && phoneEx && phoneQur) {
    heroVisual.addEventListener("mouseenter", () => {
      phoneEx.style.transition = "transform .3s ease";
      phoneQur.style.transition = "transform .3s ease";
    });
    heroVisual.addEventListener("mousemove", (e) => {
      const r = heroVisual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      phoneEx.style.transform = `rotate(-7deg) translate3d(${x * 12}px, ${y * 14}px, 0)`;
      phoneQur.style.transform = `rotate(9deg) translate3d(${x * -16}px, ${y * -12}px, 0)`;
    });
    heroVisual.addEventListener("mouseleave", () => {
      phoneEx.style.transform = "";
      phoneQur.style.transform = "";
      setTimeout(() => {
        phoneEx.style.transition = "";
        phoneQur.style.transition = "";
      }, 350);
    });
  }

  document.querySelectorAll(".why-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

if (yearEl) yearEl.textContent = new Date().getFullYear();