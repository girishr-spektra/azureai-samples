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
- **Node.js LTS** installed on the lab virtual machine.
- Access to a **Microsoft Fabric** workspace in your Azure subscription.

## Task 1: Install the Rayfin CLI and Scaffold a Project

In this task, you will install the Rayfin tooling and scaffold a new backend project.

1. Navigate back to **Visual Studio Code**.

1. Right-click the **ContosoTrek** folder, and then select **Open in Integrated Terminal**.

   ![To be captured](../media/rayfin-open-terminal.png)

1. Verify that Node.js is installed:

   ```bash
   node --version
   ```

1. Scaffold a new Rayfin project. This command creates the data models, authentication, APIs, and a ready-to-deploy app.

   ```bash
   npm create @microsoft/rayfin@latest
   ```

1. When prompted, enter **contoso-rag-backend** as the project name, and then accept the default options for the remaining prompts.

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

1. In the **contoso-rag-backend** project, open the data model file, add the following model, and then press **Ctrl+S** to save the file. This model stores each question and its grounded answer so responses can be reviewed and reused.

   ```typescript
   import { Entity, Field, Id } from "@microsoft/rayfin-core";

   @Entity()
   export class ChatInteraction {
     @Id()
     id!: string;

     @Field()
     question!: string;

     @Field()
     answer!: string;

     @Field()
     createdAt!: string;
   }
   ```

1. Create a new backend function named **askRag** that receives a question, calls your Microsoft Foundry RAG pipeline, stores the interaction, and returns the answer. Add the following code, and then press **Ctrl+S** to save the file.

   ```typescript
   import { httpTrigger } from "@microsoft/rayfin-functions";

   export const askRag = httpTrigger(async (req, ctx) => {
     const { question } = req.body;

     // Call the Microsoft Foundry project endpoint with the retrieved context.
     const answer = await getGroundedAnswer(question, process.env.PROJECT_ENDPOINT!);

     await ctx.data.ChatInteraction.create({
       question,
       answer,
       createdAt: new Date().toISOString(),
     });

     return { status: 200, body: { answer } };
   });
   ```

   > [!NOTE]
   > `getGroundedAnswer` represents the call into your RAG pipeline. Confirm the exact Rayfin function signature, data client, and HTTP trigger API against the Rayfin documentation, as these evolve with each release.

1. Open the project **.env** file, add your Microsoft Foundry **Project endpoint**, and then press **Ctrl+S** to save the file.

   ```bash
   PROJECT_ENDPOINT=<your-project-endpoint>
   ```

## Task 3: Deploy the Backend to Microsoft Fabric

In this task, you will deploy the Rayfin backend so it provisions the database, APIs, and hosting in your Microsoft Fabric workspace.

1. In the terminal, sign in to Azure if you are prompted:

   ```bash
   az login
   ```

1. Deploy and run the backend:

   ```bash
   npx rayfin up
   ```

   > **Note:** Rayfin provisions the database, authentication, data APIs, and hosting. Wait for the deployment to complete. This might take several minutes.

1. When the deployment finishes, copy the **REST API base URL** from the terminal output, and then paste it into a notepad.

   ![To be captured](../media/rayfin-deploy-output.png)

1. Verify that the deployment status displays **Succeeded**.

## Task 4: Configure Rayfin Access Controls

In this task, you will restrict who can call the REST API by configuring Rayfin access controls, which are enforced through Microsoft Fabric governance.

1. Open the **contoso-rag-backend** project, open the access policy configuration file, add a policy that requires an authenticated user for the **askRag** endpoint, and then press **Ctrl+S** to save the file.

   ```typescript
   export const accessPolicies = {
     askRag: {
       authentication: "required",
       allowedRoles: ["RagAppUser"],
     },
   };
   ```

   > [!NOTE]
   > Confirm the exact access-policy schema and role names against the Rayfin documentation. Rayfin enforces these controls through Microsoft Fabric identity and governance.

1. Re-deploy the backend to apply the updated access controls:

   ```bash
   npx rayfin up
   ```

1. Verify that the deployment status displays **Succeeded**.

1. In the **Microsoft Fabric** workspace, open the **contoso-rag-backend** app, and then verify that the access policy appears under the app's security settings.

   ![To be captured](../media/rayfin-fabric-access-controls.png)

## Task 5: Test the REST API and Confirm Front-End Consumption

In this task, you will call the REST endpoint and confirm that a front-end can consume grounded answers.

1. In the terminal, sign in to obtain an access token for the API:

   ```bash
   az account get-access-token --scope https://api.fabric.microsoft.com/.default
   ```

1. Call the **askRag** endpoint with a test question. Replace `<REST_API_BASE_URL>` with the URL you copied in Task 3 and `<ACCESS_TOKEN>` with the token from the previous step.

   ```bash
   curl -X POST <REST_API_BASE_URL>/askRag ^
     -H "Content-Type: application/json" ^
     -H "Authorization: Bearer <ACCESS_TOKEN>" ^
     -d "{ \"question\": \"I need a new tent for 4 people, what would you recommend?\" }"
   ```

1. Verify that the response returns a grounded answer that references the product documents.

   ![To be captured](../media/rayfin-rest-response.png)

1. Call the endpoint again without the **Authorization** header, and then verify that the request is rejected. This confirms that the access controls are enforced.

   > [!NOTE]
   > A front-end web application consumes this same REST endpoint by sending the user's question in the request body and rendering the returned answer. The access token is obtained through the user's sign-in flow.

You have successfully deployed the RAG app as a production REST endpoint.

## 🧾 Summary

In this module, you deployed your RAG assistant as a production endpoint using the Rayfin managed backend.

- First, you installed the Rayfin CLI and scaffolded a backend project.
- Then, you defined a data model and a function that calls your Microsoft Foundry RAG app and returns grounded answers over REST.
- Next, you deployed the backend to Microsoft Fabric, which provisioned the database, APIs, and hosting.
- After that, you configured Rayfin access controls enforced through Microsoft Fabric governance.
- Finally, you tested the REST API and confirmed that authenticated front-end clients receive grounded answers while unauthenticated requests are rejected.

### You have successfully completed the module. Click **Next >>** to continue to the next module.
