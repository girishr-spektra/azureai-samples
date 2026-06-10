# Challenge 06: Evaluate and Optimize the RAG System

## Introduction

Building a working RAG system is only the first step. To ensure that AI responses remain reliable and useful, developers must continuously **evaluate and improve system performance**.

Microsoft Foundry provides **AI evaluation tools** that help measure important quality metrics such as:

- **Groundedness** – Whether the response is supported by retrieved documents  
- **Relevance** – Whether the response answers the user’s question  
- **Coherence** – Whether the response is logically structured and readable  

In this challenge, you will run an **evaluation script** to measure the performance of your RAG assistant. You will then analyze the evaluation results and improve system behavior by adjusting the **prompt template** used for response generation.

## Challenge Objectives

- Review the evaluation dataset  
- Modify the evaluation script to include additional evaluation metrics  
- Run the evaluation pipeline  
- Analyze the evaluation results in Microsoft Foundry  
- Improve the system by updating the prompt instructions  

## Steps to Complete

### Update the Evaluation Script

1. Open the file:

   `evaluate.py`

1. Locate the section labeled:

   `<imports_and_config>`

1. Add the following import statement before the environment variables are loaded:

   ```
   from azure.ai.evaluation import CoherenceEvaluator, RelevanceEvaluator
   ```

1. Scroll further down and locate the end of the `</imports_and_config>` section.

1. Add the following code after the `groundedness = GroundednessEvaluator(evaluator_model)` line and before `</imports_and_config>`.

   ```
   coherence = CoherenceEvaluator(evaluator_model)
   relevance = RelevanceEvaluator(evaluator_model)
   ```

1. Locate the section labeled:

   `<run_evaluation>`

1. Add the following metrics below the existing **groundedness** metric under `"groundedness": groundedness,` line and save:

   ```
   "coherence": coherence,
   "relevance": relevance,
   ```

### Install the Evaluation Package

1. In the **VS Code terminal**, ensure you are inside the directory:

   `rag/custom-rag-app`

1. Install the evaluation package by running:

   ```
   pip install azure-ai-evaluation
   ```

> **Note:** Installation may take several minutes.

### Run the Evaluation Script

1. Execute the evaluation script:

   ```
   python evaluate.py
   ```

1. Wait for the evaluation process to complete.

> **Note:** The evaluation process may take **5–10 minutes**.

> **Note:** You may see timeout warnings during execution. These are expected and the script will continue running.

1. After completion, the terminal will display evaluation metrics and provide a **link to the evaluation results**. Navigate and review the evaluation details.

### Analyze Evaluation Results

1. In the **Foundry portal**. Review the average scores for:

   - **Relevance**
   - **Groundedness**
   - **Coherence**

### Improve the Prompt Instructions

1. Return to **Visual Studio Code**.

1. Open the file:

   `assets/grounded_chat.prompty`

1. Locate the following instruction:

   `If the question is not related to outdoor/camping gear and clothing, just say 'Sorry, I can only answer queries related to outdoor/camping gear and clothing. So, how can I help?'`

1. Replace it with the following instruction:

   `If the question is related to outdoor/camping gear and clothing but vague, try to answer based on the reference documents, then ask for clarifying questions.`

1. Save the file.

### Re-run the Evaluation

1. Run the evaluation script again:

   ```
   python evaluate.py
   ```

1. Wait for the evaluation process to complete.

1. Open the evaluation results again from the generated link.

1. Compare the **Relevance, Groundedness, and Coherence scores** with the previous run.

<validation step="2acbb410-48c3-4d7f-a1a6-0a20a92a8fc7" />
 
> **Congratulations** on completing the Challenge! Now, it's time to validate it. Here are the steps:
> - Hit the Validate button for the corresponding Challenge. If you receive a success message, you can proceed to the next Challenge. 
> - If not, carefully read the error message and retry the step, following the instructions in the lab guide.
> - If you need any assistance, please contact us at cloudlabs-support@spektrasystems.com. We are available 24/7 to help.

## Success Criteria

- Evaluation dataset reviewed successfully  
- Evaluation script updated with additional metrics  
- Evaluation pipeline executed successfully  
- Evaluation results visible in Microsoft Foundry  
- Prompt updated and evaluation re-run to improve performance  

## Additional Resources

- https://learn.microsoft.com/azure/ai-studio/concepts/evaluation  
- https://learn.microsoft.com/azure/ai-services/openai/concepts/prompt-engineering