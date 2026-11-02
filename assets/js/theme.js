/* Light / Dark toggle in the header. The page starts in the system's mode; a click switches it and
   the choice is remembered on this device. The small script in <head> applies a saved choice before
   the page paints, so it never flashes the wrong colours. The button is a "Dark mode" switch: pressed means dark. */
(function () {
  var root = document.documentElement;
  var btn = document.querySelector(".theme-toggle");
  if (!btn) return;
  var system = matchMedia("(prefers-color-scheme: dark)");

  function current() { return root.dataset.theme || (system.matches ? "dark" : "light"); }
  function label() { btn.setAttribute("aria-pressed", current() === "dark" ? "true" : "false"); }

  btn.hidden = false;
  label();
  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    label();
  });
  system.addEventListener("change", label);
})();
