# ruff: noqa: ANN201, ANN001

import os
import sys
import pathlib
import logging
from urllib.parse import urlparse
from azure.identity import DefaultAzureCredential
from openai import AzureOpenAI

# load environment variables from the .env file
from dotenv import load_dotenv

load_dotenv()

# Set "./assets" as the path where assets are stored, resolving the absolute path:
ASSET_PATH = pathlib.Path(__file__).parent.resolve() / "assets"

# Configure an root app logger that prints info level logs to stdout
logger = logging.getLogger("app")
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler(stream=sys.stdout))


# Returns a module-specific logger, inheriting from the root app logger
def get_logger(module_name):
    return logging.getLogger(f"app.{module_name}")


# Derive the Azure OpenAI endpoint from the Foundry project endpoint
_parsed_url = urlparse(os.environ.get("FOUNDRY_PROJECT_ENDPOINT", ""))
_resource_name = _parsed_url.hostname.split(".")[0] if _parsed_url.hostname else ""
AZURE_OPENAI_ENDPOINT = f"https://{_resource_name}.openai.azure.com"

# Shared credential for Entra ID authentication (used for telemetry)
credential = DefaultAzureCredential()


def get_openai_client():
    """Get an authenticated AzureOpenAI client for chat completions and embeddings."""
    return AzureOpenAI(
        azure_endpoint=AZURE_OPENAI_ENDPOINT,
        api_key=os.environ["AZURE_OPENAI_API_KEY"],
        api_version="2024-10-21",
    )


# Enable instrumentation and logging of telemetry to the project
def enable_telemetry(log_to_project: bool = False):
    # enable logging message contents
    os.environ["AZURE_TRACING_GEN_AI_CONTENT_RECORDING_ENABLED"] = "true"

    if log_to_project:
        from azure.monitor.opentelemetry import configure_azure_monitor
        from azure.ai.projects import AIProjectClient

        project = AIProjectClient(
            endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"], credential=credential
        )
        application_insights_connection_string = project.telemetry.get_application_insights_connection_string()
        if not application_insights_connection_string:
            logger.warning(
                "No application insights configured, telemetry will not be logged to project."
            )
            logger.warning(
                "Add application insights in the Foundry portal under your project's Tracing settings."
            )
            return

        configure_azure_monitor(connection_string=application_insights_connection_string)
        logger.info("Enabled telemetry logging to project.")
        logger.info("View traces at: https://ai.azure.com (navigate to your project's Tracing page)")
