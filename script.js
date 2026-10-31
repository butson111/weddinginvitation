
// ============================================
// JAYSON & ZENIA — WEDDING WEBSITE
// Main JavaScript: script.js
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------
  // 1. LIVE WEDDING COUNTDOWN
  // ------------------------------------------

  // March 6, 2027, at midnight in Philippine time (UTC+8).
  // Change the time if your ceremony begins at a different hour.
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
      daysElement.textContent = "000";
      hoursElement.textContent = "00";
      minutesElement.textContent = "00";
      secondsElement.textContent = "00";

      countdownMessage.textContent =
        "Today is the day! Let the celebration begin.";

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

    daysElement.textContent = String(days).padStart(3, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();

  // Update once every second.
  const countdownInterval = window.setInterval(() => {
    updateCountdown();

    // Stop the interval after the wedding date.
    if (Date.now() >= weddingDate) {
      window.clearInterval(countdownInterval);
    }
  }, 1000);

  // ------------------------------------------
  // 2. RESPONSIVE MOBILE NAVIGATION
  // ------------------------------------------

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
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

  // Close the mobile menu when a navigation link is selected.
  navItems.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close the menu when the user presses Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Close the mobile navigation when returning to desktop width.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });


  // ------------------------------------------
  // 3. OUR STORY MODAL
  // ------------------------------------------

  const storyDialog = document.getElementById("storyDialog");
  const openStoryButton = document.getElementById("openStory");
  const closeStoryButton = document.getElementById("closeStory");

  openStoryButton.addEventListener("click", () => {
    if (typeof storyDialog.showModal === "function") {
      storyDialog.showModal();
    } else {
      // Fallback for older browsers.
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

  // Close the dialog when the backdrop itself is clicked.
  storyDialog.addEventListener("click", (event) => {
    if (event.target === storyDialog) {
      storyDialog.close();
    }
  });

  // The native dialog also closes on Escape automatically.


  // ------------------------------------------
  // 4. FAQ ACCORDION
  // ------------------------------------------

  const faqItems = document.querySelectorAll(".faq-item");

  // Allow only one FAQ answer to remain open at a time.
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
    formMessage.textContent = message;
    formMessage.classList.remove("is-error", "is-success");

    if (type) {
      formMessage.classList.add(`is-${type}`);
    }
  }

  // An RSVP that declines does not need a guest count above one.
  function updateGuestCount() {
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

  attendanceInputs.forEach((input) => {
    input.addEventListener("change", updateGuestCount);
  });

  rsvpForm.addEventListener("submit", (event) => {
    // Prevent an ordinary browser submission.
    // Replace this behavior when connecting a real form service.
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

    /*
      DEMO MODE — NO DATA IS SENT OR SAVED.

      To enable real submissions, choose a provider such as
      Formspree and configure the form action and method.

      Example integration using FormData and fetch:

      const response = await fetch("YOUR_FORMSPREE_ENDPOINT", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("Unable to submit RSVP.");
      }

      Only show a success message after the server confirms
      that the response was received.

      Do not publish private API keys in client-side JavaScript.
    */

    showFormMessage(
      "This is a demo form. Your RSVP has not been sent or saved yet. Please connect a form service to receive responses.",
      "error"
    );
  });

});
