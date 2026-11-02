/* Cursor: a maroon dot pinned exactly to the pointer, and a hollow ring that follows a beat behind,
   so fast moves pull the two apart and they settle back together. The dot also grows with mouse speed.
   The ring inverts whatever is under it, so it reads on paper, on the dark ground and on the posters.
   Mouse and trackpad only: touch screens keep their normal behaviour. With reduced motion the ring
   doesn't trail and the dot keeps one size. If this script doesn't run, the CSS dot cursor is the fallback. */
(function () {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)");
  var CLICKABLE = "a, button, .poster-open, .viewer-img";
  var MAX = 2.4;     // largest dot: 9px x 2.4 = about 22px, just inside the ring's 25px opening
  var FOLLOW = 0.22; // share of the gap the ring closes each frame; lower trails further
  var LEASH = 36;    // furthest the ring may fall behind the dot, in px, so fast flicks stay one cursor

  // Ring and dot are separate top-level layers: the ring's blend mode only works against the page
  // if it isn't wrapped in its own stacking context.
  function layer(cls) {
    var e = document.createElement("div");
    e.className = cls;
    e.setAttribute("aria-hidden", "true");
    document.body.appendChild(e);
    return e;
  }
  var ring = layer("cursor-ring");
  var dot = layer("cursor-dot");
  document.documentElement.classList.add("has-cursor");

  var x = 0, y = 0;            // pointer
  var rx = 0, ry = 0;          // ring, eased toward the pointer
  var lastX = 0, lastY = 0, lastT = 0;
  var speed = 0;               // pointer speed in px per ms, decays every frame
  var scale = 1;               // current dot size, eased toward its target
  var hot = false;             // over something clickable
  var frame = 0;

  function place() {
    ring.style.transform = "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px)";
    dot.style.transform = "translate(" + x + "px," + y + "px) scale(" + scale.toFixed(3) + ")";
  }

  function tick() {
    speed *= 0.88;
    var target = Math.min((hot ? 1.6 : 1) + speed * 0.6, MAX);
    scale += (target - scale) * 0.25;
    if (reduce.matches) { rx = x; ry = y; }
    else {
      rx += (x - rx) * FOLLOW; ry += (y - ry) * FOLLOW;
      var gap = Math.hypot(x - rx, y - ry);
      if (gap > LEASH) { rx = x - (x - rx) * LEASH / gap; ry = y - (y - ry) * LEASH / gap; }
    }
    place();
    // Stop the loop once everything has settled, so nothing runs while the mouse is still
    var moving = Math.abs(target - scale) > 0.002 || speed > 0.01 || Math.abs(x - rx) + Math.abs(y - ry) > 0.2;
    frame = moving ? requestAnimationFrame(tick) : 0;
  }
  function wake() { if (!frame) frame = requestAnimationFrame(tick); }
  function show(on) { ring.style.opacity = dot.style.opacity = on ? 1 : 0; }

  addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    // The poster viewer is a modal dialog in the top layer, so the cursor has to live inside it while it's open
    var host = document.querySelector("dialog[open]") || document.body;
    if (dot.parentNode !== host) { host.appendChild(ring); host.appendChild(dot); }

    x = e.clientX; y = e.clientY;
    var dt = Math.max(e.timeStamp - lastT, 1);
    var v = Math.hypot(x - lastX, y - lastY) / dt;
    // No speed or trail on the first move after load or after re-entering the window: there's no real previous position
    var fresh = lastT === 0;
    if (fresh) { rx = x; ry = y; }
    lastX = x; lastY = y; lastT = e.timeStamp;
    if (!reduce.matches && !fresh && dt < 100) speed = Math.max(speed, v);

    hot = !!(e.target.closest && e.target.closest(CLICKABLE));
    place();
    show(true);
    wake();
  }, { passive: true });

  document.documentElement.addEventListener("pointerleave", function () { show(false); lastT = 0; });
})();
