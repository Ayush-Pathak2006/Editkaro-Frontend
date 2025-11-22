(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const heroImg = document.getElementById("heroImg");

  function setHeroImageForTheme(theme) {
    if (!heroImg) return;
    const lightSrc = heroImg.dataset.lightSrc;
    const darkSrc = heroImg.dataset.darkSrc;
    heroImg.src = theme === "dark" ? (darkSrc || lightSrc) : (lightSrc || darkSrc);
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("editkaro_theme", theme);
    if (themeIcon) themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
    setHeroImageForTheme(theme);
  }

  const saved = localStorage.getItem("editkaro_theme");
  if (saved === "dark" || saved === "light") {
    setTheme(saved);
  } else {
    const prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  if (window.matchMedia) {
    try {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          const savedLocal = localStorage.getItem("editkaro_theme");
          if (!savedLocal) {
            setTheme(e.matches ? "dark" : "light");
          }
        });
    } catch (err) {
    }
  }

  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", mainNav.classList.contains("open") ? "true" : "false");
    });
  }

  const filters = Array.from(document.querySelectorAll(".filter-btn"));
  const cards = Array.from(document.querySelectorAll("#gallery .card"));

  function applyFilter(filter) {
    filters.forEach((b) => {
      b.classList.toggle("active", b.dataset.filter === filter);
    });

    cards.forEach((card) => {
      const cats = (card.dataset.category || "").toLowerCase().split(/\s+/);
      if (filter === "all" || cats.includes(filter)) card.style.display = "";
      else card.style.display = "none";
    });

    setTimeout(() => {
      cards.forEach((c) => {
        if (c.style.display !== "none") c.classList.add("show");
      });
    }, 60);

    document.querySelectorAll(".chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.filter === filter);
    });
  }

  window.applyFilter = applyFilter;

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      if (f) applyFilter(f);
    });
  });

  applyFilter("all");

  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalClose = document.getElementById("modalClose");

  function openModalWithSrc(src) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modalImg.style.maxWidth = "min(90vw, 960px)";
    modalImg.style.maxHeight = "80vh";
    modalImg.style.width = "auto";
    modalImg.style.height = "auto";
    modalImg.style.objectFit = "contain";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const img = card.querySelector(".card-media img");
      if (!img) return;
      openModalWithSrc(img.src);
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", () => {
      if (!modal) return;
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (modalImg) {
        modalImg.style.maxWidth = "";
        modalImg.style.maxHeight = "";
        modalImg.style.width = "";
        modalImg.style.height = "";
        modalImg.style.objectFit = "";
      }
    });
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (modalImg) {
          modalImg.style.maxWidth = "";
          modalImg.style.maxHeight = "";
          modalImg.style.width = "";
          modalImg.style.height = "";
          modalImg.style.objectFit = "";
        }
      }
    });
  }

  const io = new IntersectionObserver(
    (entries) => entries.forEach((ent) => ent.isIntersecting && ent.target.classList.add("show")),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".fade-in").forEach((el) => io.observe(el));

  const startBtn = document.getElementById("startProjectBtn");
  const watchBtn = document.getElementById("watchVideoBtn");
  const contactBtn = document.getElementById("contactBtn");

  if (startBtn) startBtn.addEventListener("click", () => {
    const c = document.getElementById("contact");
    if (c) c.scrollIntoView({ behavior: "smooth" });
  });

  if (contactBtn) contactBtn.addEventListener("click", () => {
    const c = document.getElementById("contact");
    if (c) c.scrollIntoView({ behavior: "smooth" });
  });

  if (watchBtn) {
    watchBtn.addEventListener("click", () => {
      const hero = document.querySelector(".hero-img img");
      if (!hero) return;
      openModalWithSrc(hero.src);
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.name?.value || "Friend";
      const email = contactForm.email?.value || "";
      alert(`Thanks ${name}! We'll reach out to ${email} within 24 hours.`);
      contactForm.reset();
    });
  }

  (function wireMobileDropdowns() {
    const toggles = Array.from(document.querySelectorAll(".category-toggle"));
    const panels = Array.from(document.querySelectorAll(".mobile-category-panel"));

    function getPairedPanel(toggle, idx) {
      if (panels[idx]) return panels[idx];
      let el = toggle.nextElementSibling;
      while (el) {
        if (el.classList && el.classList.contains("mobile-category-panel")) return el;
        el = el.nextElementSibling;
      }
      return panels[0] || null;
    }

    toggles.forEach((t, i) => {
      const panel = getPairedPanel(t, i);
      if (!panel) return;

      t.setAttribute("aria-expanded", panel.classList.contains("open") ? "true" : "false");
      panel.setAttribute("aria-hidden", panel.classList.contains("open") ? "false" : "true");

      t.addEventListener("click", (ev) => {
        ev.stopPropagation();
        const isOpen = panel.classList.toggle("open");
        panel.setAttribute("aria-hidden", isOpen ? "false" : "true");
        t.setAttribute("aria-expanded", isOpen ? "true" : "false");

        if (isOpen) {
          const firstChip = panel.querySelector(".chip");
          if (firstChip) firstChip.focus();
        }
      });
    });

    document.addEventListener("click", (e) => {
      const clickedInside = panels.some((p) => p.contains(e.target)) || toggles.some((tg) => tg.contains(e.target));
      if (clickedInside) return;
      panels.forEach((p) => {
        if (p.classList.contains("open")) {
          p.classList.remove("open");
          p.setAttribute("aria-hidden", "true");
        }
      });
      toggles.forEach((tg) => tg.setAttribute("aria-expanded", "false"));
    });

    panels.forEach((panel) => {
      panel.addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if (!chip) return;
        const filter = chip.dataset.filter || "all";

        document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === chip));

        if (typeof window.applyFilter === "function") {
          window.applyFilter(filter);
        } else {
          applyFilter(filter);
        }

        panel.classList.remove("open");
        panel.setAttribute("aria-hidden", "true");

        toggles.forEach((tg, idx) => {
          const p = getPairedPanel(tg, idx);
          if (p === panel) tg.setAttribute("aria-expanded", "false");
        });
      });
    });

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.filter === f));
      });
    });
  })();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal && modal.classList.contains("open")) {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (modalImg) {
          modalImg.style.maxWidth = "";
          modalImg.style.maxHeight = "";
          modalImg.style.width = "";
          modalImg.style.height = "";
          modalImg.style.objectFit = "";
        }
      }
      document.querySelectorAll(".mobile-category-panel.open").forEach((p) => {
        p.classList.remove("open");
        p.setAttribute("aria-hidden", "true");
      });
      document.querySelectorAll(".category-toggle[aria-expanded='true']").forEach((t) => t.setAttribute("aria-expanded", "false"));
    }
  });
})();
