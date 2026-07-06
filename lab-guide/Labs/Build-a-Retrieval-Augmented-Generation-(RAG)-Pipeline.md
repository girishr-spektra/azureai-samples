# Exercise 02: Build a Retrieval-Augmented Generation (RAG) Pipeline

### Estimated Duration: 1 Hour

## 📘 Scenario

Your company’s support chatbot currently gives generic answers and misses internal documentation. You are assigned to enhance it by implementing a RAG pipeline that indexes internal documents into Azure AI Search, retrieves the most relevant content for a query, and uses it to generate grounded responses. You will also enable telemetry logging to monitor how well retrieval and generation are performing.

## 📖 Overview

In this exercise, you will enhance a basic chat application by integrating a **Retrieval-Augmented Generation (RAG)** pipeline. This includes indexing knowledge sources, implementing a retrieval mechanism, generating responses with augmented knowledge, and adding telemetry logging to monitor performance and accuracy.

## 🎯 Objectives

In this exercise, you will complete the following tasks:

- Task 1: Indexing Knowledge Sources
- Task 2: Implementing the Retrieval Pipeline
- Task 3: Generating Responses with Augmented Knowledge
- Task 4: Create a ContosoAgent
- Task 5: Add Telemetry Logging

## Task 1: Indexing Knowledge Sources 

In this task, you will index knowledge sources by processing and storing vectorized data from a CSV file using a search index. You will also authenticate your Azure account, execute the indexing script, and register the index to your cloud project.

> [!NOTE]
> The sample scripts use the endpoint-based **Microsoft Foundry SDK** (`azure-ai-projects==1.0.0b11`). They authenticate to your project with the `PROJECT_ENDPOINT` value you configured in the `.env` file, so no code changes are required.

1. In the Visual Studio Code, expand the **assets (1)** folder and select **products.csv** file **(2)**. Review the file. It contains example datasets used in your chat application.

    ![](../media/af35.png)

1. Select **create_search_index.py** file, which stores vectorized data from the embeddings model.

    > 📌 **You do not need to modify anything.**

    ![](../media/af-34.png)

    - This file contains the code to import required libraries, create a project client, and configure connections with Microsoft Foundry and Azure AI Search.
    - Code to define the search index schema and generate vector embeddings from the CSV data.
    - Finally, add code to create the index and upload documents when the script is run directly.

1. From your terminal in VS Code, log in to your Azure account and follow the instructions for authenticating your account. Please make sure your in **rag/custom-rag-app** directory.

    ```bash
    az login
    ```

    ![](../media/af36.png)

1. Minimize the Visual Studio Code window.

    - Select **Work or School account (1)** and click **Continue (2).**

      ![](../media/af37.png)    

    - Enter the **Username: <inject key="AzureAdUserEmail"></inject> (1)**,  then click **Next (2).**

      ![](../media/af38.png)  

    - Enter the **Temporary Access Pass: <inject key="AzureAdUserPassword"></inject> (1)**, then click **Sign in (2).**

      ![](../media/pass-2310.png)    

    - Click on **No, sign in to this app only.**

      ![](../media/notothisapp-2111.png)      

1. Navigate back to the Visual Studio Code terminal and press **Enter** to accept the default subscription.

    ![](../media/af-41.png)

1. If any installation / Extension pop-up appears, please close it.    

1. Run the code to build your index locally and register it to the cloud project:

    ```bash
    python create_search_index.py
    ```    

     ![](../media/af42.png)    

1. If prompted, please close the pop-ups.

    ![](../media/rag-1.png)

1. Enter **Clear** in the terminal, to clear the terminal history.    


## Task 2: Implementing the Retrieval Pipeline 

In this task, you will implement the retrieval pipeline by extracting relevant product documents from the search index. You will configure and execute a script that transforms user queries into search requests, retrieving the most relevant results from the indexed knowledge source.

1. Select the **get_product_documents.py** file containing the script to get product documents from the search index.

    > 📌 **You do not need to modify anything.**

    ![](../media/af43.png)

    - This file contains the code to import the required libraries, create a project client, and configure settings.
    - Code to add the function to get product documents.
    - Finally, add code to test the function when you run the script directly.

1. Expand **assets (1)** and select **intent_mapping.prompty (2)**. This template instructs how to extract the user's intent from the conversation.

    > 📌 **You do not need to modify anything.**

    ![](../media/rgv8.png)

    - The **get_product_documents.py** script uses this prompt template to convert the conversation to a search query.

1. Please make sure your in **rag/custom-rag-app** directory.    

1. Now, run the command below in the terminal to test what documents the search index returns from a query.

    ```bash
    python get_product_documents.py --query "I need a new tent for 4 people, what would you recommend?"
    ```

     ![](../media/af45.png)   

1. Enter **Clear** in the terminal, to clear the terminal history.   

## Task 3: Generating Responses with Augmented Knowledge     

In this task, you will generate responses using augmented knowledge by leveraging retrieved product documents. You will run a script that integrates retrieval-augmented generation (RAG) capabilities to provide relevant and grounded responses based on user queries.

1. Select the **chat_with_products.py** file. This script retrieves product documents and generates a response to a user's question.

    > 📌 **You do not need to modify anything.**

    ![](../media/af46.png)

    - This script contains code to import the required libraries, create a project client, and configure settings.   
    - Code to generate the chat function that uses the RAG capabilities.
    - Finally, add the code to run the chat function. 

1. Expand the **assets (1)** folder and select **grounded_chat.prompty (2)**. This template instructs how to generate a response based on the user's question and the retrieved documents.

    > 📌 **You do not need to modify anything.**

    ![](../media/rgv9.png)

    - The **chat_with_products.py** script calls this prompt template to create a response to the user's question.
 
1. Please make sure your in **rag/custom-rag-app** directory.    

1. Run the command below in the terminal to use the script and test your chat app with RAG capabilities.

    ```bash
    python chat_with_products.py --query "I need a new tent for 4 people, what would you recommend?"
    ```

     ![](../media/af48.png)  

1. Enter **Clear** in the terminal, to clear the terminal history.   
   

## Task 4: Create a ContosoAgent

In this task, you will create a prompt agent named **ContosoAgent** in the Microsoft Foundry portal. This agent uses your deployed **gpt-5-mini** model and will be used to verify telemetry in the next task.

1. Navigate back to the **Microsoft Foundry** portal. Ensure the **New Foundry** toggle is on.

    ![To be captured](../media/foundry-new-foundry-toggle.png)

1. From the left navigation pane, select **Agents**.

    ![To be captured](../media/foundry-agents-nav.png)

1. Select **+ New agent**.

    ![To be captured](../media/foundry-new-agent-button.png)

1. On the agent configuration page, enter **ContosoAgent (1)** as the agent name, and then select **gpt-5-mini (2)** as the model.

    ![To be captured](../media/foundry-agent-name-model.png)

1. Select **Global Standard (1)** as the deployment type.

    ![To be captured](../media/foundry-agent-deployment-type.png)

1. In the **Instructions** field, enter the following prompt:

    ```
    You are a helpful assistant for Contoso Knowledge Services. Answer employee questions using the retrieved product documents. Stay grounded in the provided context and ask for clarification when a request is vague.
    ```

    ![To be captured](../media/foundry-agent-instructions.png)

1. Select **Save** to save the agent.

    ![To be captured](../media/foundry-agent-save.png)

1. Verify that the **ContosoAgent** opens in the **Playground** tab and that the model displays as **gpt-5-mini**.

    ![To be captured](../media/foundry-agent-playground.png)

1. In the **Chat** pane on the right, enter a test message, such as `What tents do you recommend for 4 people?`, and then verify that the agent returns a response.

    ![To be captured](../media/foundry-agent-test-chat.png)

You have successfully created the ContosoAgent.

## Task 5: Add Telemetry Logging

In this task, you will connect Application Insights to your Microsoft Foundry project and enable client-side telemetry so you can monitor and analyze your RAG application's performance in real time.

### Connect Application Insights to the project

1. In the **Microsoft Foundry** portal, open the **ContosoTrek** project.

1. From the left navigation pane, select **Agents (1)**, and then select the **Traces (2)** tab at the top of the page.

    ![To be captured](../media/foundry-agents-traces-tab.png)

1. Select the **Monitor settings** icon (gear icon) to open the Monitor settings panel.

    ![To be captured](../media/foundry-traces-monitor-settings-icon.png)

1. In the **Monitor settings** panel, under **Application insights resource**, expand the **Application insights resource name (1)** dropdown, and then select **Create new resource (2)**.

    ![](../media/foundry-traces-create-appinsights.png)

    > [!NOTE]
    > Selecting **Create new resource** provisions a new Application Insights resource directly into your Azure resource group — no separate Azure portal step is required. The resource appears in your subscription under the same `ragsdk-<inject key="DeploymentID" enableCopy="false"/>` resource group.

1. On the **Create new resource** form, enter the following details, and then select **Create (3)**:

    - **Name (1)**: **Appinsights-<inject key="DeploymentID" enableCopy="false"/>**
    - **Log Analytics Workspace (2)**: Leave the default value as-is

    ![To be captured](../media/foundry-traces-appinsights-name-create.png)

    > **Note:** Do not change the **Log Analytics Workspace** value. The default new workspace shown is pre-configured for your environment. Wait for the resource to be created and connected before continuing.

1. Verify that **App. Insights resource** changes from **Not connected** to the name of your new resource.

    ![To be captured](../media/foundry-traces-appinsights-connected.png)

1. Close the **Monitor settings** panel.

### Run with telemetry enabled

1. Navigate back to the **Visual Studio Code** terminal. Make sure you are in the **rag/custom-rag-app** directory.

1. Add the `--enable-telemetry` flag when you run the `chat_with_products.py` script:

   ```bash
   python chat_with_products.py --query "I need a new tent for 4 people, what would you recommend?" --enable-telemetry
   ```

    ![](../media/af52.png)

    > **Note:** The `--enable-telemetry` flag calls `enable_telemetry(True)` in `config.py`, which connects to Application Insights using `project.telemetry.get_connection_string()` and configures Azure Monitor. Wait for the script to finish before continuing.

### View traces in the Foundry portal

1. Navigate back to the **Microsoft Foundry** portal. From the left navigation pane, select **Agents**, and then select the **Traces** tab.

    ![To be captured](../media/foundry-traces-view.png)

1. Verify that a new trace entry appears in the list. Traces may take **5–10 minutes** to appear.

    > **Note:** If no traces appear, wait a few minutes and then select **Refresh**.

1. Select the trace entry to step through each span, view latency, prompt content, and retrieval operations.

    ![To be captured](../media/foundry-trace-detail.png)

1. Select **Filter (1)**, then select **+ Add filter (2)**, set the filter to **Success (3)** → **Equal to (4)** → **True (5)**, and then select **Apply (6)**.

    ![](../media/L2T4S9-2111.png)

1. Verify that only traces with **Success = True** are displayed.

    ![](../media/af57.png)

## 🧾 Summary

In this exercise, you built a smart chatbot that doesn’t guess answers.

- First, you uploaded product information from `products.csv` into a searchable system using `create_search_index.py`.
- Then, when a user asks a question (like “I need a tent for 4 people”), your app uses `get_product_documents.py` to search and find the best matching products.
- After that, `chat_with_products.py` takes those matching products and uses AI to generate a proper recommendation based on real data.
- Then, you created a **ContosoAgent** in the Microsoft Foundry portal using the deployed **gpt-5-mini** model and tested it in the Playground.
- Finally, you connected Application Insights to your project, ran the chat app with the `--enable-telemetry` flag, and verified traces in the **Foundry portal** under **Agents → Traces**.

### You have successfully completed the exercise. Click **Next >>** to continue to the next exercise.

![](../media/afg10.png)

























