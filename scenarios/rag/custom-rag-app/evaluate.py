# ruff: noqa: E402, ANN201, ANN001

# <imports_and_config>
import os
import pandas as pd
from azure.ai.evaluation import evaluate, GroundednessEvaluator
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

from chat_with_products import chat_with_products

# load environment variables from the .env file at the root of this repo
from dotenv import load_dotenv

load_dotenv()

from config import AZURE_OPENAI_ENDPOINT, token_provider

evaluator_model = {
    "azure_endpoint": AZURE_OPENAI_ENDPOINT,
    "azure_deployment": os.environ["EVALUATION_MODEL"],
    "api_version": "2024-06-01",
    "azure_ad_token_provider": token_provider,
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

    with contextlib.suppress(RuntimeError):
        multiprocessing.set_start_method("spawn", force=True)

    # run evaluation with a dataset and target function, log to the project
    result = evaluate(
        data=Path(ASSET_PATH) / "chat_eval_data.jsonl",
        target=evaluate_chat_with_products,
        evaluation_name="evaluate_chat_with_products",
        evaluators={
            "groundedness": groundedness,
        },
        evaluator_config={
            "default": {
                "query": {"${data.query}"},
                "response": {"${target.response}"},
                "context": {"${target.context}"},
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
