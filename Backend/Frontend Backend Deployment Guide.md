## Running, Rebuilding, and Deploying Frontend + Backend (Using Nodemon)

This project runs the frontend and backend together through a single backend server.

* **Frontend** → Built for production
* **Backend** → Serves APIs + frontend static files
* **Nodemon** → Used to restart backend automatically during development

---

# Initial Setup

## 1. Install Dependencies

### Frontend

```bash id="4r2mks"
cd frontend
pnpm install
```

### Backend

```bash id="8q7xva"
cd backend
pnpm install
```

---

# Build Frontend

## 2. Create Production Build

Inside frontend:

```bash id="w1d9pl"
pnpm run build
```

This generates:

```bash id="m5k8cu"
dist/
```

This contains:

* HTML
* CSS
* JavaScript bundles
* Static assets

---

# Copy Build to Backend

## 3. Move frontend build into backend

Copy:

```bash id="j3n6tb"
frontend/dist/
```

into:

```bash id="p7v4rd"
backend/public/
```

Command:

```bash id="u2z5hy"
cp -r frontend/dist/* backend/public/
```

---

# Configure Express

## 4. Serve Static Files

In `app.mjs`:

```javascript id="y8c1fg"
import express from 'express';

const app = express();

// Serve frontend build files
app.use(express.static('public'));
```

---

## Optional (Recommended for React Router / SPA)

```javascript id="s6b9qn"
import express from 'express';
import path from 'path';

const app = express();

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});
```

This prevents:

```bash id="t4l2wo"
/dashboard → 404
/profile → 404
```

---

# Run Backend

## 5. Start Backend

Using nodemon:

```bash id="f7h3je"
pnpm run dev
```

Example script:

```json id="k9m2rx"
"scripts": {
  "dev": "nodemon app.mjs"
}
```

---

## 6. Open Application

```bash id="d5q8vc"
http://localhost:3000
```

Now the backend serves:

* APIs
* Frontend static files
* Both together

---

# First Deployment Flow

```bash id="n8y1zb"
cd frontend
pnpm install
pnpm run build

cp -r dist/* ../backend/public/

cd ../backend
pnpm install
pnpm run dev
```

---

# After Making Changes

## If You Change Frontend Code

Examples:

* UI changes
* Components
* Pages
* Styles
* Frontend logic

---

## Rebuild:

```bash id="r3w7mu"
pnpm run build
```

---

## Replace old build:

```bash id="c6v9ka"
rm -rf backend/public/*
cp -r frontend/dist/* backend/public/
```

---

## Restart backend

Restart nodemon:

```bash id="x2p5dn"
pnpm run dev
```

(Or stop and rerun if already running.)

---

# If You Change Backend Code

Examples:

* Routes
* Controllers
* Middleware
* Database logic

Nodemon usually auto-restarts automatically.

If needed manually restart:

```bash id="h4j8ls"
pnpm run dev
```

---

# If You Change Both

```bash id="b1m6qt"
pnpm run build

cp -r dist/* ../backend/public/

pnpm run dev
```

---

# After Pulling New Code

```bash id="v7k2ep"
git pull origin main
```

Install dependencies if needed:

```bash id="z9n4wf"
pnpm install
```

Rebuild frontend:

```bash id="u5r3cx"
pnpm run build
```

Update backend public:

```bash id="q8t1jy"
cp -r dist/* ../backend/public/
```

Run backend:

```bash id="e6p7vm"
pnpm run dev
```

---

# Rules

## Frontend changed?

Required:

```bash id="g2d9ak"
pnpm run build
```

---

## Backend changed?

Nodemon auto-restarts.

Or manually:

```bash id="l5x8fr"
pnpm run dev
```

---

## package.json changed?

Required:

```bash id="m3u6qb"
pnpm install
```

---

# Typical Workflow

```bash id="s1c4vn"
Code Change
↓
Build Frontend
↓
Copy dist → public
↓
Run/Restart Backend
↓
Deploy Live
```

---

# Common Mistake

## Wrong

Changing frontend code and only restarting backend:

```bash id="p6w2lh"
pnpm run dev
```

Frontend changes may not appear.

---

## Correct

```bash id="y4t7ko"
pnpm run build

cp -r dist/* ../backend/public/

pnpm run dev
```

---

# Optional Automation

Add deploy script:

```json id="j8r5md"
"scripts": {
  "deploy": "pnpm run build && cp -r dist/* ../backend/public/",
  "dev": "nodemon app.mjs"
}
```

Run:

```bash id="f9q3xu"
pnpm run deploy
pnpm run dev
```

---

# Final Architecture

```bash id="k1n7zs"
Browser
   ↓
Express Backend
   ↓
├── API Routes
└── Serves Frontend (public/)
```

One backend server runs everything together.
Frontend is served from `public/`, and backend runs with **nodemon**.
