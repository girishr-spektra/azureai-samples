# Challenge 02: Deploy Embedding Model and Create Azure AI Search Service

## Introduction

In a Retrieval-Augmented Generation (RAG) system, generative AI alone is not sufficient. The system must retrieve relevant information from a knowledge base before generating a response. To enable this capability, the application requires two key components:

- An **embedding model** to convert text into vector representations.
- A **vector-enabled search service** to store and retrieve those embeddings efficiently.

Azure **AI Search** acts as the retrieval engine for the RAG system, storing vectorized documents and enabling semantic and hybrid search. The **embedding model** converts documents and queries into vectors so the search engine can identify the most relevant information.

In this challenge, you will deploy an **embedding model** and create an **Azure AI Search service** that will later store and retrieve the product knowledge used by the RAG assistant.

## Challenge Objectives

- Deploy the **text-embedding-ada-002** model in Foundry.  
- Create an **Azure AI Search** service.  
- Prepare the search service that will be used for indexing product data.

## Steps to Complete

1. In **Microsoft Foundry** portal.

1. From the left navigation pane, select **Model catalog**.

1. Scroll down and search for **text-embedding-ada-002** and then **select** it.

   > **Important**: Select the model that displays the OpenAI logo.

1. Click on **Use this model**.

1. Select **Direct from Azure models** as Purchase options.

1. Configure the deployment settings:

    - **Deployment type**: **Global Standard**
    - Click **Customize**.
    - **Tokens per Minute Rate Limit**: **20K**

        > **Important**: Do not increase the TPM limit beyond 20K to avoid exceeding quota limits and additional costs.

1. Deploy the model.

1. Wait for the deployment to complete.

1. Once deployment finishes, verify that **text-embedding-ada-002** appears in the **Models + Endpoints** page.

### Create Azure AI Search Service

1. Open the **Azure Portal** in a new browser tab.

1. In the search bar, type **AI Search**, then select **AI Search** from the results.

1. Click **+ Create**.

1. Configure the search service using the following values:

   - **Subscription:** Select the **defualt** Subscription.
   - **Resource Group:** **challenge-rg-<inject key="DeploymentID" enableCopy="false"/>**
   - **Service Name:** **aisearch-<inject key="DeploymentID" enableCopy="false"/>**
   - **Location:** **<inject key="Region"></inject>** 
   - **Pricing Tier:** `Standard`

1. Click **Review + Create**, then click **Create**.

1. Wait for the deployment to complete.

   > **Note:** Azure AI Search deployment may take **10–15 minutes** depending on the region.

1. Once deployment finishes, open the **AI Search resource** and verify that the service is active.

### Connect the Azure AI Search to your Project

1. Navigate back to the **Microsoft Foundry** portal, and select **Management center** from the left pane.

1. In the left menu, under **Contoso Trek** project that you created earlier,select **Connected resources**.

1. In the next pane, click on **+New COnnection**.

1. Search for Azure **AI Search**, then select **Azure AI Search**.

1. Search for the Azure AI Search service you created, **aisearch-<inject key="DeploymentID" enableCopy="false"/>**. Choose **API key** as authentication and then select **Add connection**.

1. Make sure that AI Search shows **Connected** status.

<validation step="f234f6e4-256b-4da5-b083-11b0c1cd934d" />
 
> **Congratulations** on completing the Challenge! Now, it's time to validate it. Here are the steps:
> - Hit the Validate button for the corresponding Challenge. If you receive a success message, you can proceed to the next Challenge. 
> - If not, carefully read the error message and retry the step, following the instructions in the lab guide.
> - If you need any assistance, please contact us at cloudlabs-support@spektrasystems.com. We are available 24/7 to help.

## Success Criteria

- **text-embedding-ada-002** model successfully deployed.  
- Azure **AI Search** service created successfully.  
- Search service status shows **Running** and ready for indexing.

## Additional Resources

- https://learn.microsoft.com/azure/search/search-what-is-azure-search  
- https://learn.microsoft.com/azure/ai-services/openai/concepts/embeddings