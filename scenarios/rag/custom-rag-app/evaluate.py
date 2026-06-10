# ruff: noqa: E402, ANN201, ANN001

# <imports_and_config>
import os
import pandas as pd
from azure.ai.evaluation import evaluate, GroundednessEvaluator

from chat_with_products import chat_with_products

# load environment variables from the .env file at the root of this repo
from dotenv import load_dotenv

load_dotenv()

from config import AZURE_OPENAI_ENDPOINT

evaluator_model = {
    "azure_endpoint": AZURE_OPENAI_ENDPOINT,
    "azure_deployment": os.environ["EVALUATION_MODEL"],
    "api_version": "2024-06-01",
    "api_key": os.environ["AZURE_OPENAI_API_KEY"],
}

groundedness = GroundednessEvaluator(evaluator_model)
# </imports_and_config>


# create a wrapper function that implements the evaluation interface for query & response evaluation
# <evaluate_wrapper>
def evaluate_chat_with_products(query):
    response = chat_with_products(messages=[{"role": "user", "content": query}])
    return {"response": response["message"].content, "context": response["context"]["grounding_data"]}


# </evaluate_wrapper>

# <run_evaluation>
# Evaluate must be called inside of __main__, not on import
if __name__ == "__main__":
    from config import ASSET_PATH

    # workaround for multiprocessing issue on linux
    from pprint import pprint
    from pathlib import Path
    import multiprocessing
    import contextlib
    import json

    with contextlib.suppress(RuntimeError):
        multiprocessing.set_start_method("spawn", force=True)

    # Pre-run target function on evaluation data to avoid batch engine compatibility issues
    eval_data_path = Path(ASSET_PATH) / "chat_eval_data.jsonl"
    precomputed_path = Path("./precomputed_eval_data.jsonl")

    print("Running target function on evaluation data...")
    with open(eval_data_path, "r") as f_in, open(precomputed_path, "w") as f_out:
        for line in f_in:
            row = json.loads(line.strip())
            query = row["query"]
            try:
                result = evaluate_chat_with_products(query)
                row["response"] = result["response"]
                row["context"] = result["context"]
            except Exception as e:
                print(f"  Warning: failed for query '{query}': {e}")
                row["response"] = ""
                row["context"] = ""
            f_out.write(json.dumps(row) + "\n")
    print("Target function completed. Running evaluators...")

    # run evaluation with pre-computed data (no target function needed)
    result = evaluate(
        data=str(precomputed_path),
        evaluation_name="evaluate_chat_with_products",
        evaluators={
            "groundedness": groundedness,
        },
        evaluator_config={
            "default": {
                "query": {"${data.query}"},
                "response": {"${data.response}"},
                "context": {"${data.context}"},
            }
        },
        azure_ai_project=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
        output_path="./myevalresults.json",
    )

    tabular_result = pd.DataFrame(result.get("rows"))

    pprint("-----Summarized Metrics-----")
    pprint(result["metrics"])
    pprint("-----Tabular Result-----")
    pprint(tabular_result)
    pprint(f"View evaluation results in AI Studio: {result['studio_url']}")
# </run_evaluation>

# If encountering issues with uploading evaluation results, check out
# the troubleshooting guide for known issues and workarounds:
# https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/evaluation/azure-ai-evaluation/TROUBLESHOOTING.md#troubleshoot-remote-tracking-issues
