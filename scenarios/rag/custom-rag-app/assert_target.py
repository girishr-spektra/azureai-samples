# assert_target.py
from chat_with_products import chat_with_products


def respond(query: str) -> str:
    result = chat_with_products(messages=[{"role": "user", "content": query}])
    return result["message"].content