# Azure AI Foundry Challenge-Based Hack Labs

---

## Challenge 1: Enhance the AI Agent
**Estimated Duration:** 40 Minutes  

---

### Problem Statement
Integrate observability and tracing mechanisms to monitor AI agent interactions using **OpenTelemetry** and **Azure Monitor**.  
Evaluate AI models for quality, safety, and security while running automated assessments for LLM outputs.

---

### Goals
- Configure tracing in Azure AI Foundry SDK.  
- Monitor AI agent performance via VS Code notebooks.  
- Capture insights using Azure Monitor.

---

### Challenge Objectives

1. Open `2-notebooks/3-quality_attributes/1-Observability.ipynb`.
2. Select Kernel: `ai-foundry-workshop (Python 3.12.1)`.
3. Execute cells sequentially to initialize environment and client.
4. Create a tracing session in Azure AI Foundry portal:
   - Go to **Tracing → Create new → Name:** `insights-`.
5. Execute remaining notebook cells to trace AI interactions.

---

###  Validation Check
- Outputs from each executed cell should match expected results.  
- Tracing session should appear in Azure AI Foundry portal.

---

### Success Criteria
- Observability integrated successfully.  
- Agent interactions captured in Azure Monitor.  
- Step-by-step tracing workflow completed.

---

## Challenge 2: Fitness-Fun AI Workshop
**Estimated Duration:** 40 Minutes  

---

### Problem Statement
Build an **AI-driven fitness assistant** by integrating **Azure AI Search** with a **Semantic Kernel Agent**.  
Extend capabilities using **Autogen** for multi-agent orchestration and **Retrieval-Augmented Generation (RAG)**.

---

### Goals
- Implement search and RAG for fitness queries.  
- Enable multi-agent asynchronous interactions.  
- Configure GitHub authentication for secure environment.

---
### Challenge Objectives

#### Task 1: Azure AI Search + Semantic Kernel + AI Agents
1. Update the semantic kernel package:
   ```bash
   uv pip install semantic-kernel[azure]==1.28.0 --prerelease=allow
   ```
2. Open `2-notebooks/4-frameworks/1-rag-sk-agents-aisearch.ipynb`.
3. Select Kernel: `ai-foundry-workshop (Python 3.12.1)`.
4. Execute notebook cells sequentially.

---

####  Task 2: Multi-Agent RAG for Fitness & Health
1. Sign in to GitHub → Generate **PAT token** → Paste into `.env` as `GITHUB_TOKEN`.
2. Open `2-notebooks/4-frameworks/2-autogen-multi-agent-rag.ipynb`.
3. Select Kernel → Execute notebook cells.
4. Restart kernel if issues arise.

---

###  Validation Check
- Successful execution of all notebook cells.  
- Multi-agent RAG system functional and connected to Azure AI Foundry.

---

### Success Criteria
- Indexed fitness data retrieved dynamically.  
- Multi-agent reasoning pipeline operational.  
- GitHub authentication integrated.

---

## Challenge 3: Developing a Custom RAG Application Using Azure AI Foundry
**Overall Estimated Duration:** 4 Hours  

---

###  Problem Statement
Build a **custom Retrieval-Augmented Generation (RAG) application** using **Azure AI Foundry SDK**.  
Retrieve relevant knowledge from indexed data and generate accurate AI responses.

---

###  Goals
- Set up Azure AI Foundry SDK and provision resources.  
- Build RAG pipeline integrating knowledge indexing, retrieval, and response generation.  
- Add telemetry and evaluate RAG performance.

---

### Datasets
- `assets/products.csv` – product dataset for retrieval  
- `assets/chat_eval_data.jsonl` – evaluation dataset  
- Prompt templates: `intent_mapping.prompty`, `grounded_chat.prompty`

---

###  Challenge Objectives

####  Task 1: Project Setup
1. Azure Portal → Search **Azure AI Foundry** → **AI Hubs** → **+ Create Hub**.  
2. Enter:  
   - Resource Group: `ragsdk-`  
   - Hub Name: `ContosoHub`  
3. Launch Azure AI Foundry → + New Project → Name: `ContosoTrek`

---

####  Task 2: Deploy AI Models
- GPT-4.1-mini (chat) → Global Standard → Deploy  
- text-embedding-ada-002 → Standard → Deploy  
- Confirm under **Models + Endpoints**

---

####  Task 3: Azure AI Search Service
- Service name: `aisearch-`  
- Resource Group: `ragsdk-`  
- Pricing tier: **Standard**  
- Deploy

---

####  Task 4: Connect AI Search to Project
- **Management Center → Connected Resources → + New Connection → Azure AI Search**  
- Authenticate with API key

---

####  Task 5: Clone GitHub Repository
```bash
git clone --branch prod https://github.com/CloudLabsAI-Azure/azureai-samples.git C:\Users\demouser\Downloads\ContosoTrek
```
- Open folder in **VS Code**  
- Install dependencies:
```bash
pip install -r requirements.txt
python -m pip install --upgrade pip
pip install azure-ai-projects==1.0.0b5
pip install azure-ai-inference==1.0.0b8
```

---

####  Task 6: Configure Environment Variables
- Copy Project connection string → `.env`  
```text
GCPROJECT_CONNECTION_STRING=your_connection_string
```

---

####  Task 7: Build RAG Pipeline
1. **Index Knowledge Sources**
   ```bash
   az login
   python create_search_index.py
   ```
2. **Implement Retrieval Pipeline**
   ```bash
   python get_product_documents.py --query "I need a new tent for 4 people, what would you recommend?"
   ```
3. **Generate Responses**
   ```bash
   python chat_with_products.py --query "I need a new tent for 4 people, what would you recommend?"
   ```
4. **Add Telemetry**
   ```bash
   pip install azure-monitor-opentelemetry
   python chat_with_products.py --query "..." --enable-telemetry
   ```

---

####  Task 8: Evaluate and Optimize
1. Modify `evaluate.py` to include:
   ```python
   from azure.ai.evaluation import CoherenceEvaluator, RelevanceEvaluator
   coherence = CoherenceEvaluator(evaluator_model)
   relevance = RelevanceEvaluator(evaluator_model)
   ```
2. Install evaluation dependencies:
   ```bash
   pip install azure-ai-evaluation[remote]
   python evaluate.py
   ```
3. Fine-tune prompt template (`grounded_chat.prompty`) → Re-run evaluation.

---

###  Validation Check
- Project, models, and search service deployed successfully  
- RAG pipeline retrieves relevant data and generates responses  
- Telemetry data captured in Application Insights  
- Evaluation metrics (Relevance, Groundedness, Coherence) improved after fine-tuning

---

###  Success Criteria
- Functional RAG app integrated with Azure AI Foundry  
- Responses grounded and contextually relevant  
- Performance and evaluation metrics optimized

---
##  Additional Resources
- [Azure AI Foundry Documentation](https://learn.microsoft.com/en-us/azure/ai-foundry/)  
- [Azure OpenAI Service](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/)  
- [Azure Cognitive Search](https://learn.microsoft.com/en-us/azure/search/)  
- [GitHub RAG Sample Repository](https://github.com/CloudLabsAI-Azure/azureai-samples)

---

##  Conclusion
Through these labs, you have gained hands-on experience with:

- Observability and tracing with OpenTelemetry and Azure Monitor  
- Multi-agent AI systems for fitness and health applications  
- Building, deploying, and optimizing Retrieval-Augmented Generation (RAG) applications  
- Integrating AI models, search services, telemetry, and evaluation pipelines in Azure AI Foundry  

You are now equipped to **design, deploy, and monitor advanced AI-driven solutions** with Azure AI Foundry, applying best practices for reliability, transparency, and compliance.
