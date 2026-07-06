# Exercise 01: Developing a Custom RAG App Using Microsoft Foundry

### Estimated Duration: 2 Hours

## 📘 Scenario

You are an AI developer at a company building an internal knowledge assistant. Before development begins, you must set up the Microsoft Foundry project, deploy the required chat and embedding models, and configure Azure AI Search as the retrieval engine. You will also clone the development repository and configure environment variables so the RAG application can run locally in VS Code.

## 📖 Overview

In this exercise, you will prepare an end-to-end environment for a **Retrieval-Augmented Generation (RAG)** application using **Microsoft Foundry**. You will provision a Microsoft Foundry project in the new portal, deploy an OpenAI chat model and an embedding model, create and connect an Azure AI Search service, clone the sample repository, and configure local environment variables so the sample RAG app can run locally.

By the end of the exercise, you will have a functional foundation for building and testing a custom RAG pipeline that retrieves relevant knowledge and augments model-generated responses.

## 🎯 Objectives

In this exercise, you will complete the following task:

- Task 1: Create a Project
- Task 2: Deploying and managing AI models
- Task 3: Create an Azure AI Search Service
- Task 4: Connect the Azure AI search to your project.
- Task 5: Clone the GitHub repository for the project.
- Task 6: Configure environment variables.

### Task 1: Create a Microsoft Foundry Project

In this task, you will create a **Microsoft Foundry** resource and project directly from the **Azure portal**. Creating the resource with project management enabled provisions a hub-less Foundry project, so you no longer create a separate AI Hub.

> [!NOTE]
> The screenshots are placeholders. During the ongoing rename, the resource may still appear as **Azure AI Foundry** on some Azure portal screens. Capture each screen as you complete the step, and confirm that the on-screen labels match the instruction before continuing.

1. On your virtual machine, open the **Azure portal**.

1. In the search bar, enter **Microsoft Foundry (1)**, and then select **Microsoft Foundry (2)** from the results.

    ![To be captured](../media/foundry-portal-search.png)

1. On the **Microsoft Foundry** page, select **+ Create**.

    ![To be captured](../media/foundry-portal-create.png)

1. On the **Create a Microsoft Foundry resource** page, enter the following details, and then select **Review + create (6)**:

    - Subscription: Select the default subscription **(1)**
    - Resource group: **ragsdk-<inject key="DeploymentID" enableCopy="false"/> (2)**
    - Region: **<inject key="Region" enableCopy="false"/> (3)**
    - Name: **ContosoFoundry (4)**
    - Project name: **ContosoTrek (5)**

      ![To be captured](../media/foundry-portal-create-details.png)

1. Review the configuration settings, and then select **Create**.

    ![To be captured](../media/foundry-portal-review-create.png)

1. Wait for the deployment to complete, and then select **Go to resource**.

    ![To be captured](../media/foundry-portal-go-to-resource.png)

1. On the resource **Overview** page, select **Go to Microsoft Foundry portal** to open your **ContosoTrek** project.

    ![To be captured](../media/foundry-portal-launch.png)

1. On the project **Overview** page, copy the **Project endpoint**, and then paste it into a notepad. You will use it to configure the environment variables in Task 6.

    > [!NOTE]
    > The project endpoint uses the format `https://<resource-name>.ai.azure.com/api/projects/ContosoTrek`.

    ![To be captured](../media/foundry-project-endpoint.png)

1. In the Azure portal, open the **ContosoFoundry** resource, select **Access control (IAM) (1)**, select **Add (2)**, and then select **Add role assignment (3)**.

    ![To be captured](../media/foundry-iam-add-role.png)

1. On the **Role** tab, search for and select **Azure AI User (1)**, and then select **Next (2)**.

    > [!IMPORTANT]
    > Select **Azure AI User**, not **Azure AI Developer**. Only **Azure AI User** grants the data-plane permission needed to call the deployed models.

    ![To be captured](../media/foundry-role-ai-user.png)

1. On the **Members** tab, select **Assign access to (1)** as **User, group, or service principal**, select **+ Select members (2)**, choose **<inject key="AzureAdUserEmail" enableCopy="false"/> (3)**, and then select **Review + assign (4)**.

    ![To be captured](../media/foundry-role-assign-member.png)

    > [!NOTE]
    > The **Azure AI User** role grants the data-plane permission required to call the deployed models (for example, `Microsoft.CognitiveServices/.../chat/completions/action`). The **Owner** and **Azure AI Developer** roles do not grant model inference access. Role changes can take a few minutes to take effect.

   > **Congratulations** on completing the task! Now, it's time to validate it. Here are the steps:    
   - Hit the validate button for the corresponding task. If you receive a success message, you can proceed to the next task.
   - If not, carefully read the error message and retry the step, following the instructions in the exercise guide.
   - If you need any assistance, don't hesitate to get in touch with us at cloudlabs-support@spektrasystems.com. We are available 24/7 to assist you.

   <validation step="116ffc00-e134-4fc6-82db-c383b9d13758" />

### Task 2: Deploying and Managing AI Models 

In this task, you will deploy models in your Microsoft Foundry project. You need two models to build a RAG-based chat app: an Azure OpenAI chat model (gpt-5.4-mini) and an Azure OpenAI embedding model (text-embedding-ada-002).

1. On the Microsoft Foundry portal from the left navigation pane, select **Model catalog (1)**. Scroll down and search for **gpt-5.4-mini (2)** and then select **gpt-5.4-mini (3)**.

    ![To be captured](../media/gpt-54-mini-model-catalog.png)

1. Click on **Use this model**.

    ![](../media/E1T2S2-2111.png)

1. Select **Direct from Azure models** as Purchase options.

    ![](../media/rgv3.png)

1. On **Deploy gpt-5.4-mini** window,

    - Select **Global Standard (1)** as Deployment type
    - Select **Connect and deploy (2)**

      ![To be captured](../media/deploy-gpt-54-mini-model.png)

1. On the Microsoft Foundry portal, from the left navigation pane click on the **Model catalog (1)** option twice, search for **text-embedding-ada-002 (2),** and then select **text-embedding-ada-002 (3)**.

    ![](../media/new/2.png)

1. Click on **Use this model**.

    ![](../media/E1T2S6-2111.png)

1. Select **Direct from Azure models** as Purchase options.

    ![](../media/rgv3.png)

1. On the **Deploy model text-embedding-ada-002** window,

    - Deployment type: **Standard (1)**
      
      ![](../media/rg8.png)  
      
    - Tokens per Minute Rate limit: **20k (2)**
      
    - Click on **Deploy (3)**

      ![](../media/E1T2S7.2-2310.png)  

1. From the left navigation pane, click on **Models+Endpoints (1)**, you can see the deployed models **(2)**.

    ![To be captured](../media/gpt-54-mini-text-ada-models.png)

> **Congratulations** on completing the task! Now, it's time to validate it. Here are the steps:
> - Hit the Validate button for the corresponding task. If you receive a success message, you can proceed to the next task.
> - If not, carefully read the error message and retry the step, following the instructions in the exercise guide. 
> - If you need any assistance, please contact us at cloudlabs-support@spektrasystems.com. We are available 24/7 to assist you. 

<validation step="9712c051-408a-4142-9efa-0337dca323d9" />

### Task 3: Create an Azure AI Search Service

In this task, you will create an Azure AI Search service. You need an Azure AI Search service and a connection to create a search index.

1. In the exercise VM browser, navigate to the Azure portal by entering [https://portal.azure.com](https://portal.azure.com) in the address bar. In the Azure portal, in the search box, type **AI Search (1)**, and select **AI Search (2)** from the results.

    ![](../media/RAG1.png)

1. On the **Microsoft Foundry | AI Search** page, select **+ Create** to begin provisioning the Azure AI Search service.

    ![](../media/RAG2.png)

1. On the **Create a search service** page, provide the following details, then click on **Review + create (6)**:
            
    - Subscription: **Leave your default subscription (1)**
    - Resource group: Select **ragsdk-<inject key="DeploymentID" enableCopy="false"/> (2)**
    - Service name: **aisearch-<inject key="DeploymentID" enableCopy="false"/> (3)**
    - Location: **<inject key="Region" enableCopy="false"/> (4)**
    - Pricing tier: **Standard (5)**

      ![](../media/E1T3S2-2310.png)
      
1. Click on **Create** on the **Review + create** page.

    ![](../media/RAG03.png)

1. Wait for the deployment to complete.

    >**Note:** Sometimes the **AI Search** deployment can take up to **10-15 minutes**. Please wait for the deployment to complete then proceed with the next task.

> **Congratulations** on completing the task! Now, it's time to validate it. Here are the steps:
> - Hit the Validate button for the corresponding task. If you receive a success message, you can proceed to the next task.
> - If not, carefully read the error message and retry the step, following the instructions in the exercise guide. 
> - If you need any assistance, please contact us at cloudlabs-support@spektrasystems.com. We are available 24/7 to assist you. 

<validation step="671b186b-85fe-413f-b791-7896dbfaf8c6" />

### Task 4: Connect the Azure AI Search to your Project

In this task, you will connect the Azure AI Search service to your project. Azure AI Search service and connection are used to create a search index. The search index is used to retrieve relevant documents based on the user's question.

1. Navigate back to the **Microsoft Foundry** portal, and select **Management center** from the left pane.

    ![](../media/E1T4S1-2111.png)

1. Select **Connected resources (1)** under the **Project (ContosoTrek)** section, then select **+ New connection (2)**.

    ![](../media/E1T4S2-2111.png)

1. Search for Azure **AI Search (1)**, then select **Azure AI Search (2)**.

    ![](../media/af18.png)

1. Search for the Azure AI Search service you created, **aisearch-<inject key="DeploymentID" enableCopy="false"/> (1)**. Use the **API key (2)** for authentication and then select **Add connection (3)**.

    ![](../media/af19.png)

1. Make sure that AI Search is **Connected**.

    ![](../media/af20.png)

### Task 5: Clone the GitHub Repository for the Project

In this task, you will clone the GitHub repository for the project to access the necessary files for building the chat app.

1. On you Lab-VM, open the **Visual Studio Code** from the desktop.

    ![](../media/af81.png)

1. Click on **File (1)** from the top left corner, then select **Open Folder (2)**.

    ![](../media/rg9.png)

1. Navigate to **C:\Users\demouser\Downloads (1),** press **Enter**, select **ContosoTrek (2),** and then click on **Select Folder (3)**.

    ![](../media/af80.png)

1. Click on **Yes, I trust the author**.

    ![](../media/af25.png)

1. Expand **scenarios (1)**, then **rag/custom-rag-app (2)**. Select **requirements.txt (3)**. This file contains the necessary packages for setting up the Microsoft Foundry SDK. **(4)**

    ![](../media/af-27.png)

     >**Note**: This file contains the necessary packages for building and managing an AI-powered application using the Microsoft Foundry SDK, including authentication, AI inference, search, data processing, and telemetry logging.

1. Right-click on the **rag/custom-rag-app (1)** folder, then select **Open in Integrated Terminal (2)**.

    ![](../media/af26.png)
   
1. Install the required dependencies by running:

    ```
    pip install -r requirements.txt
    ```

    ![](../media/af28.png)

1. Install the required Microsoft Foundry SDK packages:

    ```
    pip install azure-ai-projects==1.0.0b11 azure-ai-inference[prompts]==1.0.0b9
    ```

   > **Note:** This lab pins **azure-ai-projects 1.0.0b11** — the version that supports the hub-less **project endpoint** while still providing the inference clients that the sample uses. Wait for the installation to complete. It might take some time.

### Task 6: Configure Environment Variables

In this task, you will configure the environment variables that connect your RAG application to your Microsoft Foundry project using the project endpoint.

1. Navigate back to the **Visual Studio Code**.

1. Right-click on **.env.sample (1)** and select **Rename (2)**.

    ![](../media/af29.png)

1. Rename the file to `.env`.

1. Select the `.env` **(1)** file and replace **your_project_endpoint (2)** with the **Project endpoint** you copied in **Task 1**, and then ensure that the **CHAT_MODEL**, **EVALUATION_MODEL**, and **INTENT_MAPPING_MODEL** values are set to **gpt-5.4-mini**.

    ![To be captured](../media/dot-env-project-endpoint.png)

    > [!NOTE]
    > The sample uses the `PROJECT_ENDPOINT` environment variable with the endpoint-based Microsoft Foundry SDK. The connection string used by the classic hub-based SDK is no longer required.

1. In the same `.env` file, set **SEARCH_ENDPOINT** to your Azure AI Search service URL and **SEARCH_KEY** to its admin key. Copy both from the **aisearch-<inject key="DeploymentID" enableCopy="false"/>** resource in the Azure portal — the URL from the **Overview** page, and the admin key from **Settings > Keys**.

    ![To be captured](../media/dot-env-search-values.png)

1. Press **Ctrl+S** to save the file.

## 🧾 Summary

In this exercise, you have successfully:

- Created a hub-less project in the new Microsoft Foundry portal and copied its project endpoint.
- Deployed the gpt-5.4-mini model for chat-based interactions and the text-embedding-ada-002 model for generating embeddings.
- Provisioned an Azure AI Search service in Microsoft Azure.
- Connected the Azure AI Search service to your project to enable retrieval capabilities.
- Cloned the GitHub repository to access the required code and resources for building the chat application.
- Configured the necessary environment variables in the `.env` file to integrate your application with the Microsoft Foundry project and deployed models.

### You have successfully completed the exercise. Click **Next >>** to continue to the next exercise.

![](../media/afg10.png)
