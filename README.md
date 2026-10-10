# PathWise quick-deploy starter

## Deploy fast (Render)
1. Create a GitHub repository and upload all files from this folder.
2. Go to https://render.com and create **New → Web Service** using the repository.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variable `OPENAI_API_KEY` with your private API key (optional; without it the app uses demo roadmap generation).
6. Deploy. Render gives you a public URL.

## Local run
Requires Node.js 18+: `npm install` then `npm start`, then visit http://localhost:3000.

## What works
Responsive dashboard, goals, lesson roadmap, lesson status, quizzes, score-based revision queue, history, export, browser-local save. If `OPENAI_API_KEY` is set in the host's environment, roadmap creation calls OpenAI from the backend. The key is not exposed to browser code.

## Important limitation
This rapid-deploy version does not include user accounts or a cloud database. Progress is saved to the current browser's localStorage and is not synced across devices. Add Supabase Auth/database if cloud persistence is required. Do not describe this starter as having cloud accounts/database until those are actually added.
