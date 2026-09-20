# Deploy

The app runs as a Docker container on the Hetzner server (`traistaru.net`) at
**https://educational.traistaru.net**.

Deploys are **pull-based**: pushing to `main` runs `.github/workflows/build.yml`,
which builds the image and pushes `ghcr.io/vladtraistaru/educational:latest`.
Watchtower on the server polls GHCR every 5 minutes and restarts the container when
the tag changes. No SSH key or server credential is stored in GitHub.

Watchtower applies **new images only** — changes to `compose.yml` (env vars, volumes,
networks) must be applied by hand.

## Files

| File | Role |
|------|------|
| `Dockerfile` | Multi-stage build; runs the Next.js `standalone` output as a non-root user on port 3000 |
| `compose.yml` | Service definition: `proxy` network, no published ports, Watchtower opt-in label |
| `.github/workflows/build.yml` | Builds and pushes to GHCR on `main` |

`next.config.ts` sets `output: "standalone"` — required by the Dockerfile.

## Runtime environment

`compose.yml` reads `.env` **on the server** (`/opt/apps/educational/.env`, never in
git). Required keys, both used by `app/actions/feedback.ts`:

```
RESEND_API_KEY=...
FEEDBACK_EMAIL=...
```

## First deploy, and any compose or env change

From this repo on your laptop:

```sh
DOCKER_HOST=ssh://vlad@178.105.173.134 docker compose up -d
```

Then once, in `~/dev/traistaru.net`:

```sh
scripts/npm-proxy.sh educational.traistaru.net educational 3000
```

and add a row for the app to the inventory in that repo's `docs/SERVER.md`.

Because the GHCR image is private, Watchtower needs a GitHub PAT with
`read:packages` in `/opt/apps/watchtower/.env` on the server — see
`~/dev/traistaru.net/docs/APP_DEPLOY.md`.
