# CareerSage_App

Minimal React + Vite + TypeScript scaffold implementing Phase 1 (User Input — multi-step form).
The project structure is intentionally simple so you can later drop backend files into the correct folders and integrate seamlessly.

Extracted /mnt/data/components.zip into src/components/original/

## Features included
- Multi-step form: Personal -> Skills -> Interests -> Review & Confirm
- Global form state via React Context
- Simple client-side validation
- Place for original components from components.zip are extracted to `src/components/original/` if provided

## How to run

1. Extract the zip and open the folder in VS Code:
```bash
cd CareerSage_App
npm install
npm run dev
```

2. The app will be available at the Vite dev server (default http://localhost:5173)

## Suggested future integration points
- Add a backend folder `backend/` for Node/Python API files
- Add integration to Gemini Pro in `src/services/gemini.ts` and secure keys via `.env`
- Add persistent storage at `server/` or cloud DB

