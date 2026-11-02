/* Cursor: a hollow white ring with a maroon dot at its centre, both exactly on the pointer.
   The dot grows inside the ring with how fast the mouse is moving, and shrinks back when it slows.
   Mouse and trackpad only: touch screens keep their normal behaviour. With reduced motion
   the dot keeps one size. If this script doesn't run, the CSS dot cursor is the fallback. */
(function () {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)");
  var CLICKABLE = "a, button, .poster-open, .viewer-img";

  var el = document.createElement("div");
  el.className = "cursor";
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = '<span class="cursor-ring"></span><span class="cursor-dot"></span>';
  var dot = el.lastChild;
  var MAX = 2.4;   // largest dot: 9px x 2.4 = about 22px, just inside the ring's 25px opening
  document.body.appendChild(el);
  document.documentElement.classList.add("has-cursor");

  var x = 0, y = 0, lastX = 0, lastY = 0, lastT = 0;
  var speed = 0;   // pointer speed in px per ms, decays every frame
  var scale = 1;   // current dot size, eased toward its target
  var hot = false; // over something clickable
  var frame = 0;

  function tick() {
    speed *= 0.88;
    var target = Math.min((hot ? 1.6 : 1) + speed * 0.6, MAX);
    scale += (target - scale) * 0.25;
    dot.style.transform = "scale(" + scale.toFixed(3) + ")";
    // Stop the loop once the dot has settled, so nothing runs while the mouse is still
    frame = (Math.abs(target - scale) > 0.002 || speed > 0.01) ? requestAnimationFrame(tick) : 0;
  }
  function wake() { if (!frame) frame = requestAnimationFrame(tick); }

  addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    // The poster viewer is a modal dialog in the top layer, so the cursor has to live inside it while it's open
    var host = document.querySelector("dialog[open]") || document.body;
    if (el.parentNode !== host) host.appendChild(el);

    x = e.clientX; y = e.clientY;
    var dt = Math.max(e.timeStamp - lastT, 1);
    var v = Math.hypot(x - lastX, y - lastY) / dt;
    // No speed on the first move after load or after re-entering the window: there's no real previous position
    var fresh = lastT === 0;
    lastX = x; lastY = y; lastT = e.timeStamp;
    if (!reduce.matches && !fresh && dt < 100) speed = Math.max(speed, v);

    el.style.transform = "translate(" + x + "px," + y + "px)";
    el.style.opacity = 1;
    hot = !!(e.target.closest && e.target.closest(CLICKABLE));
    wake();
  }, { passive: true });

  document.documentElement.addEventListener("pointerleave", function () { el.style.opacity = 0; lastT = 0; });
})();
