# Kundaram Chandrakala Tuition Manager - PWA

This version is installable from a browser as an app on supported Android/iOS devices.

## Local

1. Copy `.env.example` to `.env`.
2. Fill in MongoDB and teacher credentials.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000`.

PWA installation requires HTTPS when deployed. `localhost` is also allowed for local development.

## Deploy

The included `render.yaml` is prepared for a Node.js web service. Set the environment variables in the hosting dashboard, especially `MONGODB_URI` and `SESSION_SECRET`.

## Important

The app's exam recordings currently use the server filesystem. On hosting platforms with ephemeral disks, recordings are not guaranteed to persist after restarts/redeploys. Use persistent/object storage for production recordings.

## Seed MongoDB with GitHub Actions

The repository includes `.github/workflows/seed.yml`.

1. In GitHub, open `Settings` → `Secrets and variables` → `Actions`.
2. Create a repository secret named `MONGODB_URI`.
3. Paste the MongoDB Atlas connection string as the secret value.
4. Open `Actions` → `Seed Tuition Database`.
5. Click `Run workflow` → `Run workflow`.

The workflow creates only missing default student accounts and does not overwrite existing student passwords.
