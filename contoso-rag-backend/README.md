# Contoso Products RAG App

A Fabric-authenticated Retrieval-Augmented Generation (RAG) app. Because a deployed
Rayfin/Fabric app has no server compute, the retrieve-then-generate flow runs
**browser-side**: the front-end queries Azure AI Search and the Microsoft Foundry
Azure OpenAI endpoint (**gpt-5-mini**) directly, and Rayfin provides Fabric SSO auth,
a GraphQL data API for per-user chat history, and static hosting.

> **Lab-only security note:** the Search and Foundry keys ship to the browser via
> `VITE_*` env vars. Fine for this hands-on lab; not production-secure. Real apps
> put those keys behind a server-side proxy.

## Getting started (plug-and-play)

Five steps, no source editing — you only fill in `.env`:

```bash
# 1. Open this folder in VS Code.
# 2. Fill in .env with your Azure AI Search + Microsoft Foundry values
#    (each line has an inline comment saying where to get it).
# 3. Install dependencies:
npm install
# 4. Sign in to Rayfin (Fabric / Entra ID):
npx rayfin login
# 5. Deploy to Fabric — builds the app, provisions services, applies the schema:
npx rayfin up
```

When `rayfin up` finishes it prints the **Static Hosting URL** — open it, sign in with
Fabric SSO, and ask a product question. Re-run `npx rayfin up` any time to redeploy.

### Required environment values (`.env`)

| Key | Description |
|-----|-------------|
| `VITE_SEARCH_ENDPOINT` | Azure AI Search endpoint URL |
| `VITE_SEARCH_KEY` | Azure AI Search key |
| `VITE_AISEARCH_INDEX_NAME` | Search index name (`products`) |
| `VITE_FOUNDRY_OPENAI_ENDPOINT` | Foundry Azure OpenAI base endpoint (`https://<res>.openai.azure.com/`) |
| `VITE_FOUNDRY_API_KEY` | Foundry Azure OpenAI key |
| `VITE_CHAT_MODEL` | Chat deployment name (`gpt-5-mini`) |

## Project structure

```text
├── rayfin/
│   ├── rayfin.yml               # Fabric service configuration
│   └── data/
│       ├── ChatInteraction.ts   # Chat-history entity with @role per-user access + bounded @text
│       └── schema.ts            # Schema export consumed by the typed client
├── src/
│   ├── main.tsx                 # Entry point + Rayfin client bootstrap
│   ├── App.tsx                  # Routes and auth gate
│   ├── hooks/
│   │   └── AuthContext.tsx      # React context wrapping the auth helpers
│   ├── components/
│   │   ├── AuthPage.tsx         # Sign-in UI
│   │   └── AskRag.tsx           # Ask box + grounded answer + Recent questions
│   ├── pages/
│   │   └── HomePage.tsx         # "Ask Contoso Products" page
│   └── services/
│       ├── IAuthService.ts      # Auth service contract + AuthUser type
│       ├── MockAuthService.ts   # Local-dev impl (email/password)
│       ├── RayfinAuthService.ts # Production impl (Fabric brokered auth)
│       ├── rayfinClient.ts      # Typed Rayfin client singleton
│       ├── bootstrap.ts         # Reads env, picks the right auth service
│       └── askRag.ts            # Browser-side retrieve-then-generate + history
└── package.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Deploy backend to Fabric and start local dev server |
| `npm run build` | Production build (`tsc -b && vite build`) |
| `npm run build:fabric` | Build for Fabric deployment (entrypoint for `rayfin up staticapp deploy`) |
| `npm run lint` | Lint with ESLint |
| `npm run test` | Run unit tests with Vitest |
| `npm run rayfin:db` | Apply database migrations |
