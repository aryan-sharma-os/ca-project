# Telemedicine NABH (MERN, JS)

A JS-only MERN telemedicine platform focused on rural healthcare access and NABH-aligned practices.

## Features

- JWT auth with roles: patient, doctor, admin
- Appointments scheduling (CRUD) with consent flag
- Real-time chat via Socket.IO
- WebRTC video consult using simple-peer (Socket.IO signaling)
- Prescriptions with PDF generation
- Audit logging (userId, action, timestamp, IP)
- Secure headers (helmet), rate limit, input validation
- PWA: manifest + service worker with offline shell caching
- Health endpoint and client health widget

## Quick Start

### 1) Set environment variables

Create `server/.env` from `server/.env.example` and `client/.env` from `client/.env.example`.

```
# server/.env
MONGO_URI=mongodb://localhost:27017/telemedicine
JWT_SECRET=replace-with-strong-secret
CORS_ORIGIN=http://localhost:5173
PORT=5000

# client/.env
VITE_API_URL=http://localhost:5000
```

### 2) Install dependencies

```bash
npm run install:all
npm install
```

### 3) Run both client + server (dev)

```bash
npm run dev
```

- Server: http://localhost:5000
- Client (Vite): http://localhost:5173

### 4) Build client

```bash
npm run build:client
```

### 5) Start server only

```bash
npm run start
```

## Video Call Testing

- Use two browsers (or devices) on the same network.
- Allow camera/microphone permissions.
- Create an appointment, then join the video room from both sides.

## Notes

- Replace placeholder favicon and review PWA manifest.
- For production, set strong `JWT_SECRET`, configure CORS, HTTPS, and a persistent MongoDB.
- Audit logs are stored in `AuditLog` collection.
