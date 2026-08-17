# Offline Development and Maintenance

This project is a **React 19 + Vite + Tailwind 4** single-page classroom reader. It includes all 26 chapter transcripts, source links, local-browser response storage, and client-side PDF export.

## Start locally

Install Node.js 22 and pnpm. From the project folder, run:

```bash
corepack enable
pnpm install
pnpm dev
```

The local reader opens at the URL printed by Vite. Run `pnpm check` before committing changes, and run `pnpm build` to create the production site in `dist/public`.

## Where to edit content

The complete text is stored in `client/src/data/courseContent.json`. Each chapter contains its transcript, chapter questions, and citation links. The public-image mapping and reader interface are in `client/src/pages/Home.tsx`. Global typography, print behavior, and dossier rhythm are defined in `client/src/index.css`.

## Asset handling

For the GitHub/offline export, all visual assets are included in `client/public/media/`. Those files are referenced through Vite’s base URL so they work both in local development and on GitHub Pages. Do not delete the `client/public/CNAME` file if you intend to use `publicprivate.www.rickmccawley.com`.

## Classroom-writing workflow

Student answers are intentionally stored only in the learner’s browser using local storage. The “Download response paper PDF” control compiles answered prompts and a source appendix locally on the device. No student responses are sent to a server.

## GitHub Pages

The public repository contains a static production build in `docs/`, allowing GitHub Pages to deploy without any server or secret. In the GitHub repository, choose **Settings → Pages → Build and deployment → Deploy from a branch**, then select `main` and `/docs`.

The build includes a `CNAME` file declaring `publicprivate.www.rickmccawley.com`. GitHub will show the exact DNS verification status once Pages is enabled. For future changes, run `GITHUB_ACTIONS=true pnpm build`, replace the contents of `docs/` with `dist/public/`, commit, and push.
