# Module 04: Deploy the RAG App as a Production Endpoint with Rayfin

### Estimated Duration: 1 Hour

## 📘 Scenario

Your RAG assistant works locally and passes evaluation, and the business now wants it available to a front-end web application. Instead of building and operating backend infrastructure yourself, you will deploy the app as a production endpoint on **Rayfin**, the managed Backend-as-a-Service (BaaS) platform introduced at Build 2026. Rayfin provisions a database, authentication, data APIs, storage, and hosting from your code, and runs inside your organization's Microsoft Fabric data estate so it inherits enterprise governance and access control. You will expose a REST API that a front-end can call, and configure the access controls that protect it.

## 📖 Overview

In this module, you will package the RAG pipeline behind a Rayfin managed backend and publish it as a REST API. You will install the Rayfin CLI, scaffold a Rayfin project, define a function that calls your Microsoft Foundry RAG app, deploy the backend to Microsoft Fabric, configure Rayfin access controls, and verify that the REST endpoint returns grounded answers that a front-end can consume.

> [!NOTE]
> Rayfin is a new Build 2026 platform and is evolving quickly. The screenshots in this module are placeholders, and some CLI and portal labels may differ in your environment. Capture each screen as you complete the step, and confirm command names and options against the Rayfin documentation at [https://aka.ms/rayfin/docs](https://aka.ms/rayfin/docs).

## 🎯 Objectives

In this module, you will complete the following tasks:

- Task 1: Install the Rayfin CLI and scaffold a project
- Task 2: Define the RAG backend function and REST endpoint
- Task 3: Deploy the backend to Microsoft Fabric
- Task 4: Configure Rayfin access controls
- Task 5: Test the REST API and confirm front-end consumption

## Prerequisites

- A completed and evaluated RAG app from the previous modules.
- Your Microsoft Foundry **Project endpoint** and deployed **gpt-5-mini** model.
- **Node.js 24 (LTS)** installed on the lab virtual machine. The Rayfin CLI requires Node.js version 24.x (`>=24.0.0 <25.0.0`).
- Access to a **Microsoft Fabric** workspace in your Azure subscription.

## Task 1: Install the Rayfin CLI and Scaffold a Project

In this task, you will install the Rayfin tooling and scaffold a new backend project.

1. Navigate back to **Visual Studio Code**.

1. Right-click the **ContosoTrek** folder, and then select **Open in Integrated Terminal**.

   ![To be captured](../media/rayfin-open-terminal.png)

1. Upgrade Node.js to version 24 (LTS) using Chocolatey:

   ```bash
   choco upgrade nodejs-lts -y
   ```

   > **Note:** Wait for the installation to complete. The Rayfin CLI requires **Node.js 24.x** (`>=24.0.0 <25.0.0`).

1. Close the current terminal, open a **new** terminal in the same folder, and then verify the Node.js version:

   ```bash
   node --version
   ```

   Verify that the output displays **v24.x.x**.

   > [!NOTE]
   > A new terminal is required so the updated PATH takes effect. If the output still shows an older version (for example, `v21.7.1`), close and reopen Visual Studio Code, and then run the command again.

1. Scaffold a new Rayfin project. This command creates the data models, authentication, APIs, and a ready-to-deploy app.

   ```bash
   npm create @microsoft/rayfin@latest
   ```

1. When prompted **How would you like to start?**, select **Use a template (built-in)** using the arrow keys, and then press **Enter**.

   ![To be captured](../media/rayfin-scaffold-start-option.png)

1. When prompted **Select a template:**, enter **4** to choose **Basic Todo App**, and then press **Enter**.

   ![To be captured](../media/rayfin-scaffold-template-select.png)

   > [!NOTE]
   > The **Basic Todo App** template includes a Rayfin data model, per-user row-level security, and the full data path. You will replace its sample entity with the RAG backend entity in the next task.

1. When prompted for the project name, enter **contoso-rag-backend**, and then accept the default options for the remaining prompts.

   ![To be captured](../media/rayfin-scaffold-prompts.png)

   > [!NOTE]
   > If the terminal prompts for values that are not covered here, accept the defaults. Confirm any unfamiliar prompt against the Rayfin getting-started guide.

1. Change into the new project directory:

   ```bash
   cd contoso-rag-backend
   ```

1. Verify that the project folder appears in the **Visual Studio Code** Explorer.

   ![To be captured](../media/rayfin-project-structure.png)

## Task 2: Define the RAG Backend Function and REST Endpoint

In this task, you will define the data model and a backend function that calls your Microsoft Foundry RAG app and returns grounded answers over REST.

1. In the **contoso-rag-backend** project, expand the **rayfin (1)** folder, and then expand the **data (2)** folder. This folder contains the template's entity definitions (for example, **Todo.ts**) and the **schema.ts** registration file.

   ![To be captured](../media/rayfin-data-folder.png)

1. Right-click the **rayfin/data** folder, select **New File**, name the file **ChatInteraction.ts**, paste the following code, and then press **Ctrl+S** to save the file. This entity stores each question and its grounded answer so responses can be reviewed and reused, and the `@role` policy restricts each record to the user who created it.

   ```typescript
   import { entity, role, text, date, uuid } from '@microsoft/rayfin-core';

   @entity()
   @role('authenticated', '*', {
     policy: (claims, item) => claims.sub.eq(item.user_id),
   })
   export class ChatInteraction {
     @uuid() id!: string;
     @text({ min: 1, max: 2000 }) question!: string;
     @text() answer!: string;
     @date() createdAt!: Date;
     @text() user_id!: string;
   }
   ```

1. Open the **rayfin/data/schema.ts (1)** file, register the new entity as shown below, and then press **Ctrl+S** to save the file.

   ```typescript
   import { Todo } from './Todo.js';
   import { ChatInteraction } from './ChatInteraction.js';

   export type TodoAppSchema = {
     Todo: Todo;
     ChatInteraction: ChatInteraction;
   };

   export const schema = [Todo, ChatInteraction];
   ```

1. In the **Explorer** pane, expand the **contoso-rag-backend/src (1)** folder, and then expand the **services (2)** folder. This folder contains the template's service modules, including **rayfinClient.ts** (the typed data client) and **todos.ts** (a sample service).

   ![To be captured](../media/rayfin-src-services-folder.png)

1. Right-click the **src/services** folder, select **New File**, name the file **askRag.ts**, paste the following code, and then press **Ctrl+S** to save the file. This service receives a question, retrieves grounding documents from your Azure AI Search index, calls your Microsoft Foundry model, stores the interaction through the Rayfin data client, and returns the grounded answer.

   ```typescript
   // src/services/askRag.ts
   import { getRayfinClient } from './rayfinClient';

   // Retrieve the most relevant product documents from the Azure AI Search index.
   async function retrieveDocuments(question: string): Promise<string> {
     const response = await fetch(
       `${import.meta.env.VITE_SEARCH_ENDPOINT}/indexes/${import.meta.env.VITE_AISEARCH_INDEX_NAME}/docs/search?api-version=2024-07-01`,
       {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'api-key': import.meta.env.VITE_SEARCH_KEY,
         },
         body: JSON.stringify({ search: question, top: 5, select: 'title,content' }),
       },
     );
     const results = await response.json();
     return results.value
       .map((doc: { title: string; content: string }) => `${doc.title}: ${doc.content}`)
       .join('\n');
   }

   // Generate a grounded answer using the Microsoft Foundry project endpoint.
   async function getGroundedAnswer(question: string, context: string): Promise<string> {
     const response = await fetch(`${import.meta.env.VITE_PROJECT_ENDPOINT}/openai/v1/responses`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${import.meta.env.VITE_FOUNDRY_ACCESS_TOKEN}`,
       },
       body: JSON.stringify({
         model: import.meta.env.VITE_CHAT_MODEL,
         input: `Answer the question using only the product documents below. Cite the products you recommend.\n\nDocuments:\n${context}\n\nQuestion: ${question}`,
       }),
     });
     const result = await response.json();
     return result.output_text;
   }

   export async function askRag(question: string): Promise<string> {
     const context = await retrieveDocuments(question);
     const answer = await getGroundedAnswer(question, context);

     // Persist the interaction through the Rayfin data API (GraphQL).
     const client = getRayfinClient();
     const session = client.auth.getSession();
     if (!session.isAuthenticated || !session.user) {
       throw new Error('Cannot save interaction: user is not authenticated.');
     }
     await client.data.ChatInteraction.create({
       question,
       answer,
       createdAt: new Date(),
       user_id: session.user.id,
     });

     return answer;
   }
   ```

   > [!NOTE]
   > This service follows the same pattern as the template's **todos.ts**: `getRayfinClient()` returns the typed data client, `client.auth.getSession()` provides the signed-in user, and `client.data.ChatInteraction.create(...)` persists through the Rayfin data API, which enforces the `@role` access policy from the entity. The retrieve-then-generate flow mirrors the Python `chat_with_products.py` script, using the Azure AI Search REST API for retrieval and the Microsoft Foundry **responses** REST API for generation.

   > [!IMPORTANT]
   > The application logic in a Fabric App runs in the authenticated front-end — Rayfin provisions the database, data API, authentication, and hosting, but does not run custom server-side functions in the current preview. For this lab, the Search key and a short-lived Foundry token are supplied through environment values; in production, route model calls through a protected proxy so keys are never exposed to the browser.

1. Right-click the **contoso-rag-backend (1)** folder (the project root), select **New File (2)**, name the file **.env**, add the following values, and then press **Ctrl+S** to save the file. Use the same values you configured in the RAG app's `.env` file in Exercise 1.

   ```bash
   VITE_PROJECT_ENDPOINT=<your-project-endpoint>
   VITE_SEARCH_ENDPOINT=<your-search-endpoint>
   VITE_SEARCH_KEY=<your-search-key>
   VITE_AISEARCH_INDEX_NAME=products
   VITE_CHAT_MODEL=gpt-5-mini
   ```

   > [!NOTE]
   > Vite automatically loads `VITE_*` variables from the project-root `.env` file into `import.meta.env`. The `rayfin/.env` file is managed by the Rayfin CLI and is created after you deploy — do not add these values there.

   > [!NOTE]
   > To generate a Foundry access token for testing, run `az account get-access-token --scope https://ai.azure.com/.default --query accessToken -o tsv` in the terminal, and then add it to the same `.env` file as `VITE_FOUNDRY_ACCESS_TOKEN=<token>`. The token expires after 60–90 minutes.

1. Enable CORS on the search index so the browser-based app can query it. In the **rag/custom-rag-app** terminal, re-run the index creation script, which now includes `cors_options` in the index definition:

   ```bash
   python create_search_index.py
   ```

   > [!NOTE]
   > Browsers block cross-origin requests unless the target service allows them. The updated `create_search_index.py` recreates the **products** index with `CorsOptions(allowed_origins=["*"])` so the deployed app can call the Azure AI Search REST API directly. Without this, the `askRag` search call fails with a CORS error in the browser console.

1. Add a question box to the app so you can exercise the RAG service. Right-click the **src/components** folder, select **New File**, name the file **AskRag.tsx**, paste the following code, and then press **Ctrl+S** to save the file.

   ```tsx
   // src/components/AskRag.tsx
   import { useState } from 'react';
   import { askRag } from '../services/askRag';

   export function AskRag() {
     const [question, setQuestion] = useState('');
     const [answer, setAnswer] = useState('');
     const [loading, setLoading] = useState(false);

     async function handleAsk() {
       if (!question.trim()) return;
       setLoading(true);
       setAnswer('');
       try {
         setAnswer(await askRag(question));
       } catch (err) {
         setAnswer(`Error: ${err instanceof Error ? err.message : String(err)}`);
       } finally {
         setLoading(false);
       }
     }

     return (
       <div style={{ maxWidth: 640, margin: '2rem auto', padding: '1rem' }}>
         <h2>Ask Contoso Products</h2>
         <input
           value={question}
           onChange={(e) => setQuestion(e.target.value)}
           placeholder="I need a new tent for 4 people, what would you recommend?"
           style={{ width: '75%', padding: '0.5rem' }}
         />
         <button onClick={handleAsk} disabled={loading} style={{ marginLeft: 8, padding: '0.5rem 1rem' }}>
           {loading ? 'Asking…' : 'Ask'}
         </button>
         {answer && <p style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{answer}</p>}
       </div>
     );
   }
   ```

1. Open the **src/pages/HomePage.tsx (1)** file, add the following import at the top of the file **(2)**, and then render `<AskRag />` inside the page's returned JSX, above the existing content **(3)**. Press **Ctrl+S** to save the file.

   ```tsx
   import { AskRag } from '../components/AskRag';
   ```

   ![To be captured](../media/rayfin-homepage-askrag.png)

   > [!IMPORTANT]
   > This template uses React Router, so the authenticated content is rendered by **HomePage**, not `App.tsx`. You must actually render `<AskRag />` — the template's TypeScript config uses `noUnusedLocals`, so an imported-but-unused component fails the build with `error TS6133: 'AskRag' is declared but its value is never read.`

   > [!NOTE]
   > The exact JSX structure varies slightly by template version. Place `<AskRag />` next to the existing page content so it renders on the authenticated home page after sign-in.

## Task 3: Deploy the Backend to Microsoft Fabric

In this task, you will create a Microsoft Fabric workspace with capacity and deploy the Rayfin backend so it provisions the database, data API, authentication, and hosting.

### Create a Fabric workspace

1. Open a new browser tab, enter **https://app.fabric.microsoft.com** in the address bar, and then sign in with **<inject key="AzureAdUserEmail" enableCopy="false"/>**.

    ![To be captured](../media/fabric-portal-signin.png)

1. If prompted, start the **Fabric trial** to obtain trial capacity for your account.

    ![To be captured](../media/fabric-trial-start.png)

1. From the left navigation pane, select **Workspaces (1)**, and then select **+ New workspace (2)**.

    ![To be captured](../media/fabric-new-workspace.png)

1. Enter **contoso-rag-ws<inject key="DeploymentID" enableCopy="false"/> (1)** as the workspace name, expand **Advanced (2)**, select **Trial (3)** as the license mode, and then select **Apply (4)**.

    ![To be captured](../media/fabric-workspace-details.png)

    > [!NOTE]
    > A Rayfin deployment requires a workspace with Fabric capacity assigned. The **Fabric Apps (preview)** workload must also be enabled by a tenant administrator; in this lab environment it is pre-enabled.

1. Verify that the **contoso-rag-ws** workspace opens.

### Deploy with the Rayfin CLI

1. In the terminal, sign in to Azure if you are prompted:

   ```bash
   az login
   ```

1. Deploy and run the backend:

   ```bash
   npx rayfin up
   ```

1. When prompted **Enter a Fabric workspace name to deploy to**, enter **contoso-rag-ws<inject key="DeploymentID" enableCopy="false"/>**, and then press **Enter**. If a browser window opens for sign-in, sign in with **<inject key="AzureAdUserEmail" enableCopy="false"/>**.

   ![To be captured](../media/rayfin-up-workspace-prompt.png)

   > **Note:** Rayfin provisions the database, authentication, data APIs, and hosting. Wait for the deployment to complete. This might take several minutes.

1. When the deployment finishes, the terminal displays the **Deployment details**. Copy the following values into a notepad:

    - **Static Hosting URL (1)** — the live app URL (format: `https://<name>-swedencentral.webapp.fabricapps.net`)
    - **Portal (2)** — the Fabric portal link for the deployed app backend
    - **Publishable Key (3)** — used as the `X-Publishable-Key` header in data-plane requests

   ![To be captured](../media/rayfin-deploy-output.png)

1. Verify that the output displays **Project "contoso-rag-backend" is now deployed to Fabric!**

## Task 4: Configure Rayfin Access Controls

In this task, you will review and verify the access controls that protect the RAG backend. Rayfin enforces access through `@role` policy decorators on entities, backed by Microsoft Fabric identity and governance.

1. Open the **rayfin/data/ChatInteraction.ts (1)** file and review the `@role` decorator **(2)** you added in Task 2:

   ```typescript
   @role('authenticated', '*', {
     policy: (claims, item) => claims.sub.eq(item.user_id),
   })
   ```

   - **`'authenticated'`** — only signed-in users can access the entity; anonymous requests are rejected.
   - **`'*'`** — the policy applies to all operations (create, read, update, delete).
   - **`policy`** — row-level security: each user can only access records where `user_id` matches their own identity claim.

1. Open the **rayfin/data/Todo.ts** file and verify that the template's entity uses the same pattern. This confirms every entity in the backend is protected by authenticated, per-user access.

1. Re-deploy the backend to apply the entity and access-control changes from Task 2:

   ```bash
   npx rayfin up
   ```

1. Verify that the output displays **Project "contoso-rag-backend" is now deployed to Fabric!**

1. In the **Microsoft Fabric** workspace, open the **contoso-rag-backend** app, and then verify that the app inherits the workspace's identity and governance settings.

   ![To be captured](../media/rayfin-fabric-access-controls.png)

## Task 5: Test the App and Confirm the API Is Consumable

In this task, you will open the deployed app, exercise the RAG service, and confirm that the backend data API is protected by authentication.

1. Open the **Static Hosting URL** you copied in Task 3 in the browser, and then sign in with **<inject key="AzureAdUserEmail" enableCopy="false"/>** when prompted. Fabric SSO protects the app, so only authenticated users can open it.

   ![To be captured](../media/rayfin-app-signin.png)

1. In the app, enter a test question, such as `I need a new tent for 4 people, what would you recommend?`, and then verify that a grounded answer is returned that references the product documents.

   ![To be captured](../media/rayfin-app-grounded-answer.png)

1. Verify that the interaction was stored through the data API. Open the **Portal** link you copied in Task 3, and then select the **SQL database in Fabric** child item. Verify that the **ChatInteraction** table contains the question and answer.

   ![To be captured](../media/rayfin-fabric-chatinteraction-table.png)

1. Confirm that the backend rejects unauthenticated requests. Open a new **InPrivate** browser window, open the data-plane endpoint from the **Endpoint** value in the deployment details without signing in, and then verify that the request is rejected.

   > [!NOTE]
   > Data-plane requests require Fabric authentication and the **Publishable Key** sent as the `X-Publishable-Key` header — this is how any front-end consumes the API with the Rayfin client SDK. The `@role('authenticated', ...)` policy on the entities rejects anonymous requests, which confirms the access controls are enforced end to end.

You have successfully deployed the RAG app as a production endpoint on the Rayfin managed backend.

## 🧾 Summary

In this module, you deployed your RAG assistant as a production endpoint using the Rayfin managed backend.

- First, you installed the Rayfin CLI and scaffolded a backend project.
- Then, you defined a `ChatInteraction` entity with row-level access policies and an `askRag` service that reimplements the retrieve-then-generate RAG flow.
- Next, you deployed the app to Microsoft Fabric, which provisioned the database, data API, authentication, and hosting.
- After that, you reviewed the `@role` access controls enforced through Microsoft Fabric identity and governance.
- Finally, you tested the deployed app, verified grounded answers, confirmed interactions were stored through the data API, and confirmed unauthenticated requests are rejected.

### You have successfully completed the module. Click **Next >>** to continue to the next module.
