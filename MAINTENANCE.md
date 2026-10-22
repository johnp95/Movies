# Monthly Maintenance

A checklist to run once a month (about 20–30 minutes). Ubuntu security patches
install automatically via `unattended-upgrades`; this covers everything else.

Server commands assume you're logged in as `john`, inside `~/movies`, with the
`dcp` alias set up (`alias dcp='docker compose -f docker-compose.prod.yml'`).

```bash
ssh john@<droplet-ip>
cd ~/movies
```

---

## 1. Update app packages (on your PC, on `dev`)

Versions in `backend/requirements.txt` are pinned, so nothing changes until you
edit them. Every update goes through a PR so CI tests it before it deploys.

### Python

```powershell
cd backend
pip list --outdated
```

- Bump the version numbers in `requirements.txt` for anything you want to update.
- Read the release notes before a **major** version jump (e.g. Django 6 → 7).

### JavaScript

```powershell
cd frontend
npm outdated
npm update
npm audit
```

- `npm update` stays within the ranges in `package.json` (bug fixes and minor versions).
- Major versions (red in `npm outdated`) need `npm install <package>@latest`, one at a time.
- If an install fails with `ERESOLVE`, a dependency doesn't support the new
  version yet. Skip it and try again next month. Don't use `--force` or
  `--legacy-peer-deps`.

> **ESLint 10 is on hold.** `eslint-plugin-react` only supports ESLint 9 so far.
> Check with `npm view eslint-plugin-react peerDependencies`; once its `eslint`
> range includes `^10`, upgrade `eslint`, `@eslint/js` and the plugins together.

### Ship it

```powershell
npm run lint
npm run build
```

Test the app locally, then commit to `dev` → push → open a PR to `main` → merge
when the checks are green. The deploy runs automatically.

---

## 2. Refresh base images (on the server)

The Dockerfiles build on `python:3.13-slim-trixie`, `node:24-alpine` and
`caddy:2.10-alpine`, and the database runs `postgres:17`. Docker keeps using its
cached copies until told to check for newer ones, so normal deploys never pick
up their security fixes.

```bash
~/backup-db.sh
dcp build --pull
dcp pull db
dcp up -d
dcp ps
```

- `build --pull` rebuilds our images on top of freshly downloaded base images.
- `pull db` fetches the newest Postgres **17.x** (same major version, so the data is compatible).
- Afterwards, check that https://johnpennyman.com/api/health/ shows `{"ok": true}`.

---

## 3. Server health (on the server)

### Disk space

```bash
df -h /
docker system df
```

Keep disk usage well under 80%. To reclaim space:

```bash
docker image prune -a -f
docker builder prune -f
```

- `image prune -a` removes images no container uses (old builds).
- `builder prune` clears Docker's build cache, usually the biggest consumer.

### OS updates

```bash
sudo apt update && sudo apt upgrade -y
ls /var/run/reboot-required
```

If that file exists, run `sudo reboot`. The containers restart on their own.

### Backups

```bash
tail -5 ~/backups/backup.log
ls -lh ~/backups
```

There should be recent `backup OK` lines and about 14 dump files. Then copy them
to your PC (run this in PowerShell on the PC, not on the server):

```powershell
scp john@<droplet-ip>:~/backups/*.dump $HOME\Documents\movie-backups\
```

### Errors in the last 30 days

```bash
dcp logs --since 720h backend | grep '" 500 '
```

No output is the goal. Any line here is a request where Django crashed.

---

## 4. Dashboards

- **UptimeRobot**: any downtime this month?
- **DigitalOcean → droplet → Insights**: are CPU, memory or disk trending upward?
- **GitHub → Security tab**: any alerts about our dependencies?

---

## Once a year

Check that nothing is approaching end of life:

| Component | Supported until |
| --- | --- |
| Ubuntu 24.04 LTS | 2029 |
| Python 3.13 | 2029 |
| Node 24 | 2028 |
| Postgres 17 | 2029 |

Upgrading Postgres to a new **major** version (e.g. 17 → 18) is not just a tag
change: it needs a full dump and restore into a fresh volume.
