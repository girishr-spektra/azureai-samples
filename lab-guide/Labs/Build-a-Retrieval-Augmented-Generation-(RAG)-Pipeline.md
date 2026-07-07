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

    ![](../media/cust-rag-jul-ex1-g29.png)

    - This file contains the code to import the required libraries, create a project client, and configure settings.
    - Code to add the function to get product documents.
    - Finally, add code to test the function when you run the script directly.

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

In this task, you will create a prompt agent named **ContosoAgent** in the Microsoft Foundry portal using your deployed **gpt-5-mini** model. You will then use the agent's **Traces** tab to connect an **Application Insights** resource to your project — this is what enables project-wide tracing, which the script in the next task writes to. (The script itself does not call ContosoAgent; the agent is only the convenient place to wire up Application Insights.)

1. Navigate back to the **Microsoft Foundry** portal. Ensure the **New Foundry** toggle is on.

1. In the **Build (1)** section, select **Agents (2)**, and then select **New agent (3)**.

    ![](../media/cust-rag-jul-ex2-g1.png)

1. From the **New agent** menu, select **Build an agent**.

    ![](../media/cust-rag-jul-ex2-g2.png)

1. On the **Create an agent** pane, enter **ContosoAgent** as the **Agent name**, and then select **Create**.

    ![](../media/cust-rag-jul-ex2-g3.png)

1. In the **Instructions (1)** field, enter the provided prompt, and then select **Save (2)**.

    ```
    You are a helpful assistant for Contoso Knowledge Services. Answer employee questions using the retrieved product documents. Stay grounded in the provided context and ask for clarification when a request is vague.
    ```

    ![](../media/cust-rag-jul-ex2-g4.png)

1. Select the **Traces (1)** tab, and then select **Connect (2)**.

    ![](../media/cust-rag-jul-ex2-g5.png)

1. In the **Monitor settings** pane, expand the **Application insights resource name (1)** dropdown, and then select **Create new resource (2)**.

    ![](../media/cust-rag-jul-ex2-g7.png)

1. In the **Monitor settings** pane, enter **AppInsights-<inject key="DeploymentID" enableCopy="false"/> (1)** as the **Name**, leave the default **Log Analytics Workspace (2)** unchanged, and then select **Create (3)**.

    > [!NOTE]
    > Do not change the **Log Analytics Workspace** value. The default workspace is pre-configured for your environment.

    ![](../media/cust-rag-jul-ex2-g8.png)

You have successfully created the ContosoAgent.

### Run with telemetry enabled

1. Navigate back to the **Visual Studio Code** terminal. Make sure you are in the **rag/custom-rag-app** directory.

1. Add the `--enable-telemetry` flag when you run the `chat_with_products.py` script:

   ```bash
   python chat_with_products.py --query "I need a new tent for 4 people, what would you recommend?" --enable-telemetry
   ```

    ![](../media/af52.png)

    > **Note:** The `--enable-telemetry` flag calls `enable_telemetry(True)` in `config.py`, which connects to Application Insights using `project.telemetry.get_connection_string()` and configures Azure Monitor. Wait for the script to finish before continuing.

### View traces in the Foundry portal

> [!IMPORTANT]
> The script uses **direct inference** (`project.inference.get_chat_completions_client()`), not the ContosoAgent. Its traces therefore appear in the **project-level Observability → Traces** view, **not** under **Agents → Traces**. The agent's own **Traces** tab stays empty until you chat with that agent, so don't look for your script's traces there.

1. Navigate back to the **Microsoft Foundry** portal. From the left navigation pane, select **Observability (1)**, and then select the **Traces (2)** tab. The page is titled **"Use tracing to view performance and debug your app"**.

    ![To be captured](../media/foundry-traces-view.png)

1. Verify that a new **`chat_with_products`** entry appears in the list, showing the **Input** (your question) and **Output** (the grounded answer). Traces may take **2–5 minutes** to appear.

    > **Note:** If no traces appear, confirm the date range at the top right covers today, then select **Refresh**. It may take a few minutes for the first trace to arrive.

1. Select the **`chat_with_products`** entry to open the trace and step through each span — you can view latency, the prompt content, and the retrieval (search) operations in the waterfall.

    ![To be captured](../media/foundry-trace-detail.png)

1. Select **Filter (1)**, then select **+ Add filter (2)**, set the filter to **Status (3)** → **Equal to (4)** → **True (5)**, and then select **Apply (6)**.

    ![](../media/L2T4S9-2111.png)

1. Verify that only successful traces are displayed.

    ![](../media/af57.png)

## 🧾 Summary

In this exercise, you built a smart chatbot that doesn’t guess answers.

- First, you uploaded product information from `products.csv` into a searchable system using `create_search_index.py`.
- Then, when a user asks a question (like “I need a tent for 4 people”), your app uses `get_product_documents.py` to search and find the best matching products.
- After that, `chat_with_products.py` takes those matching products and uses AI to generate a proper recommendation based on real data.
- Then, you created a **ContosoAgent** in the Microsoft Foundry portal using the deployed **gpt-5-mini** model and, from its **Traces** tab, connected an **Application Insights** resource to your project.
- Finally, you ran the chat app with the `--enable-telemetry` flag and verified traces in the **Foundry portal** under **Observability → Traces**.

### You have successfully completed the exercise. Click **Next >>** to continue to the next exercise.

![](../media/afg10.png)

























