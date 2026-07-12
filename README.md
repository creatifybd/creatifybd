# CreatifyBD — Vite + React

This is the CreatifyBD marketing site converted from a static HTML page into a
Vite + React codebase, component-by-component, with the same look, layout and
scroll/hover interactions as the original.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

The production build is output to `dist/`.

## Project structure

```
index.html              Vite entry HTML (loads Google Fonts + /src/main.jsx)
src/
  main.jsx              React root
  App.jsx               Page assembly (imports every section)
  index.css             All global styles (ported 1:1 from the original <style> block)
  useSiteEffects.js      Hook that recreates the original vanilla-JS behaviors:
                          scroll-reveal animations, scroll progress bar,
                          magnetic buttons, tilt cards, hero chip parallax
  components/
    Header.jsx           Sticky nav with mega-menus
    Hero.jsx              Hero section
    Bottleneck.jsx         "Fix Your Social Media Bottleneck" feature + marquee strip
    Services.jsx           Services tile grid
    Pricing.jsx             Pricing tables (data-driven)
    Work.jsx                 Portfolio grid
    Process.jsx               8-step "How it works"
    Benefits.jsx                3 "why us" benefit blocks
    Trust.jsx                    Credibility stat block
    Testimonials.jsx              Client feedback cards
    CTA.jsx                        "Let's Work Together" contact section
    Footer.jsx                     Footer
```

## Notes

- All content/copy is unchanged from the original HTML file.
- Styling is unchanged — the entire original `<style>` block was moved into
  `src/index.css` as-is.
- The vanilla `<script>` behaviors (reveal-on-scroll, progress bar, magnetic
  buttons, tilt cards, hero parallax) were reimplemented as a single React
  hook (`useSiteEffects`) that attaches the same event listeners after mount.
