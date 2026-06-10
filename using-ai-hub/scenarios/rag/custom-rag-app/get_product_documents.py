# ruff: noqa: E402, RUF013

# <imports_and_config>
import os
from pathlib import Path
from opentelemetry import trace
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from config import ASSET_PATH, get_logger, get_openai_client

# initialize logging and tracing objects
logger = get_logger(__name__)
tracer = trace.get_tracer(__name__)

# create an OpenAI client for embeddings and chat
openai_client = get_openai_client()

# Create a search client using environment variables
search_client = SearchClient(
    index_name=os.environ["AISEARCH_INDEX_NAME"],
    endpoint=os.environ["AISEARCH_ENDPOINT"],
    credential=AzureKeyCredential(key=os.environ["AISEARCH_API_KEY"]),
)
# </imports_and_config>

# <get_product_documents>
from azure.search.documents.models import VectorizedQuery


@tracer.start_as_current_span(name="get_product_documents")
def get_product_documents(messages: list, context: dict = None) -> dict:
    if context is None:
        context = {}

    overrides = context.get("overrides", {})
    top = overrides.get("top", 5)

    # generate a search query from the chat messages
    intent_mapping_response = openai_client.chat.completions.create(
        model=os.environ["INTENT_MAPPING_MODEL"],
        messages=[
            {"role": "system", "content": "You are a helpful assistant that extracts search queries from conversations. Return only the search query, nothing else."},
            {"role": "user", "content": f"Extract a search query from this conversation: {messages}"},
        ],
        temperature=0.0,
        max_tokens=100,
    )

    search_query = intent_mapping_response.choices[0].message.content
    logger.debug(f"🧠 Intent mapping: {search_query}")

    # generate a vector representation of the search query
    embedding = openai_client.embeddings.create(model=os.environ["EMBEDDINGS_MODEL"], input=search_query)
    search_vector = embedding.data[0].embedding

    # search the index for products matching the search query
    vector_query = VectorizedQuery(vector=search_vector, k_nearest_neighbors=top, fields="contentVector")

    search_results = search_client.search(
        search_text=search_query, vector_queries=[vector_query], select=["id", "content", "filepath", "title", "url"]
    )

    documents = [
        {
            "id": result["id"],
            "content": result["content"],
            "filepath": result["filepath"],
            "title": result["title"],
            "url": result["url"],
        }
        for result in search_results
    ]

    # add results to the provided context
    if "thoughts" not in context:
        context["thoughts"] = []

    # add thoughts and documents to the context object so it can be returned to the caller
    context["thoughts"].append(
        {
            "title": "Generated search query",
            "description": search_query,
        }
    )

    if "grounding_data" not in context:
        context["grounding_data"] = []
    context["grounding_data"].append(documents)

    logger.debug(f"📄 {len(documents)} documents retrieved: {documents}")
    return documents


# </get_product_documents>

# <test_get_documents>
if __name__ == "__main__":
    import logging
    import argparse

    # set logging level to debug when running this module directly
    logger.setLevel(logging.DEBUG)

    # load command line arguments
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--query",
        type=str,
        help="Query to use to search product",
        default="I need a new tent for 4 people, what would you recommend?",
    )

    args = parser.parse_args()
    query = args.query

    result = get_product_documents(messages=[{"role": "user", "content": query}])
# </test_get_documents>
