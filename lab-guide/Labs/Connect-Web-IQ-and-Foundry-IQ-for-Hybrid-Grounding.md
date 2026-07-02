# Module 05 (Optional): Connect Web IQ and Foundry IQ for Hybrid Grounding

### Estimated Duration: 45 Minutes

## 📘 Scenario

Your production RAG assistant answers questions from internal product documents, but some questions need current, real-world information that is not in your enterprise data — for example, seasonal availability or the latest outdoor conditions. In this optional module, you will add **hybrid grounding** by combining **Foundry IQ**, the knowledge layer over your enterprise data, with **Web IQ**, the live web grounding introduced at Build 2026. The assistant will draw on both your internal knowledge and the web, with citations from each source.

## 📖 Overview

In this module, you will create a Foundry IQ knowledge base that combines two knowledge sources: your existing enterprise search index and a Web IQ web knowledge source. You will connect the knowledge base to your assistant and confirm that answers are grounded in both enterprise and web content.

> [!NOTE]
> This module is optional. **Web IQ** was announced at Build 2026 and is available for select Azure customers. The screenshots are placeholders, and some portal labels may differ. Capture each screen as you complete the step, and confirm labels against the Foundry IQ documentation at [https://aka.ms/FoundryIQ-new](https://aka.ms/FoundryIQ-new).

## 🎯 Objectives

In this module, you will complete the following tasks:

- Task 1: Create an enterprise knowledge source in Foundry IQ
- Task 2: Add a Web IQ knowledge source
- Task 3: Create a knowledge base that combines both sources
- Task 4: Connect the knowledge base and test hybrid grounding

## Prerequisites

- A completed RAG app with an enterprise search index from the previous modules.
- Your Microsoft Foundry **Project endpoint** and deployed **gpt-5.4-mini** model.
- An **Azure AI Search** service with agentic retrieval enabled.
- **Web IQ** access enabled for your Azure subscription.

## Task 1: Create an Enterprise Knowledge Source in Foundry IQ

In this task, you will register your existing enterprise search index as a knowledge source so Foundry IQ can retrieve from it.

1. On your virtual machine, open a new browser tab, enter **https://ai.azure.com** in the address bar, and then open the **Microsoft Foundry** portal.

1. From the left navigation pane, select **Foundry IQ**, and then select **Knowledge sources**.

   ![To be captured](../media/foundryiq-knowledge-sources.png)

1. Select **Add knowledge source**, and then select **Search index**.

   ![To be captured](../media/foundryiq-add-search-index.png)

1. Enter the following details, and then select **Create**:

   - Name: **contoso-enterprise-source (1)**
   - Azure AI Search service: **aisearch-<inject key="DeploymentID" enableCopy="false"/> (2)**
   - Index: select the index created in the RAG pipeline module **(3)**

   ![To be captured](../media/foundryiq-enterprise-source-details.png)

1. Verify that the knowledge source appears in the knowledge sources list.

## Task 2: Add a Web IQ Knowledge Source

In this task, you will add a Web IQ knowledge source so the assistant can ground answers in live web content.

1. On the **Knowledge sources** page, select **Add knowledge source**, and then select **Web (Web IQ)**.

   ![To be captured](../media/webiq-add-web-source.png)

1. Enter **contoso-web-source** as the name, and then select **Create**.

   ![To be captured](../media/webiq-web-source-details.png)

   > [!NOTE]
   > Web IQ provides low-latency web grounding with no data retention, returning browse, news, web, video, and image results. Confirm the available configuration options against the Web IQ documentation.

1. Verify that the Web IQ knowledge source appears in the knowledge sources list.

## Task 3: Create a Knowledge Base That Combines Both Sources

In this task, you will create a Foundry IQ knowledge base that retrieves from both the enterprise source and the Web IQ source, enabling hybrid grounding.

1. From the left navigation pane, select **Foundry IQ**, and then select **Knowledge bases**.

   ![To be captured](../media/foundryiq-knowledge-bases.png)

1. Select **Create knowledge base**.

1. Enter the following details:

   - Name: **contoso-hybrid-knowledge (1)**
   - Model: **gpt-5.4-mini (2)**

   ![To be captured](../media/foundryiq-create-knowledge-base.png)

1. Under **Knowledge sources**, add both **contoso-enterprise-source (1)** and **contoso-web-source (2)**, and then select **Create (3)**.

   ![To be captured](../media/foundryiq-add-both-sources.png)

1. Verify that the knowledge base status displays **Ready** and that both knowledge sources are listed.

## Task 4: Connect the Knowledge Base and Test Hybrid Grounding

In this task, you will connect the hybrid knowledge base to your assistant and confirm that answers cite both enterprise and web sources.

1. Open the knowledge base **contoso-hybrid-knowledge**, and then copy the **Knowledge base endpoint** into a notepad.

   ![To be captured](../media/foundryiq-knowledge-base-endpoint.png)

1. Open the knowledge base **playground**, enter a question that needs internal data, such as `I need a new tent for 4 people, what would you recommend?`, and then verify that the response cites the enterprise product documents.

   ![To be captured](../media/foundryiq-playground-enterprise.png)

1. Enter a question that needs current web information, such as `What weather conditions should I plan for when camping this weekend?`, and then verify that the response cites web sources from Web IQ.

   ![To be captured](../media/foundryiq-playground-web.png)

1. Verify that the assistant returns grounded answers with citations from both the enterprise source and the Web IQ source.

You have successfully enabled hybrid enterprise and web grounding.

## 🧾 Summary

In this optional module, you added hybrid grounding to your assistant by combining Foundry IQ and Web IQ.

- First, you registered your enterprise search index as a Foundry IQ knowledge source.
- Then, you added a Web IQ knowledge source for live web grounding.
- Next, you created a knowledge base that combines both sources.
- Finally, you connected the knowledge base and confirmed that answers cite both enterprise and web content.

## 🎉 You have successfully finished the lab

In this lab, you developed a **custom Retrieval-Augmented Generation (RAG) application** using **Microsoft Foundry**. You created a hub-less project in the new Microsoft Foundry portal, deployed chat and embedding models, and connected Azure AI Search for retrieval. You built a **RAG pipeline** that indexed knowledge sources and generated grounded responses, and you evaluated and optimized it with **ASSERT**, Microsoft's open-source, policy-driven evaluation framework. You then deployed the app as a production REST endpoint using the **Rayfin** managed backend with enterprise access controls, and, optionally, added **hybrid grounding** with **Foundry IQ** and **Web IQ**. You now have the skills to design, build, evaluate, deploy, and ground enterprise-grade RAG applications on Microsoft Foundry.
