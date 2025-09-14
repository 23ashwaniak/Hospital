// app.js (module)
// Handles UI interactions, forms, firebase integration (optional), accessibility helpers

// Immediately invoked to avoid polluting global namespace
(() => {
  // -- Basic UI wiring --
  const mobileToggle = document.getElementById("mobileToggle");
  const mainNav = document.getElementById("mainNav");
  const portalBtn = document.getElementById("portalBtn");
  const yearEl = document.getElementById("year");

  yearEl.textContent = new Date().getFullYear();

  mobileToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });

  // Smooth scrolling for nav links
  document.querySelectorAll(".nav-link").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      mainNav.classList.remove("open"); // close mobile nav
      const id = a.getAttribute("href").slice(1);
      document
        .getElementById(id)
        .scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Portal quick demo
  portalBtn.addEventListener("click", () => {
    alert(
      "Patient Portal demo — integrate with Firebase Auth / OAuth for real logins."
    );
  });

  // Testimonials carousel (simple)
  const carousel = document.getElementById("testCarousel");
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".testimonial"));
    let i = 0;
    setInterval(() => {
      slides.forEach((s) => s.classList.remove("active"));
      slides[i].classList.add("active");
      i = (i + 1) % slides.length;
    }, 5000);
  }

  // Accordion (FAQ)
  document.querySelectorAll(".acc-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      const open = panel.style.display === "block";
      document
        .querySelectorAll(".acc-a")
        .forEach((a) => (a.style.display = "none"));
      panel.style.display = open ? "none" : "block";
    });
  });

  // Quick appointment form (hero)
  document.getElementById("quickForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    saveSubmission("quickAppointments", data);
    e.target.reset();
    alert("Quick appointment requested. We will contact you.");
  });

  // Appointment form
  const appointmentForm = document.getElementById("appointmentForm");
  appointmentForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    document.getElementById("appointmentMsg").textContent = "Submitting…";
    try {
      await saveSubmission("appointments", data);
      document.getElementById("appointmentMsg").textContent =
        "Appointment request received. We will contact you soon.";
      e.target.reset();
    } catch (err) {
      document.getElementById("appointmentMsg").textContent =
        "Error saving request. Please try again.";
      console.error(err);
    }
  });

  // Contact form
  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    document.getElementById("contactMsg").textContent = "Sending…";
    try {
      await saveSubmission("contactMessages", data);
      document.getElementById("contactMsg").textContent =
        "Message sent — thank you!";
      e.target.reset();
    } catch (err) {
      document.getElementById("contactMsg").textContent =
        "Send failed. Please try again.";
      console.error(err);
    }
  });

  // -- Storage & Firebase integration (optional) --
  /**
   * saveSubmission(collection, payload)
   * - If Firebase is configured (window._FIREBASE_READY === true) it saves to Firestore.
   * - Otherwise falls back to localStorage queue for demo and offline testing.
   *
   * Setup instructions for Firebase are below (replace config in example).
   */
  async function saveSubmission(collection, payload) {
    payload._ts = new Date().toISOString();
    // If firebase is configured, use it
    if (window._FIREBASE_READY && window._saveToFirestore) {
      return window._saveToFirestore(collection, payload);
    } else {
      // Fallback: localStorage queue
      const key = `demo_${collection}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push(payload);
      localStorage.setItem(key, JSON.stringify(existing));
      // resolve promise so callers can await
      return Promise.resolve({ status: "saved-local", count: existing.length });
    }
  }

  // -- Firebase optional starter (you must paste your config) --
  /* 
    To enable Firebase:
    1. Create a Firebase project (console.firebase.google.com).
    2. Enable Firestore and optionally Authentication.
    3. In the snippet below, replace the configuration object.
    4. Uncomment the import and init lines. (Note: in production bundle these should be installed via npm)
  */

  // Example: modular Firebase v9 via CDN (uncomment and add your config)
  /*
  // 1) Add the below <script> tags right before closing </body> or use module imports in your bundler.
  // <script type="module" src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js"></script>
  // <script type="module" src="https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js"></script>

  // 2) Example init (replace with your values):
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
  };

  // Minimal wrapper to init and save
  async function initFirebase() {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js');
    const { getFirestore, collection, addDoc } = await import('https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    // Expose a save function to the rest of the app
    window._FIREBASE_READY = true;
    window._saveToFirestore = async (coll, payload) => {
      const docRef = await addDoc(collection(db, coll), payload);
      return { id: docRef.id };
    };
  }

  // Call initFirebase() after placing your config.
  // initFirebase().catch(console.error);
  */

  // For users who prefer a script tag approach: add firebase SDK scripts and run init as above.
  // The demo intentionally uses dynamic import to avoid bundler issues in small static sites.

  // -- Accessibility niceties --
  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".site-header")) mainNav.classList.remove("open");
  });

  // End of IIFE
})();
