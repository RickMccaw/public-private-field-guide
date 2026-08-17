# Connect `publicprivate.www.rickmccawley.com`

The repository is public and already includes a `CNAME` file for the requested hostname. The remaining setup needs access to the `rickmccawley.com` DNS account and GitHub Pages settings.

## 1. Enable GitHub Pages

Open the repository’s **Settings → Pages** panel. Under **Build and deployment**, select **Deploy from a branch**, choose `main`, then choose the `/docs` folder and save. GitHub will publish the static website at its project Pages address.

## 2. Add the DNS record

At the DNS provider for `rickmccawley.com`, create the following CNAME record:

| DNS field | Value |
| --- | --- |
| Type | `CNAME` |
| Host / Name | `publicprivate.www` |
| Target / Value | `rickmccaw.github.io` |
| TTL | Provider default |

Do not add both a CNAME and another record type for the same `publicprivate.www` host label.

## 3. Confirm the domain in GitHub

Return to **Settings → Pages**, enter `publicprivate.www.rickmccawley.com` in **Custom domain**, save, and wait for DNS validation. When GitHub makes the **Enforce HTTPS** option available, enable it.

## Maintenance

Edit source files, then run `GITHUB_ACTIONS=true pnpm build`, replace `docs/` with the latest `dist/public/`, commit, and push to `main`. GitHub Pages will serve the updated `docs/` contents.
