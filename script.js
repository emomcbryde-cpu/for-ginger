/* ============================================================
   Happy Birthday Ginger — experience controller
   Vanilla JS. No frameworks, no build step.
   Flow: opening -> letters (G I N G E R) -> final reveal
   ============================================================ */

(function () {
  "use strict";

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Letters + messages (exact text) ---- */
  var LETTERS = [
    { g: "G", m: "Gentle is the way your heart loves, even when life asks more of you than it should." },
    { g: "I", m: "In your eyes I found a peace I didn't know I was searching for." },
    { g: "N", m: "No matter where life takes us, a part of my heart will always be grateful for you." },
    { g: "G", m: "Grace is something you carry naturally, making ordinary moments feel extraordinary." },
    { g: "E", m: "Every smile you share has a way of turning difficult days into hopeful ones." },
    { g: "R", m: "Rare is a soul like yours—strong, beautiful, compassionate, and forever cherished." }
  ];

  /* ---- Element refs ---- */
  var body        = document.body;
  var bgGlow      = document.getElementById("bgGlow");
  var starCanvas  = document.getElementById("starfield");
  var fxLayer     = document.getElementById("fxLayer");

  var music       = document.getElementById("music");
  var musicToggle = document.getElementById("musicToggle");

  var openingScene = document.getElementById("opening");
  var openingLine  = document.getElementById("openingLine");
  var openingHint  = document.getElementById("openingHint");

  var lettersScene = document.getElementById("letters");
  var letterGlyph  = document.getElementById("letterGlyph");
  var letterMsg    = document.getElementById("letterMessage");
  var letterHint   = document.getElementById("letterHint");
  var letterProg   = document.getElementById("letterProgress");

  var finalScene   = document.getElementById("final");
  var finalTitle   = document.getElementById("finalTitle");
  var finalLetter  = document.getElementById("finalLetter");
  var memories     = document.getElementById("memories");
  var gallery      = document.getElementById("gallery");
  var signature    = document.getElementById("signature");
  var scrollCue    = document.getElementById("scrollCue");

  /* ---- State ---- */
  var STATE = { INTRO: 0, OPENING: 1, LETTERS: 2, FINAL: 3 };
  var state = STATE.INTRO;
  var letterIndex = -1;
  var busy = false;           // guards taps during transitions
  var musicStarted = false;

  /* ============================================================
     STARFIELD (canvas) — slow drifting stars
     ============================================================ */
  var ctx, stars = [], W = 0, H = 0, dpr = 1, starRAF = null;

  function initStars() {
    if (!starCanvas.getContext) return;
    ctx = starCanvas.getContext("2d");
    resizeStars();
    var count = Math.min(140, Math.floor((W * H) / 9000));
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3 + 0.3,
        a: Math.random() * 0.6 + 0.2,
        tw: Math.random() * 0.02 + 0.004,
        tp: Math.random() * Math.PI * 2,
        vy: Math.random() * 0.12 + 0.02,
        vx: (Math.random() - 0.5) * 0.05
      });
    }
    if (!starRAF) drawStars();
  }

  function resizeStars() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    starCanvas.width = W * dpr;
    starCanvas.height = H * dpr;
    starCanvas.style.width = W + "px";
    starCanvas.style.height = H + "px";
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawStars() {
    starRAF = requestAnimationFrame(drawStars);
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.tp += s.tw;
      var alpha = s.a + Math.sin(s.tp) * 0.25;
      if (alpha < 0) alpha = 0;
      s.y += s.vy; s.x += s.vx;
      if (s.y > H + 2) { s.y = -2; s.x = Math.random() * W; }
      if (s.x > W + 2) s.x = -2;
      if (s.x < -2) s.x = W + 2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(243, 227, 194," + alpha.toFixed(3) + ")";
      ctx.fill();
    }
  }

  window.addEventListener("resize", function () {
    resizeStars();
  });

  /* ============================================================
     FX helpers — floating gold particles, hearts, petals, sparkles
     ============================================================ */

  function spawn(el, life) {
    fxLayer.appendChild(el);
    window.setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, life);
  }

  // Ambient gold particles drifting upward (runs through whole experience)
  var particleTimer = null;
  function startParticles() {
    if (prefersReduced || particleTimer) return;
    particleTimer = window.setInterval(function () {
      var p = document.createElement("div");
      p.className = "particle";
      var size = Math.random() * 5 + 2;
      var startX = Math.random() * window.innerWidth;
      var drift = (Math.random() - 0.5) * 80;
      var dur = Math.random() * 6000 + 7000;
      p.style.width = p.style.height = size + "px";
      p.style.left = startX + "px";
      p.style.top = (window.innerHeight + 20) + "px";
      p.style.opacity = "0";
      spawn(p, dur + 200);
      p.animate([
        { transform: "translate(0,0)", opacity: 0 },
        { opacity: 0.8, offset: 0.15 },
        { opacity: 0.8, offset: 0.75 },
        { transform: "translate(" + drift + "px, -" + (window.innerHeight + 60) + "px)", opacity: 0 }
      ], { duration: dur, easing: "ease-out" });
    }, 900);
  }

  function burstSparkles(n) {
    if (prefersReduced) return;
    for (var i = 0; i < n; i++) {
      (function () {
        var s = document.createElement("div");
        s.className = "sparkle";
        var x = Math.random() * window.innerWidth;
        var y = Math.random() * window.innerHeight * 0.7 + window.innerHeight * 0.1;
        s.style.left = x + "px";
        s.style.top = y + "px";
        spawn(s, 1800);
        s.animate([
          { transform: "scale(0)", opacity: 0 },
          { transform: "scale(1.4)", opacity: 1, offset: 0.4 },
          { transform: "scale(0)", opacity: 0 }
        ], { duration: 1600, delay: Math.random() * 800, easing: "ease-in-out" });
      })();
    }
  }

  // Floating hearts (final scene)
  var heartTimer = null;
  function startHearts() {
    if (prefersReduced || heartTimer) return;
    heartTimer = window.setInterval(function () {
      var h = document.createElement("div");
      h.className = "heart";
      h.textContent = "❤";
      var size = Math.random() * 16 + 14;
      var startX = Math.random() * window.innerWidth;
      var drift = (Math.random() - 0.5) * 120;
      var dur = Math.random() * 5000 + 6000;
      h.style.fontSize = size + "px";
      h.style.left = startX + "px";
      h.style.top = (window.innerHeight + 24) + "px";
      h.style.color = Math.random() > 0.5 ? "#d78a8a" : "#e7b6b6";
      spawn(h, dur + 200);
      h.animate([
        { transform: "translate(0,0) rotate(0deg)", opacity: 0 },
        { opacity: 0.9, offset: 0.15 },
        { opacity: 0.9, offset: 0.7 },
        { transform: "translate(" + drift + "px, -" + (window.innerHeight + 80) + "px) rotate(" + (drift/4) + "deg)", opacity: 0 }
      ], { duration: dur, easing: "ease-out" });
    }, 1100);
  }

  // Rose petals slowly falling (final scene)
  var petalTimer = null;
  function startPetals() {
    if (prefersReduced || petalTimer) return;
    petalTimer = window.setInterval(function () {
      var p = document.createElement("div");
      p.className = "petal";
      var startX = Math.random() * window.innerWidth;
      var sway = (Math.random() - 0.5) * 160;
      var dur = Math.random() * 6000 + 8000;
      var rot = Math.random() * 360;
      p.style.left = startX + "px";
      p.style.top = "-20px";
      p.style.opacity = (Math.random() * 0.4 + 0.5).toFixed(2);
      spawn(p, dur + 200);
      p.animate([
        { transform: "translate(0,0) rotate(0deg)" },
        { transform: "translate(" + sway + "px, " + (window.innerHeight + 60) + "px) rotate(" + (rot + 240) + "deg)" }
      ], { duration: dur, easing: "linear" });
    }, 1300);
  }

  /* ============================================================
     MUSIC — never autoplays; starts on first user tap
     ============================================================ */
  function tryStartMusic() {
    if (musicStarted) return;
    musicStarted = true;
    musicToggle.hidden = false;
    musicToggle.classList.add("show");
    if (!music || !music.querySelector("source").getAttribute("src")) return;
    var pr = music.play();
    if (pr && pr.then) {
      pr.then(function () {
        musicToggle.classList.add("playing");
        musicToggle.setAttribute("aria-pressed", "true");
      }).catch(function () {
        // No file yet, or blocked — toggle stays available, silent.
        musicToggle.classList.remove("playing");
        musicToggle.setAttribute("aria-pressed", "false");
      });
    }
  }

  musicToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (music.paused) {
      var pr = music.play();
      if (pr && pr.then) {
        pr.then(function () {
          musicToggle.classList.add("playing");
          musicToggle.setAttribute("aria-pressed", "true");
        }).catch(function () {});
      }
    } else {
      music.pause();
      musicToggle.classList.remove("playing");
      musicToggle.setAttribute("aria-pressed", "false");
    }
  });

  /* ============================================================
     SCENE TRANSITIONS
     ============================================================ */

  function showScene(el) {
    el.classList.add("is-active");
  }
  function hideScene(el) {
    el.classList.remove("is-active");
  }

  /* ---- Intro: black -> glow + stars + line ---- */
  function beginIntro() {
    var delay = prefersReduced ? 200 : 1400;
    window.setTimeout(function () {
      bgGlow.classList.add("show");
      starCanvas.classList.add("show");
      initStars();
      startParticles();
      openingLine.classList.add("reveal");
      window.setTimeout(function () {
        openingHint.classList.add("show");
        state = STATE.OPENING;
      }, prefersReduced ? 300 : 3000);
    }, delay);
  }

  /* ---- Opening -> Letters ---- */
  function goToLetters() {
    busy = true;
    openingLine.classList.add("fade-out");
    openingHint.classList.add("fade-out");
    buildProgressDots();
    window.setTimeout(function () {
      hideScene(openingScene);
      showScene(lettersScene);
      state = STATE.LETTERS;
      busy = false;
      nextLetter();
    }, prefersReduced ? 200 : 1200);
  }

  function buildProgressDots() {
    for (var i = 0; i < LETTERS.length; i++) {
      var d = document.createElement("span");
      d.className = "dot";
      letterProg.appendChild(d);
    }
  }
  function updateDots() {
    var dots = letterProg.children;
    for (var i = 0; i < dots.length; i++) {
      dots[i].className = "dot" +
        (i < letterIndex ? " done" : "") +
        (i === letterIndex ? " active" : "");
    }
  }

  /* ---- Reveal a single letter ---- */
  function nextLetter() {
    if (busy) return;
    letterIndex++;

    if (letterIndex >= LETTERS.length) {
      goToFinal();
      return;
    }

    busy = true;
    var data = LETTERS[letterIndex];

    // reset
    letterGlyph.className = "letter-glyph";
    letterMsg.className = "letter-message";
    letterHint.classList.remove("show");
    // force reflow so animations restart
    void letterGlyph.offsetWidth;

    letterGlyph.textContent = data.g;
    letterMsg.textContent = data.m;
    updateDots();

    letterGlyph.classList.add("animate");
    letterMsg.classList.add("reveal");
    burstSparkles(6);

    var glyphDur = prefersReduced ? 200 : 1700;
    window.setTimeout(function () {
      letterGlyph.classList.add("glow-pulse");
    }, glyphDur);

    window.setTimeout(function () {
      letterHint.classList.add("show");
      busy = false;
    }, prefersReduced ? 300 : 2600);
  }

  /* ---- Advance within letters (fade out current, then next) ---- */
  function advanceLetter() {
    if (busy) return;
    busy = true;
    letterHint.classList.remove("show");
    letterGlyph.classList.add("fade-out");
    letterMsg.classList.add("fade-out");
    window.setTimeout(function () {
      busy = false;
      nextLetter();
    }, prefersReduced ? 150 : 1000);
  }

  /* ---- Letters -> Final ---- */
  function goToFinal() {
    busy = true;
    letterProg.style.transition = "opacity 1.2s ease";
    letterProg.style.opacity = "0";
    letterHint.classList.add("fade-out");
    window.setTimeout(function () {
      hideScene(lettersScene);
      state = STATE.FINAL;
      // allow scrolling for the final scene
      body.style.cursor = "default";
      showScene(finalScene);
      runFinalSequence();
      busy = false;
    }, prefersReduced ? 200 : 1300);
  }

  function runFinalSequence() {
    startHearts();
    startPetals();
    burstSparkles(14);

    var t = prefersReduced ? 100 : 700;
    finalTitle.classList.add("reveal");

    // stagger the letter paragraphs
    var paras = finalLetter.querySelectorAll("p");
    var base = prefersReduced ? 150 : 2600;
    var step = prefersReduced ? 60 : 900;
    for (var i = 0; i < paras.length; i++) {
      (function (p, i) {
        window.setTimeout(function () { p.classList.add("reveal"); }, base + i * step);
      })(paras[i], i);
    }

    var afterLetter = base + paras.length * step + (prefersReduced ? 100 : 600);

    // memories gallery
    window.setTimeout(function () {
      revealMemories();
    }, afterLetter);

    // signature + sparkle finale
    window.setTimeout(function () {
      signature.classList.add("reveal");
      scrollCue.classList.add("show");
      burstSparkles(18);
      // gentle recurring sparkle finale
      if (!prefersReduced) {
        window.setInterval(function () { burstSparkles(4); }, 3500);
      }
    }, afterLetter + (prefersReduced ? 200 : 1400));
  }

  /* ---- Memories: reveal only photos that actually load ---- */
  function revealMemories() {
    var imgs = gallery.querySelectorAll(".photo img");
    var present = 0;
    var checked = 0;

    function done() {
      checked++;
      if (checked === imgs.length) {
        if (present === 0) {
          memories.classList.add("is-empty"); // no photos -> hide whole section
        } else {
          memories.classList.add("reveal");
        }
      }
    }

    for (var i = 0; i < imgs.length; i++) {
      (function (img, idx) {
        var fig = img.parentNode;
        function ok() {
          // guard against 0x0 broken renders
          if (img.naturalWidth > 1) {
            present++;
            window.setTimeout(function () { fig.classList.add("in"); }, idx * 350);
          } else {
            fig.classList.add("missing");
          }
          done();
        }
        function fail() { fig.classList.add("missing"); done(); }

        if (img.complete) {
          if (img.naturalWidth > 1) ok();
          else fail();
        } else {
          img.addEventListener("load", ok, { once: true });
          img.addEventListener("error", fail, { once: true });
        }
      })(imgs[i], i);
    }
  }

  /* ============================================================
     TAP HANDLING
     ============================================================ */
  function handleTap(e) {
    // Ignore taps on the music button
    if (e.target && e.target.closest && e.target.closest(".music-toggle")) return;

    tryStartMusic();

    if (busy) return;

    switch (state) {
      case STATE.INTRO:
        break; // intro plays automatically
      case STATE.OPENING:
        goToLetters();
        break;
      case STATE.LETTERS:
        if (letterIndex < 0) { nextLetter(); }
        else { advanceLetter(); }
        break;
      case STATE.FINAL:
        // let the user scroll freely; no tap action
        break;
    }
  }

  // Use pointer/touch friendly handling
  document.addEventListener("click", handleTap, false);

  /* ============================================================
     GO
     ============================================================ */
  beginIntro();

})();
