// ============================================
// JAYSON & ZENIA — WEDDING WEBSITE
// Main JavaScript: script.js
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------
  // 1. LIVE WEDDING COUNTDOWN
  // ------------------------------------------

  // March 6, 2027, at midnight in Philippine time (UTC+8).
  const weddingDate = new Date("2027-03-06T00:00:00+08:00").getTime();

  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");
  const countdownMessage = document.getElementById("countdownMessage");

  function updateCountdown() {
    const now = Date.now();
    const difference = weddingDate - now;

    if (difference <= 0) {
      if (daysElement) daysElement.textContent = "000";
      if (hoursElement) hoursElement.textContent = "00";
      if (minutesElement) minutesElement.textContent = "00";
      if (secondsElement) secondsElement.textContent = "00";

      if (countdownMessage) {
        countdownMessage.textContent =
          "Today is the day! Let the celebration begin.";
      }

      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    );
    const minutes = Math.floor(
      (difference / (1000 * 60)) % 60
    );
    const seconds = Math.floor(
      (difference / 1000) % 60
    );

    if (daysElement) daysElement.textContent = String(days).padStart(3, "0");
    if (hoursElement) hoursElement.textContent = String(hours).padStart(2, "0");
    if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, "0");
    if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();

  // Update once every second.
  const countdownInterval = window.setInterval(() => {
    updateCountdown();

    if (Date.now() >= weddingDate) {
      window.clearInterval(countdownInterval);
    }
  }, 1000);


  // ------------------------------------------
  // 2. RESPONSIVE MOBILE NAVIGATION
  // ------------------------------------------

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  
  if (menuToggle && navLinks) {
    const navItems = navLinks.querySelectorAll("a");

    function closeMenu() {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      navLinks.classList.toggle("is-open", !isOpen);
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation menu" : "Close navigation menu"
      );
    });

    navItems.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }


  // ------------------------------------------
  // 3. OUR STORY MODAL & INTERACTIVE PHOTO SHUFFLE
  // ------------------------------------------

  const storyDialog = document.getElementById("storyDialog");
  const openStoryButton = document.getElementById("openStory");
  const closeStoryButton = document.getElementById("closeStory");

  if (openStoryButton && storyDialog && closeStoryButton) {
    openStoryButton.addEventListener("click", () => {
      if (typeof storyDialog.showModal === "function") {
        storyDialog.showModal();
      } else {
        storyDialog.setAttribute("open", "");
      }
    });

    closeStoryButton.addEventListener("click", () => {
      if (typeof storyDialog.close === "function") {
        storyDialog.close();
      } else {
        storyDialog.removeAttribute("open");
      }
    });

    storyDialog.addEventListener("click", (event) => {
      if (event.target === storyDialog) {
        storyDialog.close();
      }
    });
  }

  // Interactive Photo Shuffle for "How It All Began" section
  const photoShuffleCard = document.getElementById("photoShuffleCard");
  const shuffleImg = document.getElementById("shuffleImg");
  const shuffleCaption = document.getElementById("shuffleCaption");

  // Add your couple photos or memories here to shuffle through them interactively!
  const shufflePhotos = [
    {
      url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=85",
      caption: "OUR LITTLE LOVE STORY"
    },
    {
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=85",
      caption: "COFFEE DATES & AFTER-WORK WALKS"
    },
    {
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
      caption: "OUR ENGAGEMENT MEMORIES"
    }
  ];

  let currentPhotoIndex = 0;

  if (photoShuffleCard && shuffleImg) {
    photoShuffleCard.addEventListener("click", () => {
      shuffleImg.style.opacity = "0";
      setTimeout(() => {
        currentPhotoIndex = (currentPhotoIndex + 1) % shufflePhotos.length;
        shuffleImg.src = shufflePhotos[currentPhotoIndex].url;
        if (shuffleCaption) {
          shuffleCaption.textContent = shufflePhotos[currentPhotoIndex].caption;
        }
        shuffleImg.style.opacity = "1";
      }, 300);
    });
  }


  // ------------------------------------------
  // 4. FAQ ACCORDION
  // ------------------------------------------

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.open) {
          otherItem.open = false;
        }
      });
    });
  });


  // ------------------------------------------
  // 5. RSVP FORM
  // ------------------------------------------

  const rsvpForm = document.getElementById("rsvpForm");
  const formMessage = document.getElementById("formMessage");
  const attendanceInputs = document.querySelectorAll(
    'input[name="attendance"]'
  );
  const guestCountSelect = document.getElementById("guestCount");

  function showFormMessage(message, type) {
    if (!formMessage) return;
    formMessage.textContent = message;
    formMessage.classList.remove("is-error", "is-success");

    if (type) {
      formMessage.classList.add(`is-${type}`);
    }
  }

  function updateGuestCount() {
    if (!guestCountSelect) return;
    const selectedAttendance = document.querySelector(
      'input[name="attendance"]:checked'
    );

    const isDeclining =
      selectedAttendance?.value === "Regretfully Declines";

    guestCountSelect.disabled = Boolean(isDeclining);

    if (isDeclining) {
      guestCountSelect.value = "1";
    }
  }

  if (attendanceInputs.length > 0) {
    attendanceInputs.forEach((input) => {
      input.addEventListener("change", updateGuestCount);
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!rsvpForm.reportValidity()) {
        showFormMessage(
          "Please complete the required fields before submitting.",
          "error"
        );
        return;
      }

      const formData = new FormData(rsvpForm);
      const fullName = String(formData.get("fullName") || "").trim();
      const attendance = formData.get("attendance");

      if (!fullName || !attendance) {
        showFormMessage(
          "Please enter your name and select your attendance status.",
          "error"
        );
        return;
      }

      showFormMessage(
        "This is a demo form. Your RSVP has not been sent or saved yet. Please connect a form service to receive responses.",
        "error"
      );
    });
  }

});