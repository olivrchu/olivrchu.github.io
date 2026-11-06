/* Section dashes: each maroon dash under a section title draws in once, left to right, as it reaches the screen.
   The CSS holds a dash at zero width until this adds .dash-in. Oliver chose to keep this under reduced motion too:
   it's one small movement that plays once. */
(function () {
  var labels = document.querySelectorAll(".label");
  if (!("IntersectionObserver" in window)) {
    labels.forEach(function (l) { l.classList.add("dash-in"); });
    return;
  }
  var watch = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("dash-in"); watch.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -12% 0px" });
  labels.forEach(function (l) { watch.observe(l); });
})();
