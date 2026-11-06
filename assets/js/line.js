/* Moving line above Now: a few slow waves added together, so it drifts without ever visibly repeating.
   It's abstract, not data. It draws itself in once on load, then keeps drifting while it's on screen.
   With reduced motion it's a still line, drawn straight away. */
(function () {
  var hero = document.querySelector(".hero");
  if (!hero) return;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)");
  var NS = "http://www.w3.org/2000/svg";
  var POINTS = 160;
  var INSET = 5; // keeps the end dot inside the right margin

  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "moving-line");
  svg.setAttribute("aria-hidden", "true");
  var path = document.createElementNS(NS, "path");
  path.setAttribute("pathLength", "1");
  var end = document.createElementNS(NS, "circle");
  end.setAttribute("r", "4.5");
  svg.appendChild(path);
  svg.appendChild(end);
  hero.appendChild(svg);

  // Height of the line, from 0 to 1, at a point along it (u) and a moment in seconds (t)
  function height(u, t) {
    return 0.5 + 0.25 * Math.sin(u * 7.1 + t * 0.35) + 0.14 * Math.sin(u * 13.3 - t * 0.5 + 1.3) + 0.06 * Math.sin(u * 29 + t * 0.8 + 0.4);
  }

  function draw(t) {
    var w = svg.clientWidth, h = svg.clientHeight, d = "";
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    for (var i = 0; i <= POINTS; i++) {
      var u = i / POINTS;
      d += (i ? "L" : "M") + (u * (w - INSET)).toFixed(1) + " " + (height(u, t) * h).toFixed(1);
    }
    path.setAttribute("d", d);
    end.setAttribute("cx", w - INSET);
    end.setAttribute("cy", (height(1, t) * h).toFixed(1));
  }

  var frame = 0, onScreen = true;
  function tick(ms) {
    frame = 0;
    draw(reduce.matches ? 0 : ms / 1000);
    if (onScreen && !reduce.matches) frame = requestAnimationFrame(tick);
  }
  function wake() { if (!frame) frame = requestAnimationFrame(tick); }

  // Stop working while the line is scrolled out of view
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) wake();
    }).observe(svg);
  }
  addEventListener("resize", wake);
  reduce.addEventListener("change", wake);

  draw(0);
  wake();
  // Two frames, so the undrawn state is painted first and the draw-in has something to animate from
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { svg.classList.add("is-in"); });
  });
})();
