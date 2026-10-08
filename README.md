# Alice × Kixly — Manager Control Center

A private, manager-only operations dashboard for team records, tasks, schedules, reviews, notes, and history. Team members are records—not accounts. Only authorized Managers can sign in or create additional Manager accounts.

## Run locally

```bash
npm install
```

Create the first Manager account once, before starting the app. Enter a valid email and a unique password of at least 12 characters; the password is hidden as you type and is never stored in this repository:

```bash
read -r -p "Manager email: " MANAGER_EMAIL
read -r -s -p "Manager password (12+ characters): " MANAGER_PASSWORD
printf '\n'
MANAGER_EMAIL="$MANAGER_EMAIL" MANAGER_PASSWORD="$MANAGER_PASSWORD" npm run bootstrap-manager
unset MANAGER_EMAIL MANAGER_PASSWORD
```

Then start the app:

```bash
npm run dev
```

The Vite app runs on `http://localhost:5173` and proxies API requests to the Express server on port `3001`. For a production-style run, use `npm run build` followed by `npm start`.

Initial Manager setup is refused if a Manager account already exists. Further Manager accounts can only be created from **Settings** by an authenticated Manager. There is no public sign-up and no team-member login flow.

## GitHub Codespaces

The repository includes a Codespaces devcontainer. Create a Codespace on the branch you want to run; the dashboard starts automatically and its forwarded web port is private to signed-in GitHub users. In the Codespace terminal, run the first-Manager commands above once, then open port `5173` from the **Ports** panel.

Codespaces may stop after inactivity, and deleting the Codespace deletes its local dashboard data. Back up important records and attachments before deleting it. Free usage is subject to the monthly allowance and billing settings on your personal GitHub account; choose a 2-core machine and keep the idle timeout short to limit usage.

## Data and security notes

- Records are saved to `data/manager-control-center.json` (or `DATA_DIR` if set); the directory is intentionally excluded from Git. Back it up as part of your deployment.
- Sessions use an HTTP-only, SameSite-strict cookie and expire after 12 hours. Login attempts are rate-limited. The production server marks the cookie Secure when `NODE_ENV=production`.
- The JSON store is intended for a single-process deployment or a local/demo installation. For a multi-instance production deployment, replace it with a managed database and shared session store.
- The UI offers CSV, spreadsheet-compatible Excel, and browser-print/PDF exports. Task attachments are stored in the private data directory, limited to 10 MB per file, blocked from direct static access, and downloadable only through an authenticated Manager session.
- Alice branding references the site favicon with an infinity-wordmark fallback; the Kixly logo references the official Kixly brand asset.

## Implemented areas

Dashboard and alerts, team database and profiles, the four-column task board and history, projects, daily work logs, event schedule and calendar, meeting records, performance reviews and department summaries, leave history, issues, follow-ups, private manager notes, filtered reports, activity history, audit logging, and private task attachments.
