# Chatrly

The chatrly server provides endpoints to authenticate users, manage conversations and messages, and handle friendships. Use this collection to explore authentication flows (login, register, logout, refresh), conversation/message operations (create, list, get, delete), and friend/friend-request management.

## Tech Stack
- Node.js / Express
- TypeScript
- PostgreSQL / Drizzle ORM
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 16 


### Local Development

Clone the repo to your local machine
```bash
git clone https://github.com/mouzaa00/chatrly-server
cd chartly-server
pnpm install
```

Spin up a postgres instance with Docker

```bash
# Start the database in detached mode
docker compose up -d

# Veiw logs
docker compose logs

# Stop the database (data persists in the volume)
docker compose down

# Stop the database and delete the volume/data
docker compose down -v
```

Run migrations

```bash
pnpm run db:migrate
```

Run the server

```bash
pnpm run dev
```

### Environment Variables
```bash
cp .env.example .env
```

## API Documentation
https://documenter.getpostman.com/view/27668806/2sBXcHgySs

