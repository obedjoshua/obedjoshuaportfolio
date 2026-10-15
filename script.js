/* ========================================= */
/*  FORCE SCROLL TO TOP / MAIN SECTION ON RELOAD
/* ========================================= */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

window.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
});


/* ============================= */
/*  ULTRA SMOOTH NATIVE SCROLL   */
/* ============================= */

let smoothScrollY = 0;
let rawScrollY = 0;
const SCROLL_EASE = 0.07;

window.addEventListener("scroll", () => {
  rawScrollY = window.scrollY;
});

function smoothScrollLoop() {
  smoothScrollY += (rawScrollY - smoothScrollY) * SCROLL_EASE;
  if (Math.abs(rawScrollY - smoothScrollY) < 0.1) smoothScrollY = rawScrollY;
  tickAll(smoothScrollY);
  requestAnimationFrame(smoothScrollLoop);
}
requestAnimationFrame(smoothScrollLoop);


/* ======================================================== */
/* PRELOADER — SESSION STORAGE ONE-TIME PLAY & RESPONSIVE   */
/* ======================================================== */

const hasSeenPreloader = sessionStorage.getItem('preloaderShown');

if (hasSeenPreloader) {
  document.body.classList.remove('loading');
  const preloaderEl = document.getElementById('preloader');
  if (preloaderEl) {
    preloaderEl.classList.add('hidden-preloader');
    preloaderEl.remove();
  }
} else {
  document.body.classList.add("loading");

  window.addEventListener("load", function () {
    var preloader  = document.getElementById("preloader");
    var counter    = document.getElementById("plCounter");
    var line       = document.getElementById("plLine");
    var cornerTR   = document.getElementById("plCornerTR");
    var cornerTL   = document.getElementById("plCornerTL");
    var vline      = document.getElementById("plVline");
    var hline      = document.getElementById("plHline");
    var letters    = document.getElementById("plLetters");
    var letterO    = document.getElementById("plLetterO");
    var letterJ    = document.getElementById("plLetterJ");
    var statusWrap = document.getElementById("plStatusWrap");
    var status     = document.getElementById("plStatus");

    if (!preloader || !counter) return;

    var val       = 0;
    var target    = 0;
    var raf;
    var done      = false;
    var start     = performance.now();
    var MIN_MS    = 2400;
    var statusIdx = -1;
    var statuses  = ["Loading", "Assets", "Building", "Almost", "Ready"];

    requestAnimationFrame(function () {
      if (vline) { vline.style.height = "100vh"; vline.style.top = "0"; vline.style.transform = "none"; }
      if (hline) { hline.style.width  = "100vw"; hline.style.left = "0"; hline.style.transform = "none"; }
    });

    setTimeout(function () { if (cornerTL)   cornerTL.style.opacity   = "1"; }, 200);
    setTimeout(function () { if (cornerTR)   cornerTR.style.opacity   = "1"; }, 340);
    setTimeout(function () { if (letters)    letters.style.opacity    = "1"; }, 180);
    setTimeout(function () { if (statusWrap) statusWrap.style.opacity = "1"; setStatus(0); }, 300);

    function setStatus(idx) {
      if (idx === statusIdx || !status) return;
      statusIdx = idx;
      status.classList.remove("up");
      void status.offsetWidth;
      status.textContent = statuses[idx];
      requestAnimationFrame(function () { status.classList.add("up"); });
    }

    function updateCounter(v) {
      var isMobile = window.innerWidth <= 768;
      var minSize  = isMobile ? 36 : 80;
      var maxRatio = isMobile ? 0.14 : 0.22;
      var maxSize  = window.innerWidth * maxRatio;
      var size     = minSize + (v / 100) * (maxSize - minSize);
      counter.style.fontSize = Math.floor(size) + "px";
    }

    function updateLetters(v) {
      if (!letterO || !letterJ) return;
      var progress   = v / 100;
      var ease       = progress * progress * (3 - 2 * progress);
      var isMobile   = window.innerWidth <= 768;
      var letterSize = Math.min(window.innerWidth * (isMobile ? 0.18 : 0.14), isMobile ? 90 : 180);
      var oTarget    = (window.innerWidth / 2) - letterSize * 0.62;
      var jTarget    = (window.innerWidth / 2) - letterSize * 0.45;
      var oStart     = window.innerWidth * 0.04;
      var jStart     = window.innerWidth * 0.04;

      letterO.style.left  = (oStart + (oTarget - oStart) * ease) + "px";
      letterJ.style.right = (jStart + (jTarget - jStart) * ease) + "px";
      var brightness      = 0.06 + ease * 0.10;
      letterO.style.color = "rgba(255,255,255," + brightness + ")";
      letterJ.style.color = "rgba(255,255,255," + brightness + ")";
    }

    function loop() {
      var diff = target - val;
      val += diff * 0.055;
      if (Math.abs(diff) < 0.05) val = target;
      var d = Math.floor(val);
      counter.textContent = d;
      updateCounter(val);
      updateLetters(val);
      if (line)     line.style.width     = val + "%";
      if (cornerTR) cornerTR.textContent = d + "%";
      if (val >= 20 && val < 50) setStatus(1);
      if (val >= 50 && val < 80) setStatus(2);
      if (val >= 80 && val < 99) setStatus(3);
      if (val >= 99)             setStatus(4);
      raf = requestAnimationFrame(loop);
    }
    loop();

    var slow = setInterval(function () {
      if (target >= 90) { clearInterval(slow); rush(); return; }
      var step = target < 40 ? 1.4 : target < 70 ? 0.8 : 0.35;
      target = Math.min(target + Math.random() * step, 90);
    }, 65);

    function rush() {
      var t = setInterval(function () {
        target = Math.min(target + 1.2, 100);
        if (target >= 100) {
          clearInterval(t);
          var e = performance.now() - start;
          setTimeout(exit, Math.max(0, MIN_MS - e) + 100);
        }
      }, 16);
    }

    function exit() {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      val = 100; target = 100;
      counter.textContent = "100";
      if (line)     line.style.width     = "100%";
      if (cornerTR) cornerTR.textContent = "100%";
      updateCounter(100);
      updateLetters(100);
      setStatus(4);

      var pageWrap = document.getElementById("pageWrap");

      setTimeout(function () {
        var ease = "cubic-bezier(0.76,0,0.24,1)";
        var dur  = "1s";
        if (pageWrap) {
          pageWrap.style.transition = "none";
          pageWrap.style.transform  = "translateY(100vh)";
        }
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            preloader.style.transition = "transform " + dur + " " + ease;
            preloader.style.transform  = "translateY(-100vh)";
            if (pageWrap) {
              pageWrap.style.transition = "transform " + dur + " " + ease;
              pageWrap.style.transform  = "translateY(0)";
            }
          });
        });
        setTimeout(function () {
          if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
          document.body.classList.remove("loading");
          sessionStorage.setItem('preloaderShown', 'true');
          if (pageWrap) {
            pageWrap.style.transition = "";
            pageWrap.style.transform  = "";
          }
        }, 1050);
      }, 220);
    }

    window.addEventListener("resize", function () {
      updateCounter(val);
      updateLetters(val);
    });
  });
}


/* ============================= */
/*  INFINITE HERO TEXT CAROUSEL  */
/* ============================= */

const track = document.querySelector(".carousel-track");

function duplicateForInfinite() {
  if (!track) return;
  const contentWidth = track.scrollWidth / 2;
  track.style.animationDuration = contentWidth / 300 + "s";
}

window.addEventListener("load", duplicateForInfinite);
window.addEventListener("resize", duplicateForInfinite);


/* =========================================================
   BLACK SECTION PULL-UP (SEAMLESS ATTACHED OVERLAP)
============================================================ */

const blackSection   = document.querySelector(".black-section");
const aboutContainer = document.querySelector(".about-container");

function tickBlackSection(scrollY) {
  if (!blackSection) return;
  
  let progress = scrollY / (window.innerHeight * 0.7);
  progress = Math.max(0, Math.min(progress, 1));
  
  if (aboutContainer) {
    aboutContainer.style.opacity = Math.min(1, progress * 1.5);
    aboutContainer.style.transform = `translateY(${(1 - progress) * 20}px)`;
  }
}


/* ========================================= */
/*  WHITE SECTION SCROLL HORIZONTAL CAROUSEL */
/* ========================================= */

const whiteSection       = document.querySelector(".white-section");
const horizontalCarousel = document.querySelector(".scroll-carousel");
const carouselContainer  = document.querySelector(".carousel-container");

let currentX = 0;
let targetX  = 0;

function tickHorizontalCarousel() {
  if (!whiteSection || !horizontalCarousel || !carouselContainer) return;
  const rect         = whiteSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const progress     = Math.min(Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0), 1);
  const maxScroll    = horizontalCarousel.scrollWidth - carouselContainer.offsetWidth;
  targetX = -progress * maxScroll;
}

function animateHorizontalCarousel() {
  if (!horizontalCarousel) return;
  currentX += (targetX - currentX) * 0.08;
  horizontalCarousel.style.transform = `translateX(${currentX}px)`;
  requestAnimationFrame(animateHorizontalCarousel);
}

animateHorizontalCarousel();


/* ========================================= */
/*  FLOATING MOUSE-FOLLOWING PROJECT PREVIEW */
/* ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const projectRows = document.querySelectorAll(".project-row");
  const floatingPreview = document.getElementById("floatingProjectPreview");
  const floatingImg = document.getElementById("floatingPreviewImg");

  if (!projectRows.length || !floatingPreview || !floatingImg) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isHovered = false;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderPreview() {
    if (isHovered) {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      floatingPreview.style.left = `${currentX}px`;
      floatingPreview.style.top = `${currentY}px`;
    }
    requestAnimationFrame(renderPreview);
  }
  renderPreview();

  projectRows.forEach((row) => {
    row.addEventListener("mouseenter", () => {
      const imgSrc = row.getAttribute("data-img");
      if (imgSrc) {
        floatingImg.src = imgSrc;
        isHovered = true;
        floatingPreview.classList.add("active");
      }
      
      projectRows.forEach(r => r.classList.remove("active-scrolled"));
      row.classList.add("active-scrolled");
    });

    row.addEventListener("mouseleave", () => {
      isHovered = false;
      floatingPreview.classList.remove("active");
      row.classList.remove("active-scrolled");
    });
  });
});


/* ========================================= */
/*  FLOATING DOCK & FIXED UI TOGGLE          */
/* ========================================= */

const floatingDock = document.getElementById("floatingDock");
const sideHonors   = document.querySelector(".side-honors");

function tickFixedUI(scrollY) {
  const offHero = scrollY > 80;
  const footerCurtain = document.querySelector('.footer-curtain');
  let atFooter = false;

  if (footerCurtain) {
    const footerRect = footerCurtain.getBoundingClientRect();
    if (footerRect.top <= window.innerHeight - 100) {
      atFooter = true;
    }
  }
  
  if (floatingDock) {
    if (offHero && !atFooter) floatingDock.classList.add("visible");
    else floatingDock.classList.remove("visible");
  }
  
  if (sideHonors) {
    if (offHero) sideHonors.classList.add("hidden");
    else sideHonors.classList.remove("hidden");
  }
}


/* ========================================= */
/*  INTRO WORD OVERLAY                       */
/* ========================================= */

document.addEventListener("DOMContentLoaded", function () {
  var introTrigger = document.getElementById("introTrigger");
  var introOverlay = document.getElementById("introOverlay");
  var introClose   = document.getElementById("introClose");
  var introWord    = document.getElementById("introWord");
  var introAudio   = document.getElementById("introAudio");
  var introVideo   = document.getElementById("introVideo");

  if (!introTrigger || !introOverlay) return;

  var words      = ["O", "J"];
  var cycleTimer = null;

  function showWord(word) {
    var sizes = ["clamp(60px,8vw,120px)", "clamp(120px,18vw,260px)", "clamp(200px,30vw,420px)", "clamp(280px,40vw,560px)"];
    var size  = sizes[Math.floor(Math.random() * sizes.length)];
    var x     = (Math.random() * 120 - 60);
    var y     = (Math.random() * 70  - 35);
    introWord.style.transition = "none";
    introWord.style.opacity    = "0";
    introWord.style.fontSize   = size;
    introWord.style.transform  = "translate(" + x + "vw," + y + "vh) scaleX(" + (0.85 + Math.random() * 0.3) + ")";
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        introWord.textContent      = word;
        introWord.style.transition = "opacity 0.08s ease";
        introWord.style.opacity    = "1";
      });
    });
  }

  function startCycle() {
    function flash() {
      showWord(words[Math.floor(Math.random() * words.length)]);
      cycleTimer = setTimeout(flash, 80 + Math.random() * 270);
    }
    flash();
  }

  function stopCycle() {
    clearTimeout(cycleTimer);
    cycleTimer = null;
  }

  introTrigger.addEventListener("click", function () {
    introOverlay.classList.add("active");
    startCycle();
    if (introVideo) introVideo.play().catch(function () {});
    if (introAudio) { introAudio.currentTime = 0; introAudio.volume = 0.7; introAudio.play().catch(function () {}); }
  });

  function closeIntro() {
    introOverlay.classList.remove("active");
    stopCycle();
    introWord.textContent = "";
    if (introVideo) { introVideo.pause(); introVideo.currentTime = 0; }
    if (introAudio) { introAudio.pause(); introAudio.currentTime = 0; }
  }

  introClose.addEventListener("click", closeIntro);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && introOverlay.classList.contains("active")) closeIntro();
  });
});


/* ============================= */
/*  MASTER TICK                  */
/* ============================= */

function tickAll(scrollY) {
  tickBlackSection(scrollY);
  tickHorizontalCarousel();
  tickFixedUI(scrollY);
}


/* ========================================= */
/*  LINKTREE OVERLAY                         */
/* ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const linktreeBtn     = document.querySelector(".linktree");
  const linktreeOverlay = document.getElementById("linktreeOverlay");
  const closeLinktree   = document.getElementById("closeLinktree");

  if (!linktreeBtn || !linktreeOverlay || !closeLinktree) return;

  linktreeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    linktreeOverlay.classList.add("active");
  });

  closeLinktree.addEventListener("click", () => {
    linktreeOverlay.classList.remove("active");
  });
});


/* ========================================= */
/*  ABOUT TEXT MASKED REVEAL                 */
/* ========================================= */

document.addEventListener("DOMContentLoaded", function () {

  var section = document.querySelector(".black-section");
  var h1      = document.querySelector(".black-section h1.content");
  var para    = document.querySelector(".black-section p.about-text");

  if (!section || !h1 || !para) return;

  var style = document.createElement("style");
  style.textContent = [
    ".word-mask { display: inline-flex; overflow: hidden; vertical-align: bottom; }",
    ".about-text { line-height: 1.2 !important; }",
    ".word-inner {",
    "  display: inline-block;",
    "  transform: translateY(110%);",
    "  opacity: 0;",
    "  clip-path: inset(0 0 100% 0);",
    "  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;",
    "  transition-delay: var(--d, 0ms);",
    "  will-change: transform, clip-path, opacity;",
    "  line-height: inherit;",
    "}",
    ".revealed .word-inner { transform: translateY(0); opacity: 1; clip-path: inset(0 0 0% 0); }"
  ].join("\n");

  document.head.appendChild(style);

  function wrapWords(el) {
    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var parts = node.textContent.split(/(\s+)/);
        var frag  = document.createDocumentFragment();

        parts.forEach(function (part) {
          if (/^\s+$/.test(part) || part === "") {
            frag.appendChild(document.createTextNode(part));
          } else {
            var mask  = document.createElement("span");
            var inner = document.createElement("span");
            mask.className  = "word-mask";
            inner.className = "word-inner";
            inner.textContent = part;
            mask.appendChild(inner);
            frag.appendChild(mask);
          }
        });

        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(processNode);
      }
    }

    Array.from(el.childNodes).forEach(processNode);
  }

  wrapWords(h1);
  wrapWords(para);

  h1.querySelectorAll(".word-inner").forEach(function (el, i) {
    el.style.setProperty("--d", (i * 45) + "ms");
  });

  para.querySelectorAll(".word-inner").forEach(function (el, i) {
    el.style.setProperty("--d", (60 + i * 22) + "ms");
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio >= 0.2) {
        h1.classList.add("revealed");
        para.classList.add("revealed");
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  observer.observe(section);
});


/* ========================================= */
/*  ABOUT INFINITE CAROUSEL (BIDIRECTIONAL) */
/* ========================================= */

const aboutCarousel = document.querySelector(".about-scroll-carousel");
let aboutPos        = 0;
const aboutSpeed    = 3;
let scrollDirection = 1;
let lastScrollY     = window.scrollY;

window.addEventListener("scroll", () => {
  const cur = window.scrollY;
  scrollDirection = cur > lastScrollY ? 1 : -1;
  lastScrollY = cur;
});

function animateAboutInfinite() {
  if (!aboutCarousel) return;
  const width = aboutCarousel.scrollWidth / 2;
  aboutPos -= aboutSpeed * scrollDirection;
  if (aboutPos <= -width) aboutPos += width;
  if (aboutPos >= 0)      aboutPos -= width;
  aboutCarousel.style.transform = `translateX(${aboutPos}px)`;
  requestAnimationFrame(animateAboutInfinite);
}

animateAboutInfinite();


/* ========================================= */
/*  LOCAL TIME UPDATER                       */
/* ========================================= */

function updateClock() {
  const timeDisplay = document.getElementById("localTimeDisplay");
  if (timeDisplay) {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  }
}
setInterval(updateClock, 1000);
updateClock();


/* ========================================= */
/*  FOOTER CURTAIN REVEAL SPACER             */
/* ========================================= */

function setFooterSpacer() {
  const footerCurtain = document.querySelector('.footer-curtain');
  const pageWrap = document.getElementById('pageWrap');
  
  if (footerCurtain && pageWrap) {
    const footerHeight = Math.max(footerCurtain.offsetHeight, window.innerHeight);
    pageWrap.style.marginBottom = footerHeight + 'px';
  }
}

window.addEventListener('resize', setFooterSpacer);
document.addEventListener("DOMContentLoaded", () => {
  setFooterSpacer();
  setTimeout(setFooterSpacer, 500);
});