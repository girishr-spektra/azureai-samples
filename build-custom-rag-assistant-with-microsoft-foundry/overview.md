# Build Custom RAG Assistant with Microsoft Foundry

## Overall Estimated Duration: 6 Hours

Welcome to the Build Custom RAG Assistant Hack in a Day! Today, you’ll explore how AI can transform knowledge-driven applications by building an intelligent assistant that retrieves relevant information from a knowledge base and generates context-aware responses using generative AI. Through this hands-on lab, you will create a Retrieval-Augmented Generation (RAG) Assistant capable of indexing knowledge sources, retrieving relevant context using vector search, generating grounded responses with large language models, and evaluating system performance, powered by Microsoft Foundry, Azure AI Search, and Azure OpenAI models.

## Scenario

Contoso Trek is an outdoor equipment company that sells camping and hiking gear worldwide. Customers frequently ask questions about products such as tents, backpacks, and camping accessories. Currently, customer support agents manually search through product catalogs and documentation to answer these queries, which leads to slower responses and inconsistent information delivery.

To improve customer experience and scale support operations, Contoso Trek decides to build an AI-powered product assistant. This assistant will retrieve relevant product information from internal data sources and generate intelligent responses using generative AI. By integrating Azure AI Search for retrieval and Azure OpenAI models for response generation, the assistant can provide fast, accurate, and context-aware answers grounded in company knowledge.

## Introduction

Your mission is to build an AI-powered Retrieval-Augmented Generation (RAG) Assistant that helps users ask questions about products and receive accurate responses grounded in a knowledge base. Using Microsoft Foundry, Azure AI Search, and Python, you will design an end-to-end solution that can:

- Index product data and create a searchable vector knowledge base
- Retrieve relevant documents using semantic and vector search
- Generate responses using a generative AI model
- Monitor and trace system behavior using telemetry
- Evaluate and optimize response quality using AI evaluation tools

This solution enables organizations to build intelligent assistants that combine knowledge retrieval with generative AI, ensuring that responses remain accurate, relevant, and grounded in real data.

## Learning Objectives

By participating in this Hack in a Day, you will learn how to:

- Create and configure a Microsoft Foundry Project
- Deploy GPT-4.1-Mini and embedding models within Microsoft Foundry
- Provision and configure Azure AI Search as a vector retrieval engine
- Build a Retrieval-Augmented Generation (RAG) pipeline using Python
- Retrieve relevant knowledge from indexed datasets
- Generate grounded responses using Azure OpenAI models
- Enable telemetry monitoring using Application Insights
- Evaluate system performance using Azure AI evaluation tools

## Hack in a Day Format: Challenge-Based

This hands-on lab is structured into six progressive challenges that model the lifecycle of building a real-world AI knowledge assistant:

- **Challenge 01: Create Microsoft Foundry Project and Deploy Models**  
  Create a Foundry project and deploy the AI models that will power the RAG assistant.

- **Challenge 02: Deploy AI Models and Configure Azure AI Search**  
  Deploy generative and embedding models and provision Azure AI Search for knowledge retrieval.

- **Challenge 03: Configure the Development Environment and Application Code**  
  Clone the sample repository, install dependencies, and configure environment variables required for the RAG application.

- **Challenge 04: Build and Test the Retrieval Pipeline**  
  Index knowledge sources and implement the retrieval pipeline to fetch relevant documents from the search index.

- **Challenge 05: Generate Knowledge-Grounded Responses and Enable Telemetry**  
  Integrate generative AI to produce responses based on retrieved knowledge and enable telemetry monitoring using Application Insights.

- **Challenge 06: Evaluate and Optimize the RAG System**  
  Evaluate response quality using Azure AI evaluators and improve system performance through prompt tuning.

Throughout each challenge, you will iteratively design, build, and test your RAG assistant, from environment setup to knowledge indexing, response generation, and system evaluation.

## Challenge Overview

You will begin by creating a Microsoft Foundry Project, which will serve as the central environment for managing AI resources. Next, you will deploy Azure OpenAI models and configure Azure AI Search to act as the vector database for storing and retrieving knowledge embeddings.

After preparing your development environment in Visual Studio Code, you will implement a Retrieval-Augmented Generation pipeline that retrieves relevant product information and uses it to generate grounded responses using generative AI.

You will then enable telemetry logging with Application Insights to monitor application behavior and trace system activity. Finally, you will evaluate the system using Azure AI evaluators, analyze metrics such as relevance, groundedness, and coherence, and refine prompts to improve response quality.

By the end of this Hack in a Day, you will have a fully functional RAG-based AI assistant capable of retrieving product knowledge, generating intelligent responses, and evaluating the quality of AI-generated answers.

## Support Contact

The CloudLabs support team is available 24/7, 365 days a year via email and live chat to ensure seamless assistance throughout the lab. Dedicated support channels are available for both learners and instructors.

**Learner Support Contacts**  
- Email: cloudlabs-support@spektrasystems.com  
- Live Chat: https://cloudlabs.ai/labs-support

Click **Next** from the bottom-right corner to continue.