# Smit Patel — Portfolio & Resume (`aboutme`)

Personal developer portfolio and downloadable technical resume for **Smit Patel** (*Full Stack & Applied AI Software Engineer*), deployed via **GitHub Pages** at:

- **Live Portfolio:** https://smit999.github.io/aboutme/
- **Direct PDF Resume:** https://smit999.github.io/aboutme/downloads/smit_patel.pdf
- **Direct DOCX Resume:** https://smit999.github.io/aboutme/downloads/SMIT_PATEL.docx

## Architecture & Highlights

- **Zero-Fragility Static Stack:** Pure semantic HTML5, modern CSS custom-property theming (Dark/Light mode), and dependency-free JavaScript—eliminating Ruby/Jekyll gem breakage in CI.
- **Subpath-Safe Asset Resolution:** All local assets and resume downloads use relative `./downloads/...` and `./assets/...` paths paired with `.nojekyll`, guaranteeing zero `404` errors whether served under GitHub Project Pages (`/aboutme/`), a custom domain (`/`), or local preview.
- **Automated Deployment & Verification:** Pushing to `main` runs `.github/workflows/github-pages.yml`, validating that both PDF and DOCX resume binaries exist and contain no broken root-relative links before publishing cleanly to `gh-pages`.

## Repository Structure

```text
.
├── .github/workflows/
│   └── github-pages.yml      # Validates static assets & deploys to gh-pages
├── assets/
│   ├── css/styles.css        # Responsive Dark/Light design system
│   ├── js/main.js            # Theme toggle, scroll-spy, skill filter & copy email
│   └── favicon.svg           # Vector monogram icon
├── downloads/
│   ├── smit_patel.pdf        # ATS-optimized PDF resume
│   └── SMIT_PATEL.docx       # ATS-optimized Word (.docx) resume
├── .nojekyll                 # Bypasses Jekyll processing on GitHub Pages
├── about_me.md               # Markdown source of resume content
├── index.html                # Main portfolio application
└── README.md
```

## Local Preview

Serve the repository under a subpath matching GitHub Project Pages (`/aboutme/`) or directly at root:

```bash
python3 -m http.server 8000
# Open http://localhost:8000/
```
