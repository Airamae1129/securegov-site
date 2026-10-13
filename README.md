# SecureGov — Demo Site

Public demo landing page for **SecureGov** by CyberHealth: AI-powered governance
automation for policies, risks, controls and evidence, for businesses operating in
Europe. All product data shown on the site is fictional.

## Stack

```
securegov-demo-site/
  backend/   FastAPI + Motor (async MongoDB) + Pydantic v2
  frontend/  Vite + React 19 + TypeScript + Tailwind v4
  tests/     Playwright end-to-end workspace
  render.yaml  Render Blueprint (API + static site)
```

The frontend always calls relative `/api/*` paths. In development Vite proxies them
to the backend on port 8001; on Render the static site rewrites them to the API
service (see `render.yaml`).

## Run locally

Requirements: Python 3.12 and Node 22+. MongoDB is optional — `mongomock://` gives an
in-memory database that resets whenever the backend restarts.

**Backend**

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate        # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Copy `backend/.env.example` to `backend/.env` and fill in the values (that file is
git-ignored). Then:

```bash
uvicorn server:app --host 127.0.0.1 --port 8001 --reload
```

**Frontend**

```bash
cd frontend
npm install
npm run dev                   # http://localhost:3000
```

## Admin side

Staff sign in at **`/admin`** with an email and password. The first administrator is
created on startup from `ADMIN_EMAIL` / `ADMIN_PASSWORD` while no staff accounts exist;
after that, admins add and manage staff under **Users**.

- **Dashboard** — waiting/answered counts and messages received over the last 14 days.
- **Messages** — one inbox for the "Book a live demo" contact form and the SecureGov
  Assistant "talk to a person" chat. Replying to a chat message shows the answer in the
  visitor's chat window (with an unread badge on the chat button); contact-form replies
  are kept as notes, with an Email button to reach the visitor.
- **Users** (admins only) — add staff, set Admin/Editor roles, reset passwords,
  deactivate or delete accounts. Editors can answer messages but not manage staff.
- **My account** — change your own password.

Sessions are an httpOnly cookie that lasts 12 hours. Resetting a password or changing a
role signs that person out everywhere.

## API

| Method | Path                                   | Purpose                                         |
| ------ | -------------------------------------- | ----------------------------------------------- |
| GET    | `/api/`                                | Health check                                    |
| POST   | `/api/demo-requests`                   | "Book a live demo" form                         |
| POST   | `/api/support-messages`                | Assistant "talk to a person" form               |
| GET    | `/api/support-messages/{id}/thread`    | Visitor's own conversation (needs its token)    |
| POST   | `/api/auth/login` · `/logout`          | Staff sign-in / sign-out                        |
| GET    | `/api/auth/me`                         | Signed-in staff member                          |
| POST   | `/api/auth/password`                   | Change own password                             |
| GET    | `/api/admin/stats`                     | Dashboard numbers (staff only)                  |
| GET    | `/api/admin/messages`                  | Unified inbox (staff only)                      |
| POST   | `/api/admin/messages/{source}/{id}/reply` | Reply to a message (staff only)              |
| PATCH  | `/api/admin/messages/{source}/{id}`    | Mark answered / reopen (staff only)             |
| *      | `/api/admin/users…`                    | Staff accounts (admins only)                    |

Backend tests run against the live local server: `cd backend && python -m pytest`.

## Deploy (Render)

1. Create a free MongoDB Atlas cluster, a database user, and allow access from
   `0.0.0.0/0`. Copy the connection string.
2. In Render: **New → Blueprint**, pick this repository. When prompted, paste the
   connection string as `MONGO_URL`, and set `ADMIN_EMAIL` / `ADMIN_PASSWORD` for the
   first administrator. `JWT_SECRET` is generated for you.
3. If Render gives the API a URL other than `https://securegov-api.onrender.com`,
   update the `/api/*` rewrite destination in `render.yaml`.

Every push to `main` redeploys both services.

## Editing content

Most copy — modules, features, use cases, security points, pricing, roadmap and
the support chat FAQs — lives in `frontend/src/content.ts`. The overview video and
poster are in `frontend/public/video/`.
