# Local Guruji backend

Python FastAPI + MongoDB Atlas/local MongoDB + Ollama. No seeded/static account exists. Use **Create an account**, enter your email and a password of at least 8 characters, then login.

## Run (project root, separate terminals)

```powershell
## Only needed when Atlas credentials are unavailable:
powershell -ExecutionPolicy Bypass -File ./start-mongo.ps1
```

```powershell
backend/.venv/Scripts/python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Open http://127.0.0.1:8000 or use `npm.cmd start` for Vite development. Rebuild UI with `npm.cmd run build`. Ollama must be running for AI replies (`ollama serve`, model `qwen3:1.7b`).

`start-backend.ps1` reads `%USERPROFILE%/Downloads/atlas-credentials.env` directly through `GURUJI_ENV_FILE`; secrets are not copied into the project. Backend falls back to `backend/.env` and local MongoDB if that file is absent. Install requirements with `backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt`.

Database `guruji` contains `users`, `sessions`, `assessments` and `attempts`. Profiles, generated papers and scored attempts persist across login/logout. The optional local Mongo binaries/data live in `%LOCALAPPDATA%/GurujiMongo/`; local Mongo binds only to 127.0.0.1 and must not be exposed.

Passwords: random salt per account, PBKDF2-SHA256 with 600,000 iterations. Sessions: hashed tokens, HttpOnly SameSite=Strict cookie, eight-hour server expiry and Mongo TTL cleanup. Set COOKIE_SECURE=true for HTTPS. Email verification, password reset and Google OAuth are not implemented.

Assessment generation has no free-text prompt in the UI. The backend builds a fixed structured prompt from the saved exam/class and subject and waits until Ollama returns exactly five validated question types: single-choice, multi-select, fill-blank, numeric and true/false. Validation failures are regenerated internally instead of being returned to the browser. Answer keys stay only in MongoDB and submissions are scored server-side. Mathematical expressions use sanitized MathML; mathematical prompts also have a safe server-generated Presentation MathML fallback when the local model omits markup. The model creates original practice based on syllabus guidance and broad recurring exam patterns; it is not a verified verbatim archive of 20 years of official papers.

API docs: /docs. Health: /api/health. Tests: `backend/.venv/Scripts/python.exe -m unittest backend.test_api` uses and cleans an isolated random local test database.

The previous online Sites deployment is separate; this local Python/Mongo/Ollama setup is not published there.
