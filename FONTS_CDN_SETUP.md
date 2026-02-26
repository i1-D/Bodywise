# Fonts via jsDelivr (same repo)

This project loads custom fonts from the **same repo** (Bodywise) via jsDelivr CDN.

## 1. Font files in this repo

Place font files in the **`fonts/`** directory and commit them:

- `edosz.woff2`, `edosz.woff`
- `moon_walk.woff2`, `moon_walk.woff`
- `DejaVuSans-Bold.woff2`, `DejaVuSans-Bold.woff`
- `Dortmund-ExtraBold.woff2`, `Dortmund-ExtraBold.woff`

## 2. Current base URL

`https://cdn.jsdelivr.net/gh/i1-D/Bodywise@main/fonts/`

- **i1-D** — GitHub username (change if different)
- **Bodywise** — this repo name (use exact name, including case, if different)
- **main** — branch to serve from (e.g. `main` or `master`)

Example font URL:  
`https://cdn.jsdelivr.net/gh/i1-D/Bodywise@main/fonts/edosz.woff2`

## 3. After pushing

jsDelivr caches from GitHub; new commits on `main` are usually available within a few minutes. For immutable URLs, use a release tag instead of `@main` (e.g. `@v1.0.0`) and update the project when you cut a new release.
