# Challenge 03: Prepare the Development Environment and Configure the RAG Application

## Introduction

With the core AI infrastructure in place, the next step is to prepare the development environment where the RAG application will run. Developers commonly build AI applications locally using tools like Visual Studio Code, which allows them to integrate SDKs, run scripts, and test AI workflows.

In this challenge, you will clone a sample RAG application repository, install the required dependencies, and configure environment variables that connect your application to the Microsoft Foundry project and deployed models.

This setup will allow the local application to securely communicate with Azure AI services and execute the Retrieval-Augmented Generation pipeline.

## Challenge Objectives

- Clone the sample RAG application repository  
- Open the project in Visual Studio Code  
- Install the required Python dependencies  
- Configure environment variables to connect the application with the Foundry project  

## Steps to Complete

### Clone the Project Repository

1. On the JumpVM, open **Visual Studio Code** from the desktop.

1. Click the **ellipsis (...)** menu at the top menu bar.

1. Select **Terminal**, then click **New Terminal**.

1. Run the following command to clone the project repository:

   ```
   git clone --branch prod https://github.com/CloudLabsAI-Azure/azureai-samples.git C:\Users\demouser\Downloads\ContosoTrek
   ```

1. Once cloning completes, click **File** from the top menu.

1. Select **Open Folder**.

1. Navigate to:

   `C:\Users\demouser\Downloads`

1. Select the **ContosoTrek** folder.

1. Click **Select Folder**.

1. If prompted, click **Yes, I trust the authors**.

### Install Required Dependencies

1. In the VS Code file explorer, expand:

   `scenarios → rag → custom-rag-app`

1. Locate the **requirements.txt** file.

1. Right-click the **custom-rag-app** folder and select **Open in Integrated Terminal**.

1. Upgrade pip by running:

   ```
   python.exe -m pip install --upgrade pip
   ```

1. Install the required dependencies:

   ```
   pip install -r requirements.txt
   ```

    > **Note:** Installation may take several minutes depending on the environment. The `requirements.txt` file includes the latest Microsoft Foundry SDK (`azure-ai-projects>=2.0.0`) and the OpenAI SDK.
 
### Configure Environment Variables

1. Navigate back to the **Microsoft Foundry portal**.

1. Open your **project**.

1. From the left navigation pane, select **Overview**.

1. Copy the **Project endpoint** URL.

   > **Note:** The Project endpoint has the format: `https://<resource-name>.services.ai.azure.com/api/projects/<project-name>`. If you see a **Project resource ID** instead, look for the **Project endpoint** field on the Overview page.

1. Next, navigate to the **Azure Portal**.

1. Open your **Azure AI Search** resource (**aisearch-<inject key="DeploymentID" enableCopy="false"/>**).

1. On the **Overview** page, copy the **URL** (e.g., `https://aisearch-xxxx.search.windows.net`).

1. In the left menu, go to **Settings → Keys**.

1. Copy the **Primary admin key**.

1. Return to **Visual Studio Code**.

1. Locate the file:

   `.env.sample`

1. Right-click the file and select **Rename**.

1. Rename the file to:

   `.env`

1. Open the **.env** file.

1. Replace the placeholder values:

   - `FOUNDRY_PROJECT_ENDPOINT` — paste your **Project endpoint** URL
   - `AISEARCH_ENDPOINT` — paste your **Azure AI Search URL**
   - `AISEARCH_API_KEY` — paste your **Azure AI Search admin key**

   > **Important**: Paste each value inside the quotation marks (" ").

1. Press **Ctrl + S** to save the file.

## Success Criteria

- GitHub repository cloned successfully  
- Project opened in Visual Studio Code  
- Required Python dependencies installed successfully  
- `.env` file configured with the Foundry project endpoint and Azure AI Search credentials  

## Additional Resources

- https://learn.microsoft.com/azure/ai-studio/  
- https://learn.microsoft.com/azure/developer/python/