# Portfolio (Pure HTML5 Remake)

This folder is a **framework-free** portfolio remake using only:
- HTML5
- CSS3
- Vanilla JavaScript

It’s designed to work perfectly on **GitHub Pages** (no build step, no Node).

---

## Quick start (local)

Just open `index.html` in your browser.

---

## GitHub Pages deploy

1. Create a repo (example: `portfolio-html`).
2. Upload all files from this folder.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main** (or master) and **/(root)**
5. Save. Your site will be live in a minute.

---

## Customize your email, GitHub, LinkedIn, CV

Open `js/script.js` and edit the `CONFIG` values:

- `emailTo` (your email)
- `githubUrl`
- `linkedinUrl`
- `cvPath`

> The contact form uses **mailto** so it works on GitHub Pages without a backend.

---

## Enable CV preview

Add your CV PDF at:

```
assets/Muhammed_Riyas_CV.pdf
```

Then refresh the site and click **Preview CV**.

---

## SEO

Each page already includes:
- Title + meta description
- Open Graph tags
- Twitter card tag

Update the meta descriptions if you want more targeted keywords.
