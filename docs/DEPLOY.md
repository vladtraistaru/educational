# Deploy

The app runs as a Docker container on the Hetzner server (`traistaru.net`) at
**https://educational.traistaru.net** and **https://ecole.traistaru.net** (two proxy hosts, same container).

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
| `.env.example` | The required env keys, with empty values (the real `.env` is git-ignored) |
| `.github/workflows/build.yml` | Builds and pushes to GHCR on `main` |

`next.config.ts` sets `output: "standalone"` — required by the Dockerfile.

## Runtime environment

`compose.yml` reads `.env` **next to it in this repo**, on the machine running
`docker compose`. With `DOCKER_HOST=ssh://…` the CLI runs locally, so a copy of the
file on the server is *ignored* at deploy time — the local one is what ships.

Never write these by hand into a file. Set them with the script that owns app
secrets (it prompts for each value with the typing hidden, writes the local `.env`
at mode 600, and mirrors a backup copy to `/opt/apps/educational/.env`):

```sh
~/dev/traistaru.net/scripts/app-secrets.sh educational RESEND_API_KEY FEEDBACK_EMAIL
~/dev/traistaru.net/scripts/app-secrets.sh educational --show      # key names only
~/dev/traistaru.net/scripts/app-secrets.sh educational --pull      # restore from server
~/dev/traistaru.net/scripts/app-secrets.sh educational --restart   # set and redeploy
```

Required keys, both used by `app/actions/feedback.ts` and documented with empty
values in `.env.example`:

| Key | Value |
|-----|-------|
| `RESEND_API_KEY` | resend.com → API Keys (shown once) |
| `FEEDBACK_EMAIL` | inbox that feedback is sent to |

An env change needs `docker compose up -d`, not a restart: a plain restart keeps the
old environment.

## First deploy, and any compose or env change

From this repo on your laptop:

```sh
DOCKER_HOST=ssh://vlad@178.105.173.134 docker compose up -d
```

Then once, in `~/dev/traistaru.net`:

```sh
scripts/npm-proxy.sh educational.traistaru.net educational 3000
scripts/npm-proxy.sh ecole.traistaru.net educational 3000
```

and add a row for the app to the inventory in that repo's `docs/SERVER.md`, plus a
line in its `docs/CHANGELOG.md` — the server's contents must stay knowable from that
repo.

Because the GHCR image is private, Watchtower needs a GitHub PAT with
`read:packages` in `/opt/apps/watchtower/.env` on the server — see
`~/dev/traistaru.net/docs/APP_DEPLOY.md`.
