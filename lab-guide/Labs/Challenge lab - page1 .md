# Developing a Custom RAG App Using Azure AI Foundry

Welcome to the Copilot Hackathon! Today, you’ll build a custom Retrieval-Augmented Generation (RAG) application using the Azure AI Foundry SDK. You’ll provision the right Azure resources, wire up Azure AI Search, and implement a retrieval-enhanced generation flow—then evaluate and optimize it for accuracy, quality, and efficiency.

## Introduction
Your quest is to create a RAG-powered application that retrieves relevant knowledge and augments model responses. You’ll set up Azure AI Foundry (projects, model deployments), configure Azure AI Search with vector indexing, and develop the end-to-end pipeline in VS Code. By the end, you’ll have a working solution with telemetry and evaluation to guide improvements.

## Learning Objectives
By participating in this hackathon, you will learn how to:
- Set up the Azure AI Foundry SDK and provision core resources (project, model deployments, Azure AI Search), initialize a repo, and configure environment variables.
- Build a RAG pipeline: ingest/index data, implement retrieval + generation, and add telemetry to monitor performance.
- Evaluate and optimize: use Azure AI evaluators to measure retrieval accuracy and response quality, interpret results, and fine-tune for efficiency.

## Hackathon Format: Challenge-Based
This hackathon adopts a challenge-based format, offering you a unique opportunity to learn while dealing with a practical problem. The challenge includes one or more objectives designed to test and enhance your skills in specific aspects.

- Analyzing the problem statement.  
- Strategizing your approach to find the most effective solution.  
- Leveraging the provided lab environment and Azure AI services.

## Challenge Overview
Begin by creating an Azure AI Foundry project and deploying both a GPT-class model and a text-embedding model. Configure Azure AI Search with a vector index, then ingest your knowledge sources. Implement the RAG pipeline that (1) embeds and indexes documents, (2) retrieves top-K context for a user query, and (3) generates grounded answers. Add telemetry to capture retrieval and response metrics. Finally, run evaluations in Azure AI Foundry to assess retrieval accuracy and response quality, analyze findings, and iterate on your indexing, prompts, or parameters to improve the system.

**Happy Hacking!!**
