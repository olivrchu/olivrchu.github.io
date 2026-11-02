/* Light / Dark toggle in the header. The page starts in the theme for the visitor's time of day (sun.js:
   light between their sunrise and sunset, dark otherwise). A click switches it for the rest of this visit;
   the next visit follows the sun again. The button is a "Dark mode" switch: pressed means dark. */
(function () {
  var root = document.documentElement;
  var btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  var system = matchMedia("(prefers-color-scheme: dark)");
  try { localStorage.removeItem("theme"); } catch (e) {} // an older version remembered the choice forever

  function current() { return root.dataset.theme || (system.matches ? "dark" : "light"); }
  function label() { btn.setAttribute("aria-pressed", current() === "dark" ? "true" : "false"); }

  btn.hidden = false;
  label();
  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { sessionStorage.setItem("theme", next); } catch (e) {}
    label();
  });
  root.addEventListener("themechange", label); // sun.js switched at sunrise or sunset
  system.addEventListener("change", label);
})();
