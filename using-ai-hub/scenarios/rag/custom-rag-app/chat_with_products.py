# ruff: noqa: E402, RUF013

# <imports_and_config>
import os
from pathlib import Path
from opentelemetry import trace
from config import ASSET_PATH, get_logger, enable_telemetry, get_openai_client
from get_product_documents import get_product_documents


# initialize logging and tracing objects
logger = get_logger(__name__)
tracer = trace.get_tracer(__name__)

# create an OpenAI client for chat completions
openai_client = get_openai_client()
# </imports_and_config>

# <chat_function>


@tracer.start_as_current_span(name="chat_with_products")
def chat_with_products(messages: list, context: dict = None) -> dict:
    if context is None:
        context = {}

    documents = get_product_documents(messages, context)

    # do a grounded chat call using the search results
    grounded_chat_prompt_file = Path(ASSET_PATH) / "grounded_chat.prompty"
    with open(grounded_chat_prompt_file, "r") as f:
        prompty_content = f.read()

    # Build system message from documents
    system_message = (
        "You are an AI assistant helping users with questions about outdoor products. "
        "Use the following context to answer the user's question. "
        "If you cannot answer based on the context, say so.\n\n"
        f"Context:\n{documents}"
    )

    all_messages = [{"role": "system", "content": system_message}] + messages

    response = openai_client.chat.completions.create(
        model=os.environ["CHAT_MODEL"],
        messages=all_messages,
        temperature=0.7,
        max_tokens=800,
    )
    logger.info(f"💬 Response: {response.choices[0].message}")

    # Return a chat protocol compliant response
    return {"message": response.choices[0].message, "context": context}


# </chat_function>

# <test_function>
if __name__ == "__main__":
    import argparse

    # load command line arguments
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--query",
        type=str,
        help="Query to use to search product",
        default="I need a new tent for 4 people, what would you recommend?",
    )
    parser.add_argument(
        "--enable-telemetry",
        action="store_true",
        help="Enable sending telemetry back to the project",
    )
    args = parser.parse_args()
    if args.enable_telemetry:
        enable_telemetry(True)

    # run chat with products
    response = chat_with_products(messages=[{"role": "user", "content": args.query}])
# </test_function>
