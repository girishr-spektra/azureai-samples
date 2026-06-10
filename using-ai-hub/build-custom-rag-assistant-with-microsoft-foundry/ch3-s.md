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

1. Open a **New Terminal**.

1. Run the following command to clone the project repository:

   ```
   git clone --branch prod https://github.com/CloudLabsAI-Azure/azureai-samples.git C:\Users\demouser\Downloads\ContosoTrek
   ```

1. Open the cloned folder in **Visual Studio Code**.

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

1. Install the Microsoft Foundry SDK packages:

   ```
   pip install azure-ai-projects==1.0.0b5
   ```

1. Install the inference SDK:

   ```
   pip install azure-ai-inference==1.0.0b8
   ```

    > **Note:** Installation may take several minutes depending on the environment.
 
### Configure Environment Variables

1. Navigate back to the **Microsoft Foundry portal**. Open your **project** and get the **Project connection string**.

1. Return to **Visual Studio Code**.

1. Locate the file:

   `.env.sample`

1. Rename the file to:

   `.env`

1. Replace the placeholder value `your_connection_string` with the **Project connection string** in the `.env` file.

## Success Criteria

- GitHub repository cloned successfully  
- Project opened in Visual Studio Code  
- Required Python dependencies installed successfully  
- `.env` file configured with the Foundry project connection string  

## Additional Resources

- https://learn.microsoft.com/azure/ai-studio/  
- https://learn.microsoft.com/azure/developer/python/