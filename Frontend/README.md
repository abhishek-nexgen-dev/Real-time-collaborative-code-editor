# 🚀 Real-Time Collaborative Code Editor

A **distributed, real-time collaborative code editor** built using **React, Monaco Editor, Yjs (CRDT)**, and **Socket.IO**.
This system enables multiple users to edit the same codebase simultaneously with **low latency, strong consistency, and zero merge conflicts**.

---

## 📌 Table of Contents

* Overview
* Demo
* Features
* System Architecture
* Core Concepts (Deep Dive)
* Tech Stack
* Installation & Setup
* Usage
* Project Structure
* Data Flow
* Scalability Considerations
* TODO / Roadmap
* Known Issues
* Contributing
* License

---

## 🧾 Overview

This project implements a **collaborative editing system** similar to:

* Google Docs
* VS Code Live Share
* Replit Multiplayer

Unlike naive implementations, it uses **CRDT (Conflict-free Replicated Data Types)** via Yjs, ensuring:

* No overwrites
* No race conditions
* Eventual consistency across all clients

---

## 📺 Demo

🎥 Watch the implementation:
[https://youtu.be/Uf6PXnagtsg?si=pXbkRRgrP2NVr1xt](https://youtu.be/Uf6PXnagtsg?si=pXbkRRgrP2NVr1xt)

⏱️ Focus timestamp: **1:16**

---

## ✨ Features

### 🧑‍🤝‍🧑 Collaboration

* Real-time multi-user editing
* Shared editing session (room-based)
* Live user presence (name + color)

### ⚡ Performance

* Efficient diff-based updates (Yjs CRDT)
* Minimal network overhead
* Near-instant synchronization

### 💻 Developer Experience

* Monaco Editor (VS Code engine)
* Syntax highlighting
* Smooth editing experience

---

## 🏗️ System Architecture

```id="arch"
          ┌──────────────┐
          │   React App  │
          │ (Monaco UI)  │
          └──────┬───────┘
                 │
                 ▼
        ┌──────────────────┐
        │   Yjs Document   │
        │   (CRDT State)   │
        └────────┬─────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ SocketIO Provider    │
      │ (y-socket.io)        │
      └────────┬─────────────┘
               │ WebSocket
               ▼
      ┌──────────────────────┐
      │ Node.js + Socket.IO  │
      │ Yjs Sync Server      │
      └────────┬─────────────┘
               │
               ▼
        Other Connected Clients
```

---

## 🧠 Core Concepts (Deep Dive)

### 1. CRDT (Conflict-free Replicated Data Type)

CRDT ensures that:

* Multiple users can edit simultaneously
* No conflicts occur
* State converges automatically

👉 Example:

* User A types "Hello"
* User B types "World"

Final result:

```id="crdt"
Hello World
```

No overwriting. No merge conflicts.

---

### 2. Yjs Document

```js
const ydoc = new Y.Doc();
const yText = ydoc.getText('monaco');
```

* `ydoc` → Shared document
* `yText` → Shared text structure

This acts as the **single source of truth across all clients**.

---

### 3. Provider (Network Layer)

```js
const provider = new SocketIOProvider(
  'http://localhost:3000',
  'monaco-demo',
  ydoc
);
```

Responsibilities:

* Connects to server
* Syncs document state
* Handles reconnection

---

### 4. Monaco Binding

```js
new MonacoBinding(
  yText,
  editor.getModel(),
  new Set([editor]),
  provider.awareness
);
```

This binds:

```id="binding"
Editor ↔ Yjs ↔ Network ↔ Other Users
```

---

### 5. Awareness (User Presence)

```js
provider.awareness.setLocalStateField('user', {
  name: userName,
  color: randomColor
});
```

Used for:

* Active user list
* Cursor tracking (future)

---

## 🧰 Tech Stack

### Frontend

* React
* @monaco-editor/react
* Yjs
* y-monaco
* y-socket.io
* Tailwind CSS

### Backend

* Node.js
* Socket.IO
* y-socket.io server

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/collab-editor.git
cd collab-editor
```

---

### 2. Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

---

### 3. Start Servers

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
npm run dev
```

---

### 4. Open Application

```id="url"
http://localhost:5173/?userName=Abhishek
```

---

## ▶️ Usage

1. Enter your name
2. Join the editor
3. Share the URL with others
4. Start coding together in real-time

---

## 📁 Project Structure

```bash
.
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── styles/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── socket.config.mjs
│   │   └── app.mjs
```

---

## 🔄 Data Flow

1. User types in Monaco Editor
2. Change is applied to Yjs (`yText`)
3. Yjs generates update (CRDT diff)
4. Update sent via Socket.IO
5. Server broadcasts to all clients
6. Other clients apply update
7. Editors sync instantly

---

## 📈 Scalability Considerations

### Current Limitations

* Single server instance
* No persistence
* No horizontal scaling

### Improvements

* Redis adapter for Socket.IO
* Document persistence (MongoDB)
* Load balancing
* Room sharding

---

## 🚧 TODO / Roadmap

### 🔥 Core

* [ ] Dynamic room IDs
* [ ] Language switching
* [ ] Code execution (Docker sandbox)

### 👥 Collaboration

* [ ] Live cursors
* [ ] User avatars
* [ ] Chat system

### 💾 Persistence

* [ ] Save/load documents
* [ ] Version history

### 🔐 Security

* [ ] Authentication (JWT)
* [ ] Role-based access
* [ ] Private rooms

### 🚀 Deployment

* [ ] Docker setup
* [ ] AWS deployment
* [ ] CI/CD pipeline

### 🧠 Advanced

* [ ] AI code suggestions
* [ ] Code review system
* [ ] Pair programming mode

---

## 🐛 Known Issues

* No data persistence (data lost on refresh)
* No authentication
* Awareness cleanup may fail on abrupt disconnect

---

## 🤝 Contributing

Steps:

1. Fork repository
2. Create feature branch
3. Commit changes
4. Open Pull Request

---

## 📜 License

MIT License

---

## 👨‍💻 Author

**Abhishek Gupta**
MERN Stack Developer | Real-Time Systems Builder

