# Curcumin-Drug Interaction Checker (Prototype)

Local prototype for checking Curcumin (Turmeric) drug-interaction risk. The dataset
covers 104 antineoplastic agents, transcribed from a user-provided reference figure,
surfaced through a "Quick Check" widget showing a traffic light, signal bar, and
confidence gauge.

**This is a prototype.** Interaction ratings are transcribed from a single reference
figure and have not been independently verified against primary literature.

## Run locally

```bash
# 1. Start Postgres
docker-compose up -d

# 2. Backend
cd server
cp .env.example .env
npm install
npm run seed   # loads data/curcumin_trafficlight_data.xlsx
npm run dev    # http://localhost:3050

# 3. Frontend (new terminal)
cd client
npm install
npm run dev    # http://localhost:5173, calls the API directly at http://localhost:3050
```

## Data

`data/curcumin_trafficlight_data.xlsx` is the single source of truth for seed data.
Edit it and re-run `npm run seed` (from `server/`) to reload — no code changes needed.
