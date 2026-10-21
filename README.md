# olivrchu.github.io

A static site: `index.html` (home, with the CV further down the page) and `cv.html` (the CV on its own page). No build step, no frameworks.

## Files

- `index.html` — home page and CV
- `cv.html` — CV as a separate page (not linked from the menu; share the link directly, or use it for printing)
- `assets/css/style.css` — all styling (colours, font and type sizes are at the top, under `:root`)
- `assets/fonts/` — Schibsted Grotesk, self-hosted
- `assets/img/` — the three posters and the favicon

## Editing on GitHub

Open a file, click the pencil icon, edit, then "Commit changes". The site updates about a minute later.

- **A CV entry:** copy one `<li class="entry">…</li>` block and change the text. The CV lives in both `index.html` and `cv.html`, so change both.
- **A poster:** add the image to `assets/img/`, then copy one `<figure class="poster">…</figure>` block in `index.html`.
