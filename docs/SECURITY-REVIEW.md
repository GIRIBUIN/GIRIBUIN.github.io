# Dependency and deployment review — 2026-10-29

## npm

The local `npm audit --json` reports supplied during this review changed from
6 affected packages (4 low, 1 moderate, 1 high) to 3 low packages.
The updated lockfile and installed dependency tree were checked locally.

| Package | Before | After | Result |
| --- | --- | --- | --- |
| Astro | 7.3.2 | 7.4.4 | View Transitions CSS injection advisory resolved; this site does not use View Transitions. |
| fast-uri | 3.1.8 | 3.1.9 | URI normalization advisories resolved; used through the YAML language server and `@astrojs/check`. |
| undici | 8.11.2 | 8.12.3 | HTTP/TLS/cache/DoS advisories resolved; used through Astro's unifont dependency. |
| KaTeX | 0.16.47 | 0.16.47 | Low advisory remains, also reported through Mermaid and mermaid-isomorphic. |

The remaining three warnings share one root advisory:
[GHSA-238p-pmpm-9mq7](https://github.com/advisories/GHSA-238p-pmpm-9mq7).
It requires existing prototype pollution or attacker-controlled renderer option
prototypes together with attacker-controlled math. KaTeX does not itself introduce
the prototype pollution. Version 0.18.2 fixes it, but the installed
mermaid-isomorphic 3.1.0 and Mermaid 11.17.2 require KaTeX 0.16.x.

No out-of-range override or `npm audit fix --force` was applied. The current
pipeline renders trusted repository Markdown into static SVG during the build,
with Mermaid `securityLevel: strict` and `htmlLabels: false`; it accepts no public
diagram input and does not ship the Mermaid/KaTeX JavaScript renderer to visitors.
The low warnings remain tracked until compatible upstream dependencies are
available. Reassess before accepting external Markdown, math, or renderer options.

Advisory references:

- [Astro CSS injection](https://github.com/advisories/GHSA-mpr7-6m5w-76rw)
- [fast-uri scheme spoofing](https://github.com/advisories/GHSA-w74x-v6f9-j3xg)
- [undici content-encoding DoS](https://github.com/advisories/GHSA-xjj6-f33q-929c)

## GitHub Actions

- All five directly referenced actions retain their existing major versions and
  are pinned to the full commit SHA returned by their official repository tag.
- `actions/checkout` uses `persist-credentials: false`; later package installation
  and build steps do not need authenticated Git operations.
- Playwright browser installation uses `npx --no-install` so it resolves the
  lockfile-installed CLI rather than downloading a missing CLI implicitly.
- The existing least-privilege split remains: read-only build permissions and
  Pages/OIDC write permissions only in the deployment job.
- Build/deploy jobs have 15/10-minute limits.

SHA pins need deliberate updates when upstream fixes are released. This review
does not change repository-level protection settings or deploy the site.
