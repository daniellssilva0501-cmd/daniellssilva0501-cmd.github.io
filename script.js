document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const navbar = document.querySelector("#navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector("#nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  // Navbar: indica scroll e controla a abertura do menu em dispositivos móveis.
  const updateNavbar = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    menuToggle.innerHTML = `<i data-lucide="${isOpen ? "x" : "menu"}"></i>`;
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      menuToggle.innerHTML = '<i data-lucide="menu"></i>';
      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  });

  // Realça o link da secção atualmente visível.
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55%", threshold: 0 });

  sections.forEach((section) => sectionObserver.observe(section));

  // Anima elementos ao entrarem no ecrã.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  // Copia o email e apresenta feedback durante dois segundos.
  const copyEmailButton = document.querySelector("#copy-email");
  if (copyEmailButton) {
    copyEmailButton.addEventListener("click", async () => {
      const email = copyEmailButton.dataset.email;
      const label = copyEmailButton.querySelector("span");
      const icon = copyEmailButton.querySelector("svg");

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const temporaryInput = document.createElement("textarea");
          temporaryInput.value = email;
          temporaryInput.setAttribute("readonly", "");
          temporaryInput.style.position = "absolute";
          temporaryInput.style.left = "-9999px";
          document.body.appendChild(temporaryInput);
          temporaryInput.select();
          const copied = document.execCommand("copy");
          temporaryInput.remove();

          if (!copied) {
            throw new Error("O navegador não conseguiu copiar o email.");
          }
        }

        label.textContent = "Email copiado!";
        copyEmailButton.classList.add("copied");
        copyEmailButton.setAttribute("aria-live", "polite");

        if (icon) {
          icon.outerHTML = '<i data-lucide="check"></i>';
          if (window.lucide) {
            window.lucide.createIcons();
          }
        }

        window.setTimeout(() => {
          label.textContent = "Copiar Email";
          copyEmailButton.classList.remove("copied");
          copyEmailButton.removeAttribute("aria-live");
          const checkIcon = copyEmailButton.querySelector("svg");
          if (checkIcon) {
            checkIcon.outerHTML = '<i data-lucide="copy"></i>';
            if (window.lucide) {
              window.lucide.createIcons();
            }
          }
        }, 2000);
      } catch (error) {
        label.textContent = "Não foi possível copiar";
        copyEmailButton.setAttribute("aria-label", "Não foi possível copiar. Email: " + email);
        window.setTimeout(() => {
          label.textContent = "Copiar Email";
          copyEmailButton.removeAttribute("aria-label");
        }, 2000);
      }
    });
  }
});
