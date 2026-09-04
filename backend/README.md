This folder contains a Docker Compose configuration to run a MongoDB instance for local development.
Quick start
1. Copy example env and set credentials:
```bash
cp .env.example .env
# Edit .env to set your own values if desired
```

2. Start the container:
```bash
docker compose up -d
```

3. Stop and remove containers:
```bash
docker compose down -v
```

Files created
- `docker-compose.yml`: Compose config for MongoDB
- `.env.example`: Example environment variables
- `initdb/init.js`: Optional init script run on first startup
