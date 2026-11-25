(function () {
  document.querySelectorAll(".carousel").forEach((car) => {
    const slides = Array.from(car.querySelectorAll(".slide"));
    const dots = Array.from(car.querySelectorAll(".car-dot"));
    const count = car.querySelector(".car-count");
    let cur = 0;
    function show(k) {
      k = (k + slides.length) % slides.length;
      if (k === cur) return;
      slides[cur].querySelectorAll("video").forEach((v) => v.pause());
      slides[cur].classList.remove("is-active"); dots[cur].classList.remove("is-active");
      cur = k;
      slides[cur].classList.add("is-active"); dots[cur].classList.add("is-active");
      if (count) count.textContent = (cur + 1) + " / " + slides.length;
      slides[cur].querySelectorAll("video").forEach((v) => {
        if (v.dataset.loaded) { v.currentTime = 0; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
      });
    }
    car.querySelector(".car-prev").addEventListener("click", () => show(cur - 1));
    car.querySelector(".car-next").addEventListener("click", () => show(cur + 1));
    dots.forEach((d) => d.addEventListener("click", () => show(+d.dataset.k)));
    car.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1); });
    let x0 = null, y0 = null;
    const stage = car.querySelector(".carousel-stage");
    stage.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > 1.5 * Math.abs(dy)) show(dx < 0 ? cur + 1 : cur - 1);
    }, { passive: true });
  });
})();

(function () {
  const videos = Array.from(document.querySelectorAll("video[data-src]"));
  function load(v) {
    if (!v.dataset.loaded) {
      v.preload = "metadata";
      v.autoplay = true;
      v.src = v.dataset.src;
      v.dataset.loaded = "1";
    }
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) load(e.target);
        else if (e.target.dataset.loaded) e.target.pause();
      });
    }, { rootMargin: "300px 0px" });
    videos.forEach((v) => io.observe(v));
  } else {
    videos.forEach(load);
  }
})();

(function () {
  const btn = document.getElementById("copy-bibtex");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const text = document.getElementById("bibtex").innerText;
    const done = () => { btn.querySelector(".label").textContent = "Copied"; setTimeout(() => { btn.querySelector(".label").textContent = "Copy"; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => {});
    } else {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
      ta.select(); document.execCommand("copy"); document.body.removeChild(ta); done();
    }
  });
})();
