# Exercise 03: Evaluate and Optimize RAG Performance with ASSERT

### Estimated Duration: 1 Hour

## 📘 Scenario

After deploying the RAG chatbot, stakeholders report that some answers are incomplete or drift from the retrieved content and from company policy. Instead of manually inspecting prompts and eyeballing responses, you will evaluate the assistant with **ASSERT** (Adaptive Spec-driven Scoring for Evaluation and Regression Testing), Microsoft's open-source, policy-driven evaluation framework. You will describe the behaviors you expect in a specification, let ASSERT generate targeted test cases, run them against your RAG app, and use the scored results to improve the assistant and confirm the improvement.

## 📖 Overview

In this exercise, you will use **ASSERT** to evaluate your RAG pipeline. You will install ASSERT, define an evaluation specification that captures your grounding and safety requirements, wrap the RAG app as an evaluation target, run ASSERT to generate and score test cases, review the scored artifacts in the ASSERT local viewer, apply an improvement, and re-run ASSERT to validate the change.

> [!NOTE]
> ASSERT is an open-source, local-first framework. It runs from the terminal, writes inspectable JSON/JSONL artifacts locally, and uses an LLM judge to score each conversation against your specification. The screenshots in this exercise are placeholders — capture the terminal output and viewer screens as you complete each step.

## 🎯 Objectives

In this exercise, you will complete the following tasks:

- Task 1: Install and configure ASSERT
- Task 2: Define an evaluation specification and target
- Task 3: Run ASSERT and interpret the results
- Task 4: Apply an improvement and re-run ASSERT

## Task 1: Install and Configure ASSERT

In this task, you will install the ASSERT framework and configure it to use your deployed model for generating test cases and running the LLM judge.

1. Navigate back to **Visual Studio Code**.

1. Right-click the **rag/custom-rag-app (1)** folder, and then select **Open in Integrated Terminal (2)**. Make sure the terminal is in the **rag/custom-rag-app** directory.

   ![To be captured](../media/assert-open-terminal.png)

1. Clone the ASSERT repository into the current directory:

   ```bash
   git clone https://github.com/responsibleai/ASSERT.git
   ```

1. Change into the ASSERT directory:

   ```bash
   cd ASSERT
   ```

1. Install ASSERT with the OpenTelemetry extra used in this lab:

   ```bash
   pip install -e ".[otel]"
   ```

   > **Note:** Wait for the installation to complete. This might take a few minutes.

1. Create the ASSERT environment file from the provided template:

   ```bash
   copy .env.example .env
   ```

1. Open the **ASSERT/.env (1)** file, and then set the model provider values so ASSERT can call your deployed **gpt-5-mini** model and run the LLM judge. Use your Microsoft Foundry project endpoint and deployed model name.

   ![To be captured](../media/assert-env-config.png)

   > [!NOTE]
   > ASSERT connects to model endpoints through LiteLLM and supports Azure and Microsoft Foundry models. Confirm the exact variable names against the `.env.example` file and the ASSERT documentation at [https://aka.ms/assert](https://aka.ms/assert).

1. Press **Ctrl+S** to save the file.

## Task 2: Define an Evaluation Specification and Target

In this task, you will describe the behaviors your assistant must follow in a natural-language specification and wrap the RAG app as an ASSERT target. ASSERT turns the specification into executable test cases, so you no longer inspect prompts and responses manually.

1. In **Visual Studio Code**, make sure you are viewing the **rag/custom-rag-app** folder.

1. Create a new file named **assert_target.py** in the **rag/custom-rag-app** folder, add the following code, and then press **Ctrl+S** to save the file. This wraps the existing RAG app as a callable target that ASSERT can evaluate.

   ```python
   # assert_target.py
   from chat_with_products import chat_with_products


   def respond(query: str) -> str:
       result = chat_with_products(messages=[{"role": "user", "content": query}])
       return result["message"].content
   ```

1. Create a new file named **eval_config.yaml** in the **rag/custom-rag-app** folder, add the following configuration, and then press **Ctrl+S** to save the file. The specification describes the grounding, citation, clarification, and safety behaviors you expect from the assistant.

   ```yaml
   # eval_config.yaml
   target:
     type: callable
     module: assert_target
     attribute: respond

   spec:
     description: >
       The assistant answers questions about outdoor and camping gear using only the
       retrieved product documents. It stays grounded in the provided context, cites the
       products it recommends, asks a clarifying question when a request is vague, and
       declines questions unrelated to outdoor and camping gear.
     behaviors:
       - Responses are grounded in the retrieved product documents.
       - Recommendations reference specific products from the retrieved context.
       - Vague requests receive a clarifying question instead of a guess.
       - Off-topic questions are politely declined.

   judge:
     model: gpt-5-mini
   ```

   > [!NOTE]
   > This configuration mirrors the structure of the templates in the ASSERT `examples/` folder. Confirm the exact field names against the ASSERT configuration reference before running, as the schema evolves with each release.

## Task 3: Run ASSERT and Interpret the Results

In this task, you will run ASSERT against your RAG app, review the scored artifacts, and identify the behaviors where the assistant underperforms.

1. In the terminal, make sure you are in the **rag/custom-rag-app** directory.

1. Run ASSERT with your configuration file:

   ```bash
   assert-ai run --config eval_config.yaml
   ```

   > **Note:** ASSERT generates test cases from your specification, runs them against the target, and scores each conversation with an LLM judge. Expect this to take several minutes.

1. Review the console summary, which reports pass and fail results across the behaviors and judge dimensions defined in your specification.

   ![To be captured](../media/assert-run-summary.png)

1. Open the **artifacts/results (1)** folder that ASSERT created in the **ASSERT** directory. Review the generated specification, test cases, model outputs, judge scores, and judge rationale stored as JSON and JSONL files.

   ![To be captured](../media/assert-artifacts.png)

1. Open the bundled ASSERT viewer to browse the run and read the judge justifications cited against the captured responses.

   ![To be captured](../media/assert-viewer.png)

   > [!NOTE]
   > Use the ASSERT CLI reference to confirm the exact command for launching the local viewer for your installed version.

1. Identify the behaviors with the lowest scores. Note where the assistant fails to stay grounded in the retrieved documents or answers a vague request without asking for clarification.

## Task 4: Apply an Improvement and Re-run ASSERT

In this task, you will apply a prompt improvement and re-run ASSERT to confirm that the targeted behaviors score higher, using ASSERT as a regression check.

1. In **Visual Studio Code**, open the **assets/grounded_chat.prompty (1)** file, and then find the sentence `"If the question is not related to outdoor/camping gear and clothing, just say 'Sorry, I can only answer queries related to outdoor/camping gear and clothing. So, how can I help?'"` **(2)**.

   ![](../media/af74.png)

1. Replace the sentence with `If the question is related to outdoor/camping gear and clothing but vague, try to answer based on the reference documents, then ask for clarifying questions.`

   ![](../media/af75.png)

1. Press **Ctrl+S** to save the file.

1. In the terminal, re-run ASSERT with the same configuration to validate the change:

   ```bash
   assert-ai run --config eval_config.yaml
   ```

   > **Note:** Expect the evaluation to take several minutes to complete.

1. In the ASSERT viewer, pin the previous run as the baseline, and then compare it with the new run.

   ![To be captured](../media/assert-compare-runs.png)

1. Verify that the grounding and clarification behaviors score higher in the new run than in the baseline run.

   > **Note:** The scores may not exactly match the values shown in the screenshot. Judge scores can vary depending on the generated test cases and execution environment. Minor differences in results are expected.

You have successfully evaluated and improved the RAG app with ASSERT.

## 🧾 Summary

In this exercise, you evaluated and improved your RAG application with ASSERT instead of inspecting prompts and responses manually.

- First, you installed ASSERT and configured it to use your deployed **gpt-5-mini** model for test-case generation and the LLM judge.
- Then, you defined an evaluation specification capturing grounding, citation, clarification, and safety behaviors, and wrapped the RAG app as a callable target.
- Next, you ran ASSERT to generate spec-driven test cases and score responses, and reviewed the local artifacts and viewer to find low-scoring behaviors.
- After that, you improved the prompt in `grounded_chat.prompty` to guide the model toward better, more context-aware answers.
- Finally, you re-ran ASSERT and compared it against the baseline to confirm that the targeted behaviors scored higher.

### You have successfully completed the exercise. Click **Next >>** to continue to the next module.
