# Challenge 01: Create Foundry Resource and Deploy GPT Model

## Introduction

Contoso Trek plans to build an AI-powered assistant that can answer product-related questions using internal product knowledge. Before building the Retrieval-Augmented Generation (RAG) pipeline, the team must first provision the core AI infrastructure that will power the assistant.

**Microsoft Foundry** provides a unified environment for deploying generative AI models and managing AI application workflows. By creating a Foundry resource and deploying a generative AI model, you establish the foundation that will later generate responses based on retrieved knowledge.

In this challenge, you will deploy a **Microsoft Foundry resource** and create a **GPT-4.1-Mini model deployment** that will later be used by the RAG application to generate intelligent responses.

## Challenge Objectives

- Create a **Microsoft Foundry resource** in Azure.  
- Launch the **Foundry portal**.  
- Deploy the **GPT-4.1-Mini** model.  
- Verify that the model deployment is active and ready for use.

## Steps to Complete

1. In the **Azure Portal**, search for **Microsoft Foundry** and select it.

1. In the **Use with Foundry** tab, click on **AI Hubs**.

1. Click on **+ Create** and select **Hub**.

1. Configure the **Azure AI hub Hub**:

    - **Subscription:** Select the **defualt** Subscription.
    - **Resource Group:** **challenge-rg-<inject key="DeploymentID" enableCopy="false"/>**
    - **Region:** **<inject key="Region"></inject>** 
    - **Name:** **rag-foundry-<inject key="DeploymentID" enableCopy="false"/>**
    - Leave the remaining to default values.

1. Click **Review + Create**, then click **Create**.

1. Wait for the deployment to complete.

1. Once created, click **Launch Azure AI Foundry** in the overview section.

1. In **Microsoft Foundry** portal.

1. From the left navigation pane, select **Overview** and click on **+ New Project**.

1. Enter Project name as **ContosoTrek-<inject key="DeploymentID" enableCopy="false"/>** and click on **Create**.

1. From the left navigation pane, select **Model catalog**.

1. Scroll down and search for **gpt-4.1-mini** and then **select** it.

1. Click on **Use this model**.

1. Select **Direct from Azure models** as Purchase options.

1. Configure the deployment settings:

    - **Deployment type**: **Global Standard**
    - Click **Customize**.
    - **Tokens per Minute Rate Limit**: **20K**

        > **Important**: Do not increase the TPM limit beyond 20K to avoid exceeding quota limits and additional costs.

1. Deploy the model.

    > **Note:** If you are unable to deploy gpt-4.1-mini or the quota shows as zero, try changing the deployment type to Standard. If the issue persists, deploy the gpt-4.1 model instead

1. Wait for the deployment to complete.

1. Once deployment finishes, confirm that the **GPT-4.1-Mini model** appears in the **Models + Endpoints** page.

<validation step="4a99c81b-3177-4b3e-9736-fbcd2d36f11c" />
 
> **Congratulations** on completing the Challenge! Now, it's time to validate it. Here are the steps:
> - Hit the Validate button for the corresponding Challenge. If you receive a success message, you can proceed to the next Challenge. 
> - If not, carefully read the error message and retry the step, following the instructions in the lab guide.
> - If you need any assistance, please contact us at cloudlabs-support@spektrasystems.com. We are available 24/7 to help.

## Success Criteria

- Microsoft Foundry resource successfully deployed.  
- Foundry portal accessible.  
- **GPT-4.1-Mini** model successfully deployed.  
- Model deployment visible in **Models + Endpoints**.

## Additional Resources

- https://learn.microsoft.com/azure/ai-studio/  
- https://learn.microsoft.com/azure/ai-services/openai/how-to/deploy-models