// JAYSON & ZENIA — WEDDING WEBSITE
// Vanilla JavaScript: navigation, slideshow, story, countdown, RSVP and FAQ.
document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const motion = () => reducedMotion.matches ? "auto" : "smooth";

  // Floating, slide-in navigation (shared by phones, tablets and desktops).
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  const monogram = document.getElementById("navMonogram");
  const toggle = document.getElementById("menuToggle");
  const drawer = document.getElementById("navDrawer");
  const backdrop = document.getElementById("navBackdrop");
  const menuLinks = [...drawer.querySelectorAll("a")];
  let menuOpen = false;

  function updateHeader() {
    const onHero = hero.getBoundingClientRect().bottom > 90;
    header.classList.toggle("is-scrolled", !onHero);
    const source = (onHero || menuOpen)
      ? "./images/monowhite.png"
      : "./images/monoblack.png";
    if (monogram.getAttribute("src") !== source) monogram.src = source;
  }

  function setMenu(open, restoreFocus = true) {
    menuOpen = open;
    header.classList.toggle("menu-is-open", open);
    document.body.classList.toggle("menu-open", open);
    drawer.inert = !open;
    drawer.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    updateHeader();
    if (open) requestAnimationFrame(() => menuLinks[0]?.focus());
    else if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener("click", () => setMenu(!menuOpen));
  backdrop.addEventListener("click", () => setMenu(false));
  menuLinks.forEach((link) => link.addEventListener("click", () => {
    setMenu(false, false);
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }));
  document.addEventListener("keydown", (event) => {
    if (!menuOpen) return;
    if (event.key === "Escape") { event.preventDefault(); setMenu(false); return; }
    if (event.key !== "Tab") return;
    const focusable = [toggle, ...menuLinks];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // Scroll-fade: only activate when supported, so content never stays hidden.
  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      ".section-intro, .story-image, .story-copy, .venue-card, " +
      ".attire-card, .palette-block, .attire-rules, .party-photo-card, " +
      ".rsvp-copy, .faq-intro, .faq-list"
    );
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });
    revealTargets.forEach((element) => element.classList.add("reveal"));
    document.documentElement.classList.add("js-motion");
    revealTargets.forEach((element) => observer.observe(element));
  }

  // Countdown is fixed to March 6, 2027 at midnight Philippine time.
  const weddingDate = new Date("2027-03-06T00:00:00+08:00").getTime();
  const parts = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };
  const countdownMessage = document.getElementById("countdownMessage");
  function updateCountdown() {
    const remaining = Math.max(0, weddingDate - Date.now());
    const day = Math.floor(remaining / 86400000);
    const hour = Math.floor((remaining / 3600000) % 24);
    const minute = Math.floor((remaining / 60000) % 60);
    const second = Math.floor((remaining / 1000) % 60);
    parts.days.textContent = String(day).padStart(3, "0");
    parts.hours.textContent = String(hour).padStart(2, "0");
    parts.minutes.textContent = String(minute).padStart(2, "0");
    parts.seconds.textContent = String(second).padStart(2, "0");
    if (!remaining) {
      countdownMessage.textContent = "Today is the day! Let the celebration begin.";
      return true;
    }
    return false;
  }
  if (!updateCountdown()) {
    const timer = setInterval(() => { if (updateCountdown()) clearInterval(timer); }, 1000);
  }

  // Subtle falling petals; fewer elements for smoother mobile performance.
  const floralLayer = document.querySelector(".countdown-florals");
  if (floralLayer && !reducedMotion.matches) {
    for (let i = 0; i < 20; i++) {
      const petal = document.createElement("span");
      petal.className = "countdown-petal";
      petal.style.setProperty("--petal-left", `${(i * 37.7) % 100}%`);
      petal.style.setProperty("--petal-delay", `${-(i % 9) * 1.8}s`);
      petal.style.setProperty("--petal-duration", `${12 + (i % 5) * 2}s`);
      petal.style.setProperty("--petal-drift", `${(i % 2 ? 1 : -1) * (20 + (i % 5) * 16)}px`);
      floralLayer.appendChild(petal);
    }
  }

  // Fading, auto-advancing gallery. Replace photo URLs here with your own files.
  const storyPhotos = [
    { src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=85", alt: "A couple sharing a romantic moment" },
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85", alt: "Romantic wedding celebration details" },
    { src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85", alt: "A couple celebrating their love" },
    { src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85", alt: "A romantic outdoor wedding moment" }
  ];
  const gallery = document.querySelector(".story-image");
  const slides = [document.getElementById("storySlideA"), document.getElementById("storySlideB")];
  const counter = document.getElementById("storyPhotoCounter");
  let galleryIndex = 0;
  let activeSlide = 0;
  let changing = false;
  let galleryVisible = false;
  let galleryTimer;
  let pausedByHover = false;

  function stopGallery() { clearInterval(galleryTimer); galleryTimer = undefined; }
  function startGallery() {
    stopGallery();
    if (galleryVisible && !pausedByHover && !reducedMotion.matches && !document.hidden) {
      galleryTimer = setInterval(() => showPhoto(galleryIndex + 1), 4800);
    }
  }
  function showPhoto(index) {
    if (changing) return;
    const nextIndex = (index + storyPhotos.length) % storyPhotos.length;
    if (nextIndex === galleryIndex) return;
    changing = true;
    const photo = storyPhotos[nextIndex];
    const incoming = slides[1 - activeSlide];
    const outgoing = slides[activeSlide];
    const preload = new Image();
    preload.onload = () => {
      incoming.src = photo.src;
      incoming.alt = photo.alt;
      requestAnimationFrame(() => {
        incoming.classList.add("is-active");
        outgoing.classList.remove("is-active");
        galleryIndex = nextIndex;
        activeSlide = 1 - activeSlide;
        counter.textContent = `${String(galleryIndex + 1).padStart(2, "0")} / ${String(storyPhotos.length).padStart(2, "0")}`;
        setTimeout(() => { changing = false; }, reducedMotion.matches ? 0 : 760);
      });
    };
    preload.onerror = () => { changing = false; };
    preload.src = photo.src;
  }
  document.getElementById("previousStoryPhoto").addEventListener("click", () => {
    showPhoto(galleryIndex - 1); startGallery();
  });
  document.getElementById("nextStoryPhoto").addEventListener("click", () => {
    showPhoto(galleryIndex + 1); startGallery();
  });
  if ("IntersectionObserver" in window) {
    const galleryObserver = new IntersectionObserver(([entry]) => {
      galleryVisible = entry.isIntersecting;
      startGallery();
    }, { threshold: .15 });
    galleryObserver.observe(gallery);
  } else { galleryVisible = true; startGallery(); }
  if (window.matchMedia("(hover: hover)").matches) {
    gallery.addEventListener("mouseenter", () => { pausedByHover = true; stopGallery(); });
    gallery.addEventListener("mouseleave", () => { pausedByHover = false; startGallery(); });
  }
  document.addEventListener("visibilitychange", startGallery);

  // Faster typewriter: reveal groups of characters instead of one per timer.
  const dialog = document.getElementById("storyDialog");
  const fullStory = dialog.querySelector(".full-story");
  const storyParagraphs = [...fullStory.querySelectorAll("p")];
  const originals = storyParagraphs.map((el) => ({
    html: el.innerHTML,
    text: el.innerText.trim().replace(/[ \t]+/g, " ")
  }));
  let typingTimer;
  function stopTypewriter() {
    clearTimeout(typingTimer);
    storyParagraphs.forEach((el, i) => {
      el.innerHTML = originals[i].html;
      el.classList.remove("is-typing");
      el.removeAttribute("aria-label");
    });
  }
  function playTypewriter() {
    stopTypewriter();
    if (reducedMotion.matches) return;
    storyParagraphs.forEach((el, i) => {
      el.textContent = "";
      el.setAttribute("aria-label", originals[i].text);
    });
    let paragraphIndex = 0;
    let letters = 0;
    function tick() {
      if (!dialog.open || paragraphIndex >= storyParagraphs.length) return;
      const el = storyParagraphs[paragraphIndex];
      const text = originals[paragraphIndex].text;
      el.classList.add("is-typing");
      letters = Math.min(text.length, letters + 18);
      el.textContent = text.slice(0, letters);
      if (letters >= text.length) {
        el.classList.remove("is-typing");
        paragraphIndex++;
        letters = 0;
        if (paragraphIndex >= storyParagraphs.length) return;
        typingTimer = setTimeout(tick, 85);
      } else {
        typingTimer = setTimeout(tick, 13);
      }
    }
    tick();
  }
  document.getElementById("openStory").addEventListener("click", () => {
    dialog.showModal();
    playTypewriter();
  });
  document.getElementById("closeStory").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", stopTypewriter);

  // Canva wedding-party panels display their full aspect ratios once uploaded.
  document.querySelectorAll(".party-photo-frame").forEach((frame) => {
    const image = frame.querySelector("img");
    const show = () => { if (image.naturalWidth > 0) frame.classList.add("has-image"); };
    image.addEventListener("load", show);
    if (image.complete) show();
  });

  // FAQ: open one answer at a time.
  const faqItems = [...document.querySelectorAll(".faq-item")];
  faqItems.forEach((item) => item.addEventListener("toggle", () => {
    if (item.open) faqItems.forEach((other) => { if (other !== item) other.open = false; });
  }));

  // RSVP: reveal the original form; do not report success without a server.
  const rsvpButton = document.getElementById("showRsvpForm");
  const rsvpWrap = document.getElementById("rsvpFormWrap");
  rsvpButton.addEventListener("click", () => {
    rsvpWrap.hidden = false;
    rsvpButton.setAttribute("aria-expanded", "true");
    rsvpWrap.scrollIntoView({ behavior: motion(), block: "start" });
    document.getElementById("fullName").focus({ preventScroll: true });
  });
  const form = document.getElementById("rsvpForm");
  const formMessage = document.getElementById("formMessage");
  const guestCount = document.getElementById("guestCount");
  document.querySelectorAll('input[name="attendance"]').forEach((input) => {
    input.addEventListener("change", () => {
      const decline = form.querySelector('input[name="attendance"]:checked')?.value === "Regretfully Declines";
      guestCount.disabled = decline;
      if (decline) guestCount.value = "1";
    });
  });
  form.addEventListener("submit", (event) => {
    // A configured HTTPS POST action can submit to a real form service.
    const action = form.getAttribute("action") || "";
    if (action.startsWith("https://") && form.method.toLowerCase() === "post") return;

    event.preventDefault();
    formMessage.className = "form-message is-error";
    formMessage.textContent = "This RSVP form is a preview only. Your response has not been sent or saved. Connect a form provider before sharing the website with guests.";
  });
});
