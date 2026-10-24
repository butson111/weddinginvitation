document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. HERO COUNTDOWN TIMER
     Target Date: March 6, 2027
     ========================================================================== */
  const targetDate = new Date('March 6, 2027 00:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      document.getElementById('days').textContent = days < 10 ? '0' + days : days;
      document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
      document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
      document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;
    } else {
      document.getElementById('countdown').innerHTML = '<h3>Today is the Day!</h3>';
    }
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ==========================================================================
     2. MOBILE NAVIGATION TOGGLE
     ========================================================================== */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile nav when link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  /* ==========================================================================
     3. OUR STORY MODAL POPUP
     ========================================================================== */
  const modal = document.getElementById('storyModal');
  const openBtn = document.getElementById('openStoryModal');
  const closeBtn = document.getElementById('closeStoryModal');

  if (openBtn && modal && closeBtn) {
    openBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    });

    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* ==========================================================================
     4. FAQ ACCORDION INTERACTION
     ========================================================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');

      // Close all other active items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     5. RSVP FORM SUBMISSION FEEDBACK
     ========================================================================== */
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpFeedback = document.getElementById('rsvpFeedback');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      // NOTE: Remove e.preventDefault() if forwarding directly to an external form handler service
      e.preventDefault();

      const name = document.getElementById('fullName').value;
      
      rsvpFeedback.textContent = `Thank you, ${name}! Your RSVP has been received successfully.`;
      rsvpFeedback.classList.remove('hidden');
      
      rsvpForm.reset();
    });
  }
});