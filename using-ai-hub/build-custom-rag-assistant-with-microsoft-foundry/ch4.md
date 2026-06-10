# Challenge 04: Index Knowledge Data and Build the Retrieval Pipeline

## Introduction

Now that the application environment is ready, the next step is to prepare the knowledge base that the AI assistant will use to answer questions. In a Retrieval-Augmented Generation (RAG) system, documents must first be converted into **vector embeddings** and stored in a searchable index.

This indexing process enables the application to retrieve the most relevant documents when a user asks a question. The retrieved documents then serve as context for the generative AI model.

In this challenge, you will run a script that **creates an Azure AI Search index**, converts product information into vector embeddings, and stores them in the search service. You will then test the **retrieval pipeline** by running a query and verifying that the system returns relevant documents.

## Challenge Objectives

- Review the dataset used for the RAG knowledge base  
- Create a vector search index in Azure AI Search  
- Convert product data into embeddings and upload them to the search index  
- Test the retrieval pipeline by running a query  

## Steps to Complete

### Review the Knowledge Dataset

1. In **Visual Studio Code**, expand the **assets** folder.

1. Open the file `products.csv`.

1. Review the dataset. This file contains product information that will be indexed and used by the AI assistant when answering user questions.

### Create the Search Index

1. In the **custom-rag-app** folder, open the file:

   `create_search_index.py`

1. This script performs the following tasks:

   - Connects to the Microsoft Foundry project  
   - Uses the embedding model to generate vectors  
   - Creates a search index in Azure AI Search  
   - Uploads product data into the index  

1. No code modifications are required for this script.

### Authenticate with Azure

1. Open the **VS Code integrated terminal**.

1. Ensure you are in the directory:

   `rag/custom-rag-app`

1. Sign in to Azure by running the following command:
   
   ```
   az login
   ```

1. A browser window will open. Sign in using the lab credentials provided. You might have to minimize all the opened window to see the pop up window.

1. Select **Work or School** account fro login and use the environment provide credentials to login.

1. Once authentication completes, return to the terminal.

1. Press **Enter** to select the default subscription if prompted.

### Run the Indexing Script

1. Run the following command to build the search index and upload the dataset:

   ```
   python create_search_index.py
   ```

1. The script will:

   - Generate embeddings for the dataset  
   - Create an Azure AI Search index  
   - Upload the vectorized product documents  

1. Wait for the script to complete.

### Test the Retrieval Pipeline

1. Open the file:

   `get_product_documents.py`

1. This script retrieves documents from the search index based on a user query.

1. No modifications are required.

1. Run the following command to test document retrieval:

   ```
   python get_product_documents.py --query "I need a new tent for 4 people, what would you recommend?"
   ```

1. Review the output in the terminal.

1. You should see product documents returned from the search index that match the query.

<validation step="420bab18-5baf-43ad-b63e-1b2c323c45df" />
 
> **Congratulations** on completing the Challenge! Now, it's time to validate it. Here are the steps:
> - Hit the Validate button for the corresponding Challenge. If you receive a success message, you can proceed to the next Challenge. 
> - If not, carefully read the error message and retry the step, following the instructions in the lab guide.
> - If you need any assistance, please contact us at cloudlabs-support@spektrasystems.com. We are available 24/7 to help.

## Success Criteria

- Product dataset reviewed successfully  
- Azure AI Search index created successfully  
- Product data converted into embeddings and stored in the index  
- Retrieval script successfully returns relevant documents  

## Additional Resources

- https://learn.microsoft.com/azure/search/vector-search-overview  
- https://learn.microsoft.com/azure/ai-services/openai/concepts/embeddings