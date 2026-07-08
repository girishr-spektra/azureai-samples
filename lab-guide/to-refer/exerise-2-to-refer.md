<Callout type="important">
  Items marked (preview) in this article are currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
</Callout>

<Callout type="note">
  Tracing is generally available for prompt and hosted agents. Workflow and external agents are in preview.
</Callout>

Microsoft Foundry provides an observability platform for monitoring and tracing AI agents. It captures key details during an agent run, such as inputs, outputs, tool usage, retries, latencies, and costs. Understanding the reasoning behind your agent's executions is important for troubleshooting and debugging. However, understanding complex agents presents challenges for several reasons:

* There could be a high number of steps involved in generating a response, making it hard to keep track of all of them.
* The sequence of steps might vary based on user input.
* The inputs/outputs at each stage might be long and deserve more detailed inspection.
* Each step of an agent's runtime might also involve nesting. For example, an agent might invoke a tool, which uses another process, which then invokes another tool. If you notice strange or incorrect output from a top-level agent run, it might be difficult to determine exactly where in the execution the issue was introduced.

Trace results solve this by allowing you to view the inputs and outputs of each primitive involved in a particular agent run, displayed in the order they were invoked, making it easy to understand and debug your AI agent's behavior.

## Prerequisites

To use tracing end-to-end, you need:

* A Foundry project with tracing enabled. To set it up, see [How to set up tracing in Microsoft Foundry](../how-to/trace-agent-setup).
* Access to the Application Insights resource connected to your project. For background, see [Azure Monitor Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview).
* A Log Analytics reader role to view traces, insights, and visualizations in Foundry.

<Callout type="note">
  Tracing stores telemetry data in Azure Monitor Application Insights, which may incur costs based on data volume and retention settings. For pricing details, see [Application Insights pricing](https://learn.microsoft.com/en-us/azure/azure-monitor/cost-usage#application-insights-billing).
</Callout>

## OpenTelemetry in Foundry

OpenTelemetry (OTel) provides standardized protocols for collecting and routing telemetry data. Foundry uses OpenTelemetry semantic conventions so traces are consistent across supported tools and integrations.

## Trace key concepts

Here's a brief overview of key concepts before getting started:

| Key concepts         | Description                                                                                                                                                                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Traces               | Traces capture the journey of a request or workflow through your application by recording events and state changes (function calls, values, system events). See [OpenTelemetry Traces](https://opentelemetry.io/docs/concepts/signals/traces/).                                              |
| Spans                | Spans are the building blocks of traces, representing single operations within a trace. Each span captures start and end times, attributes, and can be nested to show hierarchical relationships, allowing you to see the full call stack and sequence of operations.                        |
| Attributes           | Attributes are key-value pairs attached to traces and spans, providing contextual metadata such as function parameters, return values, or custom annotations. These enrich trace data making it more informative and useful for analysis.                                                    |
| Semantic conventions | OpenTelemetry defines semantic conventions to standardize names and formats for trace data attributes, making it easier to interpret and analyze across tools and platforms. To learn more, see [OpenTelemetry's Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/). |
| Trace exporters      | Trace exporters send trace data to backend systems for storage and analysis. In Foundry, traces are stored in Azure Monitor Application Insights. To learn how to enable and view traces, see [How to set up tracing in Microsoft Foundry](../how-to/trace-agent-setup).                     |

## How tracing works in Foundry

Tracing helps you answer questions like "Where did this response come from?" and "Which step introduced an error or latency spike?"

At a high level, tracing captures:

* User inputs and agent outputs.
* Tool usage, including tool calls and results.
* Token consumption
* Time signals such as duration and latency.

Once tracing is enabled for your project, you can inspect traces in the Foundry portal and in Azure Monitor Application Insights. For the step-by-step setup and viewing options, see [How to set up tracing in Microsoft Foundry](../how-to/trace-agent-setup).

## Extending OpenTelemetry with multi-agent observability

Microsoft, in collaboration with Cisco Outshift, has introduced new semantic conventions for multi-agent systems, built on [OpenTelemetry](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/) and [W3C Trace Context](https://www.w3.org/TR/trace-context/). These conventions standardize telemetry for multi-agent workflows, enabling consistent logging of metrics for quality, performance, safety, and cost, including tool invocations and collaboration.

These enhancements are integrated into:

* Foundry
* Microsoft Agent Framework
* LangChain
* LangGraph
* OpenAI Agents SDK

To learn more, see [tracing integrations](../how-to/trace-agent-framework).

The following table describes the semantic conventions for multi-agent observability. Spans capture discrete operations, child spans show nested operations within a parent span, attributes provide metadata, and events mark significant occurrences during execution.

| Type       | Context/Parent Span | Name/Attribute/Event                 | Purpose                                                                                                         |
| ---------- | ------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Span       | —                   | execute\_task                        | Captures task planning and event propagation, providing insights into how tasks are decomposed and distributed. |
| Child Span | invoke\_agent       | agent\_to\_agent\_interaction        | Traces communication between agents.                                                                            |
| Child Span | invoke\_agent       | agent.state.management               | Effective context, short or long term memory management.                                                        |
| Child Span | invoke\_agent       | agent\_planning                      | Logs the agent's internal planning steps.                                                                       |
| Child Span | invoke\_agent       | agent orchestration                  | Captures agent-to-agent orchestration.                                                                          |
| Attribute  | invoke\_agent       | tool\_definitions                    | Describes the tool's purpose or configuration.                                                                  |
| Attribute  | invoke\_agent       | llm\_spans                           | Records model call spans.                                                                                       |
| Attribute  | execute\_tool       | tool.call.arguments                  | Logs the arguments passed during tool invocation.                                                               |
| Attribute  | execute\_tool       | tool.call.results                    | Records the results returned by the tool.                                                                       |
| Event      | —                   | Evaluation (name, error.type, label) | Enables structured evaluation of agent performance and decision-making.                                         |

## Best practices

* **Use consistent span attributes**: Apply the same attribute names and formats across all agents and tools to simplify querying and analysis.
* **Correlate evaluation run IDs**: Link trace data with evaluation runs to analyze both quality and performance in a unified view.
* **Redact sensitive content**: Remove or mask personal data, secrets, and credentials from prompts, tool arguments, and span attributes before they reach telemetry.

## Security and privacy

Tracing can capture sensitive information (for example, user inputs, model outputs, and tool arguments and results). Use these practices to reduce risk:

* Don't store secrets, credentials, or tokens in prompts, tool arguments, or span attributes.
* Redact or minimize personal data and other sensitive content before it appears in telemetry.
* Treat trace data as production telemetry and apply the same access controls and retention policies you use for logs and metrics.

## Troubleshooting

If traces aren't appearing in the Foundry portal or Application Insights:

* Verify that your Foundry project is connected to an Application Insights resource.
* Check that your account has the required permissions to query telemetry.
* Ensure your agent code includes the necessary instrumentation. For framework-specific setup, see [Tracing integrations](../how-to/trace-agent-framework).

<Callout type="tip">
  Tracing is available in all regions where Foundry is supported. Trace data retention and sampling follow your Application Insights configuration. For details, see [Data retention and archive in Azure Monitor Logs](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-retention-configure).
</Callout>

## Related content

* [How to set up tracing in Microsoft Foundry](../how-to/trace-agent-setup)
* [Tracing integrations](../how-to/trace-agent-framework)
* [Monitor AI agents with the Agent Monitoring Dashboard](../how-to/how-to-monitor-agents-dashboard)
* [Observability in generative AI](../../concepts/observability)

<Callout type="note">
  Tracing is currently in preview.
</Callout>

In this quickstart, you view end-to-end traces for the hosted agent you deployed in [Deploy your first hosted agent](../../agents/quickstarts/quickstart-hosted-agent). You invoke your agent to generate trace data and review traces in the Foundry portal.

The hosting libraries ([`azure-ai-agentserver-responses`](https://pypi.org/project/azure-ai-agentserver-responses/) and [`azure-ai-agentserver-invocations`](https://pypi.org/project/azure-ai-agentserver-invocations/)) smoothly integrate the [Microsoft OpenTelemetry distro](https://pypi.org/project/microsoft-opentelemetry/), which provides out-of-the-box instrumentation for Microsoft Agent Framework and LangChain, and exports traces to Application Insights. In addition, Foundry Agent Service emits server-side telemetry for agent invocation automatically—no code changes required.

Tracing gives you visibility into how your agent handles each request so you can debug issues, monitor latency, and understand agent behavior before releasing changes to users.

## Prerequisites

Before you begin, you need:

* A deployed, invokable hosted agent from [Deploy your first hosted agent](../../agents/quickstarts/quickstart-hosted-agent), and the `azd` project directory you created in that quickstart.

* The **Foundry User** role on the Foundry resource.

* To use the UI path, access to the [Foundry portal](https://ai.azure.com). For the azd path, see the next requirements.

* [Azure Developer CLI (AZD) 1.25.3 or later](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd) with the `azd microsoft.foundry` extension:

  ```bash
  azd ext install microsoft.foundry
  ```

* An authenticated `azd` session. Check your status with `azd auth status`, and run `azd auth login` if you're not signed in.

  <Callout type="important">
    The Foundry RBAC roles were recently renamed. **Foundry User**, **Foundry Owner**, **Foundry Account Owner**, and **Foundry Project Manager** were previously named Azure AI User, Azure AI Owner, Azure AI Account Owner, and Azure AI Project Manager. You might still see the previous names in some places while the rename rolls out. The role IDs and core permissions are unchanged by the rename.
  </Callout>

* An [Azure Monitor Application Insights resource](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) connected to your Foundry project. To set it up, see [Set up tracing in Microsoft Foundry](../how-to/trace-agent-setup).

* The [Log Analytics Reader role](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#log-analytics-reader) on the Application Insights resource connected to your project. If the underlying Log Analytics tables are [protected](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/protected-tables-configure), also assign the [Privileged Monitoring Data Reader role](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#privileged-monitoring-data-reader).

## Step 1: Invoke your agent

Generate trace data by sending a request to your deployed agent.

<Tabs>
  <Tab title="Azure Developer CLI">
    From your `azd` project directory, send a test prompt:

    ```bash
    azd ai agent invoke "Summarize the benefits of distributed tracing for AI agents."
    ```

    You should see a response within a few seconds.
  </Tab>

  <Tab title="Foundry portal">
    1. Open the [Foundry portal](https://ai.azure.com) and go to your project.
    2. Select your agent, and then select the **Playground** tab.
    3. Send a test prompt, such as `Summarize the benefits of distributed tracing for AI agents.`

    You should see a response within a few seconds.
  </Tab>
</Tabs>

Each invocation generates a complete trace. For richer traces, send prompts that trigger tool calls or multi-turn reasoning.

## Step 2: View traces in the Foundry portal

Traces can be viewed in the Foundry portal after invocation.

1. In the [Foundry portal](https://ai.azure.com), open your project.
2. In the left navigation, select **Agents**.
3. At the top, select **Traces**.
4. Find your trace in the list. You can search by **Trace ID**, **Response ID**, or filter by time range.

### Trajectory

![Screenshot of the trace waterfall view in the Foundry portal showing spans for invoke\_agent, chat completions, and token requests with input/output details on the right.](https://learn.microsoft.com/azure/foundry/media/observability/tracing/trace-waterfall-hosted-agent.png)

### User view

![Animation of the user view of traces in the Foundry portal.](https://learn.microsoft.com/azure/foundry/media/observability/tracing/user-view.gif)

<Callout type="tip">
  If your agent uses **Microsoft Agent Framework**, it emits its own OpenTelemetry spans automatically. These spans appear as children of the hosting layer spans, giving you a complete trace tree from the HTTP request through agent orchestration to individual tool calls and LLM interactions.
</Callout>

## Clean up resources

Tracing data is stored in Application Insights and follows your workspace's data retention settings. No additional resources are created in this quickstart. To remove everything you created across this and the previous quickstart, run `azd down` from your agent project directory.

<Callout type="warning">
  `azd down` permanently deletes every resource in the resource group, including the Foundry project, model deployments, Application Insights, and the hosted agent.
</Callout>

## Troubleshooting

| Issue                                                            | Solution                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Not using Foundry hosted agents and traces aren't showing        | This quickstart covers hosted agents only. For tracing agents hosted outside of Foundry, see [Register an external agent](../../agents/how-to/register-external-agent).                                                                                                                                                                                                                                                                                                                  |
| No traces appear after invoking agent                            | Confirm Application Insights is connected to your Foundry project. If it isn't enabled, see [Set up tracing in Microsoft Foundry](../how-to/trace-agent-setup). Verify the agent responded successfully with `azd ai agent invoke`.                                                                                                                                                                                                                                                      |
| Traces appear but spans are missing input/output data attributes | Enable content recording by setting the environment variable `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=true` in your agent configuration.                                                                                                                                                                                                                                                                                                                                      |
| `AuthorizationFailed` when viewing traces                        | You need the [Log Analytics Reader role](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#log-analytics-reader) on the Application Insights resource. If the tables are [protected](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/protected-tables-configure), also assign [Privileged Monitoring Data Reader](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#privileged-monitoring-data-reader). |
| Traces appear but are missing tool call spans                    | Verify your agent defines tools and the model invokes them during the request. If using Microsoft Agent Framework, confirm tools are registered with the `Agent` constructor via the `tools` parameter. See [Add tools to your agent](https://learn.microsoft.com/en-us/agent-framework/get-started/add-tools).                                                                                                                                                                          |
| `AuthenticationError` or `DefaultAzureCredential` failure        | Refresh credentials with `azd auth logout` and then `azd auth login`.                                                                                                                                                                                                                                                                                                                                                                                                                    |

## What you learned

In this quickstart, you:

* Learned that hosting libraries integrate the Microsoft OpenTelemetry distro for out-of-the-box instrumentation.
* Invoked your deployed agent to generate trace data.
* Viewed end-to-end traces in the Foundry portal.

## Next steps

<Callout type="nextstepaction">
  [Set up tracing in Microsoft Foundry](../how-to/trace-agent-setup)
</Callout>

* [Set up tracing in Microsoft Foundry](../how-to/trace-agent-setup) for detailed tracing configuration.
* [Configure tracing for AI agent frameworks](../how-to/trace-agent-framework) to instrument LangChain and other frameworks.
* [Monitor AI agents with the Agent Monitoring Dashboard](../how-to/how-to-monitor-agents-dashboard) for production monitoring.

## Related content

* [Agent tracing overview](../concepts/trace-agent-concept)
* [What are hosted agents?](../../agents/concepts/hosted-agents)
* [Deploy your first hosted agent](../../agents/quickstarts/quickstart-hosted-agent)
* [Observability in generative AI](../../concepts/observability)

<Callout type="important">
  Items marked (preview) in this article are currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
</Callout>

Trace Replay in Microsoft Foundry enables you to inspect, navigate, and analyze conversation traces from agent runs. It can be accessed from any page that references a **Conversation ID** or **Trace ID**. Traces can be visualized as a **User view** for reviewing the user's perspective of the agent interactions, or a **Trajectories view** for understanding span hierarchy and timing. These views, combined with interactive replay controls and filtering, help you understand execution flow, identify bottlenecks, and troubleshoot issues.

## Prerequisites

* A [Foundry project](../../how-to/create-projects) with at least one [agent](../../agents/overview).
* Trace data collected for the target agent. If you haven't set up tracing yet, see [Set up tracing in Microsoft Foundry](trace-agent-setup).
* Access to the Application Insights resource connected to your project. For background, see [Azure Monitor Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview).
* A Log Analytics reader role to view traces, insights, and visualizations in Foundry.

## Use cases

| Scenario                        | How Trace Replay helps                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| **Root cause analysis**         | Quickly identify failures or bottlenecks in agent conversations.                   |
| **Token usage optimization**    | Spot spans with high token consumption to optimize agent prompts and reduce costs. |
| **Debugging**                   | Replay execution step-by-step to understand failures or unexpected behaviors.      |
| **Conversation reconstruction** | Visualize the entire conversation flow for audits or reviews.                      |

## Open the Replay Panel

1. Sign in to [Microsoft Foundry](https://ai.azure.com).
2. Navigate to the **Traces** page under your agent.
3. Select a **Conversation ID** or **Trace ID** to open the Replay Panel.

The Replay Panel opens, showing the Trajectories view by default.

## Explore the Replay Panel views

The Replay Panel provides two complementary views of a trace. To switch between them, select the **Trajectories** or **User** tab at the top of the Replay Panel.

In both views, you can select any span to inspect the step in the agent loop, including LLM invocations, tool execution, user prompts, sub-agent orchestrations and responses. You can also view raw metadata as JSON and see the results of any evaluations that ran as part of this conversation.

### Trajectories view

![Screenshot of the Trace Replay panel showing the Trajectories view with a hierarchical span tree. Each span displays a waterfall bar measured by duration.](https://learn.microsoft.com/azure/foundry/media/observability/tracing/trace-replay-trajectories.png)

The Trajectories view renders the trace as a hierarchical tree, showing every step in the user and agent interaction — including agent reasoning, tool calls, and conversation turns. Each span displays a waterfall bar that can be measured by either **duration** or **token cost**, making it straightforward to compare the relative expense of each step.

This view is most useful for identifying potential agentic failures such as errors, hallucinations, and abnormally long or costly interactions.

### User view

![Screenshot of the Trace Replay panel showing the User view tab active, with a chat-based conversation between the user and agent displayed.](https://learn.microsoft.com/azure/foundry/media/observability/tracing/trace-replay-user-view.png)

The User view presents the trace as a chat-based visualization of the interactions between the user and agent, reflecting what the end user would have experienced. A collapsible **Span tree** panel remains accessible alongside the chat, so you can cross-reference the underlying span hierarchy without leaving this view.

## Filter traces

![Screenshot of the filter dropdown in Trace Replay, showing span type options (Chat, Agent, Tool, Conversation) and token range options (Low, Medium, High).](https://learn.microsoft.com/azure/foundry/media/observability/tracing/trace-replay-filter.png)

1. In the Replay Panel, select the **Filter** control.
2. Choose one or more span types from the list to narrow the trace.

The span tree updates to show only spans matching the selected types.

| Filter           | Shows                                              |
| ---------------- | -------------------------------------------------- |
| **Chat**         | Chat-specific spans in the trace                   |
| **Agent**        | Agent invocation                                   |
| **Tool**         | Any tool executions that occurred during the trace |
| **Conversation** | Conversation-specific spans in the trace           |

To search by span name, enter text in the **Find in trace** field.

### Filter by token consumption

Filter spans by token usage level to identify hotspots or outliers.

| Level      | Description                                                             |
| ---------- | ----------------------------------------------------------------------- |
| **Low**    | Less than 500 tokens                                                    |
| **Medium** | 500–2k tokens                                                           |
| **High**   | More than 2k tokens — useful for identifying outliers in the trace loop |

## Replay a conversation

![Screenshot of the Trace Replay panel showing the Playthrough control bar at the bottom with play, skip, and speed controls.](https://learn.microsoft.com/azure/foundry/media/observability/tracing/trace-replay-playthrough.png)

The **Playthrough** control replays the entire conversation sequentially, keeping the Trajectories view, User view, and span detail panel in sync as each step is highlighted.

1. Select **Play** in the **Playthrough** control at the bottom of the Replay Panel.

2. Use the playback controls as needed:

   * **Skip spans** at any point to jump ahead in the interaction.
   * **Adjust playback speed** (for example, 1x, 2x, or 4x) to move through long traces faster.
   * **Scrub to any point** in the trace using the timeline scrubber to seek directly to a specific moment without replaying from the beginning.

The Replay Panel highlights each span in sequence across both the Trajectories view and the span detail panel.

## Troubleshoot

| Symptom                                   | Resolution                                                                                                                                                  |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Conversation ID or Trace ID isn't visible | Tracing isn't configured for this agent. See [Set up tracing in Microsoft Foundry](trace-agent-setup).                                                      |
| Replay Panel loads but shows no spans     | The trace might still be processing. Wait a few minutes, then refresh the page.                                                                             |
| **Playthrough** control is unavailable    | Playthrough requires two or more spans. Single-span traces can't be replayed sequentially.                                                                  |
| Filter applied but no spans are visible   | The selected filter type doesn't appear in this trace. Clear the filter and try a broader span type, or verify that the agent uses the filtered capability. |

## Related content

* [Agent tracing overview](../concepts/trace-agent-concept)
* [Monitor agents with the Agent Monitoring Dashboard](how-to-monitor-agents-dashboard)
* [Set up tracing in Microsoft Foundry](trace-agent-setup)
* [Tracing integrations](trace-agent-framework)

<Callout type="important">
  Items marked (preview) in this article are currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
</Callout>

Microsoft Foundry automatically captures server-side traces for agents running in the portal. Client-side tracing extends that visibility into your own application code. By instrumenting your agent application with OpenTelemetry, you can capture spans for model calls, tool invocations, and custom logic — then export them to Azure Monitor Application Insights, the console, or any observability backend that supports the OpenTelemetry protocol (OTLP), such as Datadog, Grafana Tempo, Jaeger, or Honeycomb.

In this article, you learn how to:

* Install the required OpenTelemetry tracing packages.
* Enable GenAI tracing instrumentation for agent applications.
* Export traces to Azure Monitor, the console, or an OTLP-compatible backend.
* Enable content recording to capture message contents.
* Enable trace context propagation for distributed tracing (Python).
* Trace custom functions.

## Prerequisites

* A [Foundry project](../../how-to/create-projects) with an [Application Insights resource connected](trace-agent-setup#connect-application-insights-to-your-foundry-project).

* An AI model deployed to the project. Note the deployment name.

* [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed. Sign in by running `az login`.

* Contributor or higher role on the Foundry project. To view traces, you also need [Log Analytics Reader](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#log-analytics-reader) on the connected Application Insights resource. If those Log Analytics tables are [protected](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/protected-tables-configure), also assign [Privileged Monitoring Data Reader](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#privileged-monitoring-data-reader). For more information, see [Role-based access control in Foundry](../../concepts/rbac-foundry).

* The following environment variables set with your own values:

  | Variable                   | Description                                                                                         |
  | -------------------------- | --------------------------------------------------------------------------------------------------- |
  | `FOUNDRY_PROJECT_ENDPOINT` | Your Foundry project endpoint URL. Find it on the project **Overview** page in the Foundry portal.  |
  | `FOUNDRY_MODEL_NAME`       | The deployment name of an AI model in your project. Find it under **Models** in the Foundry portal. |

### Language-specific prerequisites

<Tabs>
  <Tab title="Python">
    * Python 3.9 or later.
    * The `azure-ai-projects` package version 2.0.0 or later.
  </Tab>

  <Tab title="C#">
    * .NET 8.0 or later.
    * The `Azure.AI.Projects` NuGet package.
  </Tab>
</Tabs>

## Install tracing packages

<Tabs>
  <Tab title="Python">
    Install the Microsoft Foundry SDK, OpenTelemetry, and the Azure Monitor exporter:

    ```bash
    pip install azure-ai-projects azure-identity opentelemetry-sdk azure-core-tracing-opentelemetry azure-monitor-opentelemetry
    ```

    For console-only or OTLP export (for example, [Aspire Dashboard](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/dashboard/standalone)), install the OTLP exporter:

    ```bash
    pip install opentelemetry-exporter-otlp
    ```
  </Tab>

  <Tab title="C#">
    Add the required NuGet packages:

    ```dotnetcli
    dotnet add package Azure.AI.Projects
    dotnet add package Azure.AI.Projects.Agents
    dotnet add package Azure.Identity
    dotnet add package Azure.Monitor.OpenTelemetry.Exporter
    dotnet add package OpenTelemetry.Exporter.Console
    ```

    For ASP.NET Core applications, `Azure.Monitor.OpenTelemetry.AspNetCore` is the preferred package. The `Azure.Monitor.OpenTelemetry.Exporter` package shown here works for all .NET application types.
  </Tab>
</Tabs>

## Enable GenAI tracing

GenAI tracing instrumentation is an experimental preview feature. Spans, attributes, and events might change in future versions. You must explicitly opt in before tracing is active.

<Tabs>
  <Tab title="Python">
    Set the `AZURE_EXPERIMENTAL_ENABLE_GENAI_TRACING` environment variable to `true` **before** calling `AIProjectInstrumentor().instrument()`:

    ```python
    import os

    os.environ["AZURE_EXPERIMENTAL_ENABLE_GENAI_TRACING"] = "true"

    from azure.ai.projects.telemetry import AIProjectInstrumentor

    # Enable instrumentation
    AIProjectInstrumentor().instrument()
    ```

    If the variable isn't set or isn't `true` (case-insensitive), tracing instrumentation isn't enabled and a warning is logged.
  </Tab>

  <Tab title="C#">
    Use an `AppContext` switch or the same environment variable:

    ```csharp
    // Enable GenAI tracing
    AppContext.SetSwitch("Azure.Experimental.EnableGenAITracing", true);
    ```

    When you enable `Azure.Experimental.EnableGenAITracing`, the SDK automatically enables the `Azure.Experimental.EnableActivitySource` flag, which is required for OpenTelemetry instrumentation to function.

    If both the `AppContext` switch and the environment variable are set, the `AppContext` switch takes priority.

    <Callout type="note">
      In C#, all tracing-related environment variables accept `true` (case-insensitive) or `1` as equivalent enabling values.
    </Callout>
  </Tab>
</Tabs>

## Export traces to Azure Monitor

Send traces to [Azure Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) so they appear in the Foundry portal's **Traces** view and in Azure Monitor.

<Tabs>
  <Tab title="Python">
    ```python
    import os

    os.environ["AZURE_EXPERIMENTAL_ENABLE_GENAI_TRACING"] = "true"

    from azure.ai.projects import AIProjectClient
    from azure.ai.projects.models import PromptAgentDefinition
    from azure.identity import DefaultAzureCredential
    from azure.monitor.opentelemetry import configure_azure_monitor
    from opentelemetry import trace

    endpoint = os.environ["FOUNDRY_PROJECT_ENDPOINT"]

    with (
        DefaultAzureCredential() as credential,
        AIProjectClient(endpoint=endpoint, credential=credential) as project,
    ):
        # Get the Application Insights connection string from the project
        connection_string = project.telemetry.get_application_insights_connection_string()
        configure_azure_monitor(connection_string=connection_string)

        tracer = trace.get_tracer(__name__)

        with tracer.start_as_current_span("agent-tracing-scenario"):
            with project.get_openai_client() as openai:
                # Create an agent
                agent = project.agents.create_version(
                    agent_name="MyAgent",
                    definition=PromptAgentDefinition(
                        model=os.environ["FOUNDRY_MODEL_NAME"],
                        instructions="You are a helpful assistant.",
                    ),
                )
                print(f"Agent created (id: {agent.id}, name: {agent.name})")

                # Create a conversation and get a response
                conversation = openai.conversations.create()
                response = openai.responses.create(
                    conversation=conversation.id,
                    extra_body={"agent_reference": {"name": agent.name, "id": agent.id, "type": "agent_reference"}},
                    input="What is the largest city in France?",
                )
                print(f"Response: {response.output_text}")

                # Clean up
                openai.conversations.delete(conversation_id=conversation.id)
                project.agents.delete_version(agent_name=agent.name, agent_version=agent.version)
    ```

    Reference: [`AIProjectClient`](https://learn.microsoft.com/en-us/python/api/azure-ai-projects/azure.ai.projects.aiprojectclient), [`DefaultAzureCredential`](https://learn.microsoft.com/en-us/python/api/azure-identity/azure.identity.defaultazurecredential), [`configure_azure_monitor`](https://learn.microsoft.com/en-us/python/api/azure-monitor-opentelemetry/azure.monitor.opentelemetry)
  </Tab>

  <Tab title="C#">
    ```csharp
    using Azure.AI.Projects;
    using Azure.AI.Projects.Agents;
    using Azure.Identity;
    using Azure.Monitor.OpenTelemetry.Exporter;
    using OpenTelemetry;
    using OpenTelemetry.Resources;
    using OpenTelemetry.Trace;

    var projectEndpoint = Environment.GetEnvironmentVariable("FOUNDRY_PROJECT_ENDPOINT");
    var modelName = Environment.GetEnvironmentVariable("FOUNDRY_MODEL_NAME");

    // Enable GenAI tracing
    AppContext.SetSwitch("Azure.Experimental.EnableGenAITracing", true);

    AIProjectClient projectClient = new(
        endpoint: new Uri(projectEndpoint),
        tokenProvider: new DefaultAzureCredential());

    // Get the Application Insights connection string from the project
    var connectionString = await projectClient.Telemetry
        .GetApplicationInsightsConnectionStringAsync();

    // The Azure Monitor exporter reads this environment variable automatically
    Environment.SetEnvironmentVariable(
        "APPLICATIONINSIGHTS_CONNECTION_STRING", connectionString);

    // Configure OpenTelemetry with Azure Monitor exporter
    var tracerProvider = Sdk.CreateTracerProviderBuilder()
        .AddSource("Azure.AI.Projects.*")
        .SetResourceBuilder(
            ResourceBuilder.CreateDefault().AddService("AgentTracingSample"))
        .AddAzureMonitorTraceExporter()
        .Build();

    using (tracerProvider)
    {
        // Create an agent
        DeclarativeAgentDefinition agentDefinition = new(model: modelName)
        {
            Instructions = "You are a helpful assistant."
        };
        AgentVersion agent = await projectClient.Agents.CreateAgentVersionAsync(
            agentName: "myAgent",
            options: new(agentDefinition));
        Console.WriteLine(
            $"Agent created (id: {agent.Id}, name: {agent.Name})");

        // Clean up
        projectClient.Agents.DeleteAgentVersion(
            agentName: agent.Name, agentVersion: agent.Version);
    }
    ```

    Reference: [`AIProjectClient`](https://learn.microsoft.com/en-us/dotnet/api/azure.ai.projects.aiprojectclient), [`DefaultAzureCredential`](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredential), [`Sdk.CreateTracerProviderBuilder`](https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/src/OpenTelemetry)
  </Tab>
</Tabs>

<Callout type="note">
  To correlate traces with a specific agent in the Foundry portal, include the `agent_reference` with both `name` and `id` in your `responses.create()` call (as shown in the Python sample above). Traces typically appear within 2-5 minutes.
</Callout>

## Export traces to the console

Console export is useful for local debugging. Traces print directly to standard output.

<Tabs>
  <Tab title="Python">
    ```python
    import os

    os.environ["AZURE_EXPERIMENTAL_ENABLE_GENAI_TRACING"] = "true"

    from azure.ai.projects.telemetry import AIProjectInstrumentor
    from opentelemetry import trace
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import ConsoleSpanExporter, SimpleSpanProcessor

    # Set up console tracing
    tracer_provider = TracerProvider()
    tracer_provider.add_span_processor(
        SimpleSpanProcessor(ConsoleSpanExporter()))
    trace.set_tracer_provider(tracer_provider)

    # Enable instrumentation
    AIProjectInstrumentor().instrument()

    tracer = trace.get_tracer(__name__)
    ```

    You can also use [Aspire Dashboard](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/dashboard/standalone) as a local OTLP-compatible viewer. Install the OTLP exporter (`pip install opentelemetry-exporter-otlp`) and configure it as the exporter instead of `ConsoleSpanExporter`.

    Reference: [`AIProjectInstrumentor`](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/ai/azure-ai-projects#tracing), [`ConsoleSpanExporter`](https://opentelemetry-python.readthedocs.io/en/latest/sdk/trace.export.html)
  </Tab>

  <Tab title="C#">
    ```csharp
    using Azure.AI.Projects;
    using Azure.Identity;
    using OpenTelemetry;
    using OpenTelemetry.Resources;
    using OpenTelemetry.Trace;

    // Enable GenAI tracing
    AppContext.SetSwitch("Azure.Experimental.EnableGenAITracing", true);

    // Configure OpenTelemetry with console exporter
    var tracerProvider = Sdk.CreateTracerProviderBuilder()
        .AddSource("Azure.AI.Projects.*")
        .SetResourceBuilder(
            ResourceBuilder.CreateDefault().AddService("AgentTracingSample"))
        .AddConsoleExporter()
        .Build();

    using (tracerProvider)
    {
        // Agent operations emit traces to the console
    }
    ```
  </Tab>
</Tabs>

## Enable content recording

Content recording captures message contents and tool call arguments in traces. This data might include sensitive user information.

<Callout type="caution">
  Content recording captures user messages, tool call arguments, and model outputs. Only enable this setting in development environments. Don't enable content recording in production unless your compliance and privacy requirements allow it.
</Callout>

<Tabs>
  <Tab title="Python">
    Set the environment variable before instrumenting:

    ```python
    import os

    os.environ["OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT"] = "true"
    ```

    <Callout type="important">
      This variable controls recording only for built-in traces. When you use the `@trace_function` decorator on your own functions, all parameters and return values are always traced regardless of this setting.
    </Callout>
  </Tab>

  <Tab title="C#">
    Use an `AppContext` switch or the environment variable:

    ```csharp
    // Enable content recording
    AppContext.SetSwitch("Azure.Experimental.TraceGenAIMessageContent", true);
    ```

    Or set the `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT` environment variable to `true`. If both the `AppContext` switch and the environment variable are set, the `AppContext` switch takes priority.
  </Tab>
</Tabs>

## Disable automatic instrumentation (Python)

The Python SDK automatically instruments OpenAI Responses and Conversations API calls. To disable this auto-instrumentation, set `AZURE_TRACING_GEN_AI_INSTRUMENT_RESPONSES_API` to `false` before calling `AIProjectInstrumentor().instrument()`. When disabled, only explicit custom spans are recorded.

```python
import os

os.environ["AZURE_TRACING_GEN_AI_INSTRUMENT_RESPONSES_API"] = "false"
```

## Trace binary data (Python)

When content recording is enabled, the SDK traces file IDs and filenames by default. To include full image URLs (including base64 data URIs) and file data in spans, set `AZURE_TRACING_GEN_AI_INCLUDE_BINARY_DATA` to `true`.

```python
import os

os.environ["AZURE_TRACING_GEN_AI_INCLUDE_BINARY_DATA"] = "true"
```

<Callout type="warning">
  Enabling `AZURE_TRACING_GEN_AI_INCLUDE_BINARY_DATA` can significantly increase trace payload size. Some tracing backends have limitations on the maximum size of span data. Verify that your observability backend supports the expected payload sizes before enabling this setting.
</Callout>

## Enable trace context propagation (Python)

Trace context propagation allows client-side spans to correlate with server-side spans from Azure OpenAI and other Azure services. When enabled, the SDK automatically injects [W3C Trace Context](https://www.w3.org/TR/trace-context/) headers (`traceparent` and `tracestate`) into HTTP requests made by OpenAI clients obtained via `get_openai_client()`.

Trace context propagation is **enabled by default** when tracing is enabled. To disable it, set the `AZURE_TRACING_GEN_AI_ENABLE_TRACE_CONTEXT_PROPAGATION` environment variable to `false`, or pass the parameter directly:

```python
from azure.ai.projects.telemetry import AIProjectInstrumentor

# Disable trace context propagation
AIProjectInstrumentor().instrument(enable_trace_context_propagation=False)
```

Changes to this setting only affect OpenAI clients obtained via `get_openai_client()` **after** the change. Previously acquired clients aren't affected.

### Control baggage propagation (Python)

By default, only `traceparent` and `tracestate` headers are propagated. To also include the `baggage` header, set `AZURE_TRACING_GEN_AI_TRACE_CONTEXT_PROPAGATION_INCLUDE_BAGGAGE` to `true`.

<Callout type="important">
  The `baggage` header can contain arbitrary key-value pairs, including user identifiers, session information, or other potentially sensitive data. Before enabling baggage propagation:

  * Audit what data your application and third-party libraries add to OpenTelemetry baggage.
  * Understand that baggage is sent to Azure OpenAI and might be logged by Azure services.
  * Never add sensitive information to baggage when propagation is enabled.
</Callout>

<Callout type="note">
  The C# SDK relies on standard .NET `System.Diagnostics.Activity` propagation. Explicit per-request trace context injection isn't exposed as a separate SDK feature.
</Callout>

## Trace custom functions

### Python — use the `@trace_function` decorator

The `trace_function` decorator creates an OpenTelemetry span for each call to your function. Parameters are recorded as `code.function.parameter.<name>` and the return value as `code.function.return.value`.

```python
from azure.ai.projects.telemetry import trace_function

@trace_function
def fetch_weather(location: str) -> str:
    """Get the current weather for a location."""
    return f"Weather in {location}: sunny, 72°F"
```

To use a custom span name instead of the function name, pass it as a parameter:

```python
@trace_function("get-current-weather")
def fetch_weather(location: str) -> str:
    """Get the current weather for a location."""
    return f"Weather in {location}: sunny, 72°F"
```

The decorator records:

* **Parameters** as `code.function.parameter.<name>` span attributes.
* **Return values** as `code.function.return.value`.
* **Supported types**: `str`, `int`, `float`, `bool`, and collections (`list`, `dict`, `tuple`, `set`). Object types are omitted.

<Callout type="note">
  The `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT` environment variable doesn't affect custom function tracing. The `@trace_function` decorator always traces parameters and return values.
</Callout>

### C# — use `ActivitySource` manually

The C# SDK doesn't include a tracing decorator. Use the standard .NET `ActivitySource` to instrument your own functions:

```csharp
using System.Diagnostics;

// Define a custom activity source
private static readonly ActivitySource s_source = new("MyApp.CustomFunctions");

string FetchWeather(string location)
{
    using var activity = s_source.StartActivity("FetchWeather");
    activity?.SetTag("input.location", location);

    var result = $"Weather in {location}: sunny, 72°F";
    activity?.SetTag("output", result);
    return result;
}
```

Register your custom source alongside the SDK source in your tracer provider:

```csharp
var tracerProvider = Sdk.CreateTracerProviderBuilder()
    .AddSource("Azure.AI.Projects.*")
    .AddSource("MyApp.CustomFunctions")
    .SetResourceBuilder(
        ResourceBuilder.CreateDefault().AddService("MyApp"))
    .AddConsoleExporter()
    .Build();
```

## Configure instrumentation programmatically (Python)

As an alternative to environment variables, pass configuration parameters directly to `AIProjectInstrumentor().instrument()`:

```python
from azure.ai.projects.telemetry import AIProjectInstrumentor

AIProjectInstrumentor().instrument(
    enable_content_recording=True,
    enable_trace_context_propagation=True,
    enable_baggage_propagation=False,
)
```

| Parameter                          | Environment variable equivalent                                  | Default  |
| ---------------------------------- | ---------------------------------------------------------------- | -------- |
| `enable_content_recording`         | `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT`             | `False`  |
| `enable_trace_context_propagation` | `AZURE_TRACING_GEN_AI_ENABLE_TRACE_CONTEXT_PROPAGATION`          | `True`\* |
| `enable_baggage_propagation`       | `AZURE_TRACING_GEN_AI_TRACE_CONTEXT_PROPAGATION_INCLUDE_BAGGAGE` | `False`  |

\* Default is `True` when tracing is enabled.

When both a parameter and its corresponding environment variable are set, the parameter value takes priority.

## Add custom attributes to spans (Python)

Create a custom `SpanProcessor` to inject metadata like session IDs into every span:

```python
from opentelemetry.sdk.trace import SpanProcessor, ReadableSpan
from opentelemetry.trace import Span

class CustomAttributeSpanProcessor(SpanProcessor):
    def on_start(self, span: Span, parent_context=None):
        span.set_attribute("session.id", "user-session-abc")

    def on_end(self, span: ReadableSpan):
        pass
```

Register the processor with the global tracer provider:

```python
from typing import cast
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider

provider = cast(TracerProvider, trace.get_tracer_provider())
provider.add_span_processor(CustomAttributeSpanProcessor())
```

## Control tracing behavior with environment variables

The following table lists all environment variables you can use to configure tracing behavior:

| Variable                                                         | Language   | Default  | Description                                                |
| ---------------------------------------------------------------- | ---------- | -------- | ---------------------------------------------------------- |
| `AZURE_EXPERIMENTAL_ENABLE_GENAI_TRACING`                        | Python, C# | `false`  | Enable GenAI tracing instrumentation.                      |
| `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT`             | Python, C# | `false`  | Capture message contents and tool call parameters.         |
| `AZURE_TRACING_GEN_AI_ENABLE_TRACE_CONTEXT_PROPAGATION`          | Python     | `true`\* | Inject W3C Trace Context headers into requests.            |
| `AZURE_TRACING_GEN_AI_TRACE_CONTEXT_PROPAGATION_INCLUDE_BAGGAGE` | Python     | `false`  | Include the `baggage` header in trace context propagation. |
| `AZURE_TRACING_GEN_AI_INSTRUMENT_RESPONSES_API`                  | Python     | `true`   | Auto-instrument Responses and Conversations APIs.          |
| `AZURE_TRACING_GEN_AI_INCLUDE_BINARY_DATA`                       | Python     | `false`  | Include image and file data in spans (not just file IDs).  |

\* Default is `true` when tracing is enabled.

For the full list of environment variables and their behavior, see [Tracing in the Azure AI Projects SDK README](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/ai/azure-ai-projects/README.md#tracing).

## Security and privacy

Client-side tracing can capture sensitive information. Follow these practices to reduce risk:

* **Content recording**: Captures user inputs, model responses, and tool call arguments. Disable in production unless required.
* **Baggage propagation**: Can expose PII and session data. Disabled by default.
* **Trace context propagation**: Sends trace IDs to Azure services. If compliance requirements prohibit sharing trace identifiers, disable it.
* **Secrets**: Don't store secrets, credentials, or tokens in prompts, tool arguments, or span attributes.
* **Access control**: Treat trace data as production telemetry. Apply the same access controls and retention policies you use for logs and metrics.

## Troubleshooting

| Issue                                               | Resolution                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tracing doesn't produce any spans                   | Verify `AZURE_EXPERIMENTAL_ENABLE_GENAI_TRACING` is set to `true` **before** calling `AIProjectInstrumentor().instrument()` (Python) or before creating the tracer provider (C#).                                                                                                                                                                                                                                                                                                                                                                                   |
| Message content doesn't appear in spans             | Set `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT` to `true`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Traces don't appear in Azure Monitor                | Verify the Application Insights connection string is correct and the resource is accessible. Check that your account has the [Log Analytics Reader role](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#log-analytics-reader). If the tables are [protected](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/protected-tables-configure), also assign [Privileged Monitoring Data Reader](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#privileged-monitoring-data-reader). |
| Client-side and server-side spans aren't correlated | (Python) Verify trace context propagation is enabled and that OpenAI clients are obtained via `get_openai_client()` **after** instrumentation.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Traces appear with a delay                          | Traces typically take 2-5 minutes to appear in the Foundry portal and Azure Monitor. Wait and refresh.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## Related content

* [Agent tracing overview (preview)](../concepts/trace-agent-concept)
* [Set up tracing in Microsoft Foundry](trace-agent-setup)
* [Configure tracing for agent frameworks](trace-agent-framework)
* [Monitor agents with the Agent Monitoring Dashboard](how-to-monitor-agents-dashboard)

<Callout type="important">
  Items marked (preview) in this article are currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
</Callout>

<Callout type="note">
  Tracing is generally available for prompt and hosted agents. Workflow and external agents are in preview.
</Callout>

When AI agents behave unexpectedly in production, tracing gives you the visibility to quickly identify the root cause. Tracing captures detailed telemetry—including LLM calls, tool invocations, and agent decision flows—so you can debug issues, monitor latency, and understand agent behavior across requests.

Microsoft Foundry provides tracing integrations for popular agent frameworks that require minimal code changes. In this article, you learn how to:

* Configure automatic tracing for Microsoft Agent Framework and Semantic Kernel
* Set up the Microsoft OpenTelemetry distro for LangChain and LangGraph
* Instrument the OpenAI Agents SDK with OpenTelemetry
* Verify that traces appear in the Foundry portal
* Troubleshoot common tracing issues

## Prerequisites

* A Foundry project. For more information, see [Create a Foundry project](../../how-to/create-projects).
* Tracing connected to an Azure Monitor Application Insights resource. To set it up, see [Set up tracing in Microsoft Foundry](trace-agent-setup).
* Contributor or higher role on the Application Insights resource for trace ingestion.
* Access to the connected Application Insights resource for viewing traces. For log-based queries, you might also need access to the associated Log Analytics workspace.
* Python 3.10 or later (required for all code samples in this article).
* The `microsoft-opentelemetry` package (required for LangChain and LangGraph samples).
* If you use LangChain or LangGraph, a Python environment with pip installed.

### Confirm you can view telemetry

To view trace data, make sure your account has access to the connected Application Insights resource.

1. In the Azure portal, open the Application Insights resource connected to your Foundry project.

2. Select **Access control (IAM)**.

3. Assign an appropriate role to your user or group.

   If you use log-based queries, start by granting the [Log Analytics Reader role](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#log-analytics-reader). If the underlying Log Analytics tables are [protected](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/protected-tables-configure), also grant the [Privileged Monitoring Data Reader role](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#privileged-monitoring-data-reader).

## Security and privacy

Tracing can capture sensitive information (for example, user inputs, model outputs, and tool arguments and results).

* Enable content recording during development and debugging to see full request and response data. Disable content recording in production environments to protect sensitive data. In the samples in this article, content recording is controlled by the environment variables `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT`, `OTEL_SEMCONV_STABILITY_OPT_IN`, and `AZURE_EXPERIMENTAL_ENABLE_GENAI_TRACING`.
* Don't store secrets, credentials, or tokens in prompts or tool arguments.

For more guidance, see [Security and privacy](../concepts/trace-agent-concept#security-and-privacy).

<Callout type="note">
  Trace data stored in Application Insights is subject to your workspace's data retention settings and Azure Monitor pricing. For cost management, consider adjusting sampling rates or retention periods in production. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) and [Configure data retention and archive](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-retention-configure).
</Callout>

## Configure tracing for Microsoft Agent Framework and Semantic Kernel

Microsoft Foundry has native integrations with both Microsoft Agent Framework and Semantic Kernel. Agents built with either framework automatically emit traces when tracing is enabled for your Foundry project—no additional code or packages are required.

To verify tracing is working:

1. Run your agent at least once.
2. In the Foundry portal, go to **Observability** > **Traces**.
3. Confirm a new trace appears with spans for your agent's operations.

Traces typically appear within 2–5 minutes after agent execution. For advanced configuration, see the framework-specific documentation:

* [Microsoft Agent Framework Workflows – Observability](https://learn.microsoft.com/en-us/agent-framework/user-guide/workflows/observability)
* [Semantic Kernel observability](https://learn.microsoft.com/en-us/semantic-kernel/concepts/enterprise-readiness/observability)

## Configure tracing with OpenInference instrumentation libraries

Microsoft Foundry supports [OpenInference](https://pypi.org/search/?q=openinference) instrumentation libraries for tracing AI agents. These `openinference-*` packages provide automatic instrumentation for a wide range of frameworks and can be used to trace both hosted agents (agents deployed to Foundry) and non-Foundry agents (agents hosted outside of Foundry).

Browse available instrumentation packages on [PyPI](https://pypi.org/search/?q=openinference). For LangChain, see the [Microsoft OpenTelemetry distro LangChain sample](https://github.com/microsoft/opentelemetry-distro-python/tree/main/samples/langchain), which shows how to enable Azure Monitor export and LangChain auto-instrumentation with `use_microsoft_opentelemetry`.

The key requirement is correlating OpenInference traces to a specific agent. How you achieve this depends on where your agent runs:

### Hosted agents (deployed to Foundry)

When you deploy an agent to Foundry using one of the hosted agent server packages, trace correlation is handled automatically. The server package:

* Configures Azure Monitor export for OpenTelemetry spans.
* Enriches all spans with project, agent name, agent version, and agent ID attributes so the Foundry UI can query and display them.

No additional configuration is required. Install the relevant `openinference-*` instrumentation package for your framework and traces appear in the Foundry portal automatically.

### Microsoft Agent Framework agents hosted outside of Foundry

If your Microsoft Agent Framework agent isn't deployed with a Foundry hosted agent server package, configure Azure Monitor export and agent framework instrumentation with the [Microsoft OpenTelemetry distro](https://pypi.org/project/microsoft-opentelemetry/). The distro can enable the Azure Monitor exporter and add agent identity attributes to spans:

```python
from microsoft.opentelemetry import use_microsoft_opentelemetry

use_microsoft_opentelemetry(
    enable_azure_monitor=True,
    azure_monitor_connection_string="...",
    sampling_ratio=1.0,
    enable_sensitive_data=True,
    instrumentation_options={
        "agent-framework": {
            "enabled": True,
            "agent_id": "ms-imagination-agent",
            "agent_name": "ms-imagination-agent",
        },
    },
)
```

Set `azure_monitor_connection_string` to the Application Insights resource connected to your Foundry project. To capture prompt and completion content during development, set `enable_sensitive_data=True`.

### LangChain agents hosted outside of Foundry

If your agent isn't deployed with a Foundry hosted agent server package, configure Azure Monitor export and LangChain instrumentation with the [Microsoft OpenTelemetry distro](https://pypi.org/project/microsoft-opentelemetry/). The distro can enable the Azure Monitor exporter and add agent identity attributes to LangChain spans:

```python
from microsoft.opentelemetry import use_microsoft_opentelemetry

use_microsoft_opentelemetry(
    enable_azure_monitor=True,
    sampling_ratio=1.0,
    instrumentation_options={
        "langchain": {
            "enabled": True,
            "agent_id": "weather_info_agent_771929",
            "agent_name": "Weather information agent",
        },
    },
)
```

Set `APPLICATIONINSIGHTS_CONNECTION_STRING` to the Application Insights resource connected to your Foundry project. To capture prompt and completion content during development, set `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=SPAN_AND_EVENT`, `OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental`, and `AZURE_EXPERIMENTAL_ENABLE_GENAI_TRACING=true`.

## Configure tracing for LangChain and LangGraph

<Callout type="note">
  Tracing integration for LangChain and LangGraph is currently available only in Python.
</Callout>

Use the [Microsoft OpenTelemetry distro](https://pypi.org/project/microsoft-opentelemetry/) to emit OpenTelemetry-compliant spans for LangChain and LangGraph operations. These traces appear in the **Observability** > **Traces** view in the Foundry portal.

* [OpenTelemetry semantic conventions for generative AI](https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/)
* [Microsoft OpenTelemetry distro LangChain sample](https://github.com/microsoft/opentelemetry-distro-python/tree/main/samples/langchain)

### Sample: LangChain v1 agent with Azure AI tracing

Use this end-to-end sample to instrument a LangChain v1 (preview) agent using the Microsoft OpenTelemetry distro. The distro enables LangChain auto-instrumentation with the latest OpenTelemetry (OTel) semantic conventions, so you can view rich traces in the Foundry observability view.

#### LangChain v1: Install packages

```bash
pip install \
  microsoft-opentelemetry \
  langchain \
  langgraph \
  langchain-openai \
  azure-identity \
  python-dotenv \
  rich
```

#### LangChain v1: Configure environment

* `APPLICATIONINSIGHTS_CONNECTION_STRING`: Azure Monitor Application Insights connection string for tracing.
* `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint URL.
* `AZURE_OPENAI_CHAT_DEPLOYMENT`: The chat model deployment name.
* `AZURE_OPENAI_VERSION`: API version, for example `2024-08-01-preview`.
* The SDK resolves Azure credentials using `DefaultAzureCredential`, which supports environment variables, managed identity, and VS Code sign-in.

Store these values in a `.env` file for local development.

#### LangChain v1: Tracer setup

```python
from dotenv import load_dotenv
from microsoft.opentelemetry import use_microsoft_opentelemetry

load_dotenv(override=True)

use_microsoft_opentelemetry(
    enable_azure_monitor=True,
    sampling_ratio=1.0,
    instrumentation_options={
        "langchain": {
            "enabled": True,
            "agent_id": "weather_info_agent_771929",
            "agent_name": "Weather information agent",
        },
    },
)
```

#### LangChain v1: Model setup (Azure OpenAI)

```python
import os
import azure.identity
from langchain_openai import AzureChatOpenAI

token_provider = azure.identity.get_bearer_token_provider(
    azure.identity.DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default",
)

model = AzureChatOpenAI(
    azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
    azure_deployment=os.environ.get("AZURE_OPENAI_CHAT_DEPLOYMENT"),
    openai_api_version=os.environ.get("AZURE_OPENAI_VERSION"),
    azure_ad_token_provider=token_provider,
)
```

#### LangChain v1: Define tools and prompt

```python
from dataclasses import dataclass
from langchain_core.tools import tool

system_prompt = """You are an expert weather forecaster, who speaks in puns.

You have access to two tools:

- get_weather_for_location: use this to get the weather for a specific location
- get_user_location: use this to get the user's location

If a user asks you for the weather, make sure you know the location.
If you can tell from the question that they mean wherever they are,
use the get_user_location tool to find their location."""

# Mock user locations keyed by user id (string)
USER_LOCATION = {
    "1": "Florida",
    "2": "SF",
}


@dataclass
class UserContext:
    user_id: str


@tool
def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"
```

#### LangChain v1: Use runtime context and define a user-info tool

```python
from langgraph.runtime import get_runtime
from langchain_core.runnables import RunnableConfig

@tool
def get_user_info(config: RunnableConfig) -> str:
    """Retrieve user information based on user ID."""
    runtime = get_runtime(UserContext)
    user_id = runtime.context.user_id
    return USER_LOCATION[user_id]
```

#### LangChain v1: Create the agent

```python
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver
from dataclasses import dataclass


@dataclass
class WeatherResponse:
    conditions: str
    punny_response: str


checkpointer = InMemorySaver()

agent = create_agent(
    model=model,
    prompt=system_prompt,
    tools=[get_user_info, get_weather],
    response_format=WeatherResponse,
    checkpointer=checkpointer,
)
```

#### LangChain v1: Run the agent with tracing

```python
from rich import print

def main():
    config = {"configurable": {"thread_id": "1"}}
    context = UserContext(user_id="1")

    r1 = agent.invoke(
        {"messages": [{"role": "user", "content": "what is the weather outside?"}]},
        config=config,
        context=context,
    )
    print(r1.get("structured_response"))

    r2 = agent.invoke(
        {"messages": [{"role": "user", "content": "Thanks"}]},
        config=config,
        context=context,
    )
    print(r2.get("structured_response"))


if __name__ == "__main__":
    main()
```

With the Microsoft OpenTelemetry distro enabled, all LangChain v1 operations (LLM calls, tool invocations, agent steps) emit OpenTelemetry spans using the latest semantic conventions. These traces appear in the **Observability** > **Traces** view in the Foundry portal and are linked to your Application Insights resource.

<Callout type="tip">
  After running the agent, wait a few minutes for traces to appear. If you don't see traces, verify your Application Insights connection string is correct and check the [Troubleshoot common issues](#troubleshoot-common-issues) section.
</Callout>

#### Verify your LangChain v1 traces

After running the agent:

1. Wait 2–5 minutes for traces to propagate.
2. In the Foundry portal, go to **Observability** > **Traces**.
3. Look for a trace with the name you specified (for example, "Weather information agent").
4. Expand the trace to see spans for LLM calls, tool invocations, and agent steps.

If you don't see traces, check the [Troubleshoot common issues](#troubleshoot-common-issues) section.

### Sample: LangGraph agent with Azure AI tracing

This sample shows a simple LangGraph agent instrumented with the Microsoft OpenTelemetry distro to emit OpenTelemetry-compliant traces for graph steps, tool calls, and model invocations.

#### LangGraph: Install packages

```bash
pip install \
  microsoft-opentelemetry \
  "langgraph>=1.0.0" \
  "langchain>=1.0.0" \
  langchain-openai \
  azure-identity \
  python-dotenv
```

#### LangGraph: Configure environment

* `APPLICATIONINSIGHTS_CONNECTION_STRING`: Azure Monitor Application Insights connection string for tracing.
* `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint URL.
* `AZURE_OPENAI_CHAT_DEPLOYMENT`: The chat model deployment name.
* `AZURE_OPENAI_VERSION`: API version, for example `2024-08-01-preview`.

Store these values in a `.env` file for local development.

#### LangGraph tracer setup

```python
from dotenv import load_dotenv
from microsoft.opentelemetry import use_microsoft_opentelemetry

load_dotenv(override=True)

use_microsoft_opentelemetry(
    enable_azure_monitor=True,
    sampling_ratio=1.0,
    instrumentation_options={
        "langchain": {
            "enabled": True,
            "agent_name": "Music Player Agent",
        },
    },
)
```

#### LangGraph: Tools

```python
from langchain_core.tools import tool

@tool
def play_song_on_spotify(song: str):
    """Play a song on Spotify"""
    # Integrate with Spotify API here.
    return f"Successfully played {song} on Spotify!"


@tool
def play_song_on_apple(song: str):
    """Play a song on Apple Music"""
    # Integrate with Apple Music API here.
    return f"Successfully played {song} on Apple Music!"


tools = [play_song_on_apple, play_song_on_spotify]
```

#### LangGraph: Model setup (Azure OpenAI)

```python
import os
import azure.identity
from langchain_openai import AzureChatOpenAI

token_provider = azure.identity.get_bearer_token_provider(
    azure.identity.DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default",
)

model = AzureChatOpenAI(
    azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
    azure_deployment=os.environ.get("AZURE_OPENAI_CHAT_DEPLOYMENT"),
    openai_api_version=os.environ.get("AZURE_OPENAI_VERSION"),
    azure_ad_token_provider=token_provider,
).bind_tools(tools, parallel_tool_calls=False)
```

#### Build the LangGraph workflow

```python
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver

tool_node = ToolNode(tools)

def should_continue(state: MessagesState):
    messages = state["messages"]
    last_message = messages[-1]
    return "continue" if getattr(last_message, "tool_calls", None) else "end"


def call_model(state: MessagesState):
    messages = state["messages"]
    response = model.invoke(messages)
    return {"messages": [response]}


workflow = StateGraph(MessagesState)
workflow.add_node("agent", call_model)
workflow.add_node("action", tool_node)

workflow.add_edge(START, "agent")
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "continue": "action",
        "end": END,
    },
)
workflow.add_edge("action", "agent")

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)
```

#### LangGraph: Run with tracing

```python
from langchain_core.messages import HumanMessage

config = {"configurable": {"thread_id": "1"}}
input_message = HumanMessage(content="Can you play Taylor Swift's most popular song?")

for event in app.stream({"messages": [input_message]}, config, stream_mode="values"):
    event["messages"][-1].pretty_print()
```

With the Microsoft OpenTelemetry distro enabled, your LangGraph execution emits OpenTelemetry-compliant spans for model calls, tool invocations, and graph transitions. These traces flow to Application Insights and appear in the **Observability** > **Traces** view in the Foundry portal.

<Callout type="tip">
  Each graph node and edge transition creates a separate span, making it easy to visualize the agent's decision flow.
</Callout>

#### Verify your LangGraph traces

After running the agent:

1. Wait 2–5 minutes for traces to propagate.
2. In the Foundry portal, go to **Observability** > **Traces**.
3. Look for a trace with the name you specified (for example, "Music Player Agent").
4. Expand the trace to see spans for graph nodes, tool invocations, and model calls.

If you don't see traces, check the [Troubleshoot common issues](#troubleshoot-common-issues) section.

### Sample: LangChain 0.3 setup with Azure AI tracing

This minimal setup shows how to enable Azure AI tracing in a LangChain 0.3 application using the Microsoft OpenTelemetry distro and `AzureChatOpenAI`.

#### LangChain 0.3: Install packages

```bash
pip install \
  "langchain>=0.3,<0.4" \
  langchain-openai \
  microsoft-opentelemetry \
  python-dotenv
```

#### LangChain 0.3: Configure environment

* `APPLICATIONINSIGHTS_CONNECTION_STRING`: Application Insights connection string for tracing. To find this value, open your Application Insights resource in the Azure portal, select **Overview**, and copy the **Connection String**.
* `AZURE_OPENAI_ENDPOINT`: Azure OpenAI endpoint URL.
* `AZURE_OPENAI_CHAT_DEPLOYMENT`: Chat model deployment name.
* `AZURE_OPENAI_VERSION`: API version, for example `2024-08-01-preview`.
* `AZURE_OPENAI_API_KEY`: Azure OpenAI API key.

<Callout type="note">
  This sample uses API key authentication for simplicity. For production workloads, use `DefaultAzureCredential` with `get_bearer_token_provider` as shown in the LangChain v1 and LangGraph samples.
</Callout>

#### LangChain 0.3: Tracer and model setup

```python
import os
from dotenv import load_dotenv
from microsoft.opentelemetry import use_microsoft_opentelemetry
from langchain_openai import AzureChatOpenAI

load_dotenv(override=True)

# Enable Azure Monitor export and LangChain auto-instrumentation
use_microsoft_opentelemetry(
    enable_azure_monitor=True,
    sampling_ratio=1.0,
    instrumentation_options={
        "langchain": {
            "enabled": True,
            "agent_id": "trip_planner_orchestrator_v3",
            "agent_name": "Trip Planner Orchestrator",
        },
    },
)

# Model: Azure OpenAI
llm = AzureChatOpenAI(
    azure_deployment=os.environ.get("AZURE_OPENAI_CHAT_DEPLOYMENT"),
    api_key=os.environ.get("AZURE_OPENAI_API_KEY"),
    azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
    api_version=os.environ.get("AZURE_OPENAI_VERSION"),
    temperature=0.2,
)
```

With the distro initialized, LangChain 0.3 operations are auto-instrumented globally. After you run your chain or agent, traces appear in the **Observability** > **Traces** view in the Foundry portal within 2-5 minutes.

## Configure tracing for OpenAI Agents SDK

The OpenAI Agents SDK supports OpenTelemetry instrumentation. Use the following snippet to configure tracing and export spans to Azure Monitor. If `APPLICATION_INSIGHTS_CONNECTION_STRING` isn't set, the exporter falls back to the console for local debugging.

Before you run the sample, install the required packages:

```bash
pip install opentelemetry-sdk opentelemetry-instrumentation-openai-agents azure-monitor-opentelemetry-exporter
```

```python
import os
from opentelemetry import trace
from opentelemetry.instrumentation.openai_agents import OpenAIAgentsInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter

# Configure tracer provider + exporter
resource = Resource.create({
    "service.name": os.getenv("OTEL_SERVICE_NAME", "openai-agents-app"),
})
provider = TracerProvider(resource=resource)

conn = os.getenv("APPLICATION_INSIGHTS_CONNECTION_STRING")
if conn:
    from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter
    provider.add_span_processor(
        BatchSpanProcessor(AzureMonitorTraceExporter.from_connection_string(conn))
    )
else:
    provider.add_span_processor(BatchSpanProcessor(ConsoleSpanExporter()))

trace.set_tracer_provider(provider)

# Instrument the OpenAI Agents SDK
OpenAIAgentsInstrumentor().instrument(tracer_provider=trace.get_tracer_provider())

# Example: create a session span around your agent run
tracer = trace.get_tracer(__name__)
with tracer.start_as_current_span("agent_session[openai.agents]"):
    # ... run your agent here
    pass
```

## Verify traces in the Foundry portal

1. Sign in to [Microsoft Foundry](https://ai.azure.com/?cid=learnDocs). Make sure the **New Foundry** toggle is on. These steps refer to **Foundry (new)**.![](https://learn.microsoft.com/azure/foundry/media/version-banner/new-foundry.png)
2. Confirm tracing is connected for your project. If needed, follow [Set up tracing in Microsoft Foundry](trace-agent-setup).
3. Run your agent at least once.
4. In the Foundry portal, go to **Observability** > **Traces**.
5. Confirm a new trace appears with spans for your agent's operations.

Traces typically appear within 2–5 minutes after agent execution. If traces still don't appear after this time, see [Troubleshoot common issues](#troubleshoot-common-issues).

## Troubleshoot common issues

| Issue                                                 | Cause                                                                                                                 | Resolution                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| You don't see traces in Foundry                       | Tracing isn't connected, there is no recent traffic, or ingestion is delayed                                          | Confirm the Application Insights connection, generate new traffic, and refresh after 2–5 minutes.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| You don't see LangChain or LangGraph spans            | The Microsoft OpenTelemetry distro isn't initialized or LangChain instrumentation isn't enabled                       | Confirm you call `use_microsoft_opentelemetry(...)` with `"langchain": {"enabled": True}` before running your agent.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| LangChain spans appear but tool calls are missing     | Tools aren't bound to the model or tool node isn't configured                                                         | Verify tools are passed to `bind_tools()` on the model and that tool nodes are added to your graph.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Traces appear but are incomplete or missing spans     | Content recording is disabled, the GenAI semantic convention opt-in isn't set, or some operations aren't instrumented | For LangChain and LangGraph, set `OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=SPAN_AND_EVENT`, `OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental`, and `AZURE_EXPERIMENTAL_ENABLE_GENAI_TRACING=true` during development. For custom operations, add manual spans using the OpenTelemetry SDK.                                                                                                                                                                                                                              |
| You see authorization errors when you query telemetry | Missing RBAC permissions on Application Insights or Log Analytics                                                     | Confirm access in **Access control (IAM)** for the connected resources. For log queries, assign the [Log Analytics Reader role](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#log-analytics-reader). If the tables are [protected](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/protected-tables-configure), also assign [Privileged Monitoring Data Reader](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#privileged-monitoring-data-reader). |
| Sensitive content appears in traces                   | Content recording is enabled and prompts, tool arguments, or outputs include sensitive data                           | Disable content recording in production and redact sensitive data before it enters telemetry.                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## Related content

* Learn core concepts and architecture in the [Agent tracing overview](../concepts/trace-agent-concept).
* If you haven't enabled tracing yet, see [Set up tracing in Microsoft Foundry](trace-agent-setup).
* Visualize agent health and performance metrics with the [Agent Monitoring Dashboard](how-to-monitor-agents-dashboard).
* Explore the broader observability capabilities in [Observability in generative AI](../../concepts/observability).

<Callout type="important">
  Items marked (preview) in this article are currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
</Callout>

Microsoft Foundry Agent Service lets you register agents that run outside Foundry, on any cloud, on-premises, or other host, so you can use Foundry's trace view and evaluation experiences. Foundry stores only registration metadata for these agents. It doesn't host, proxy, or invoke the runtime.

External agents differ from [Control Plane custom agents](../../control-plane/register-custom-agent), which route traffic through an AI Gateway. With external agents, your agent keeps its existing endpoint and shares only OpenTelemetry telemetry. No AI Gateway is required.

In this article, you learn how to:

* Instrument an external agent to emit OpenTelemetry spans to Application Insights.
* Register the agent in Foundry as an `external` agent.
* Verify traces in the Foundry portal.
* Run a trace-based evaluation over the agent's collected telemetry.

The following diagram shows the data flow: your external agent emits OpenTelemetry spans with a `gen_ai.agent.id` attribute to an Application Insights resource connected to your Foundry project. A separate registration call creates the agent record in Foundry. The Foundry portal then matches traces by agent ID and displays them in the agent trace view.

![Diagram that shows the data flow for external agent observability. The external agent emits OpenTelemetry spans to Application Insights, which connects to the Foundry portal trace view. A separate registration call creates the agent record in the Foundry project.](https://learn.microsoft.com/azure/foundry/agents/media/register-external/architecture.svg)

<Callout type="important">
  External agents are in preview. Create and update requests require the `Foundry-Features: ExternalAgents=V1Preview` header. SDK callers enable this by constructing `AIProjectClient` with `allow_preview=True`.
</Callout>

## Prerequisites

* A [Foundry project](../../how-to/create-projects) with an [Application Insights resource connected](../../observability/how-to/trace-agent-setup#connect-application-insights-to-your-foundry-project).

* An agent running outside Foundry that can emit OpenTelemetry spans to that Application Insights resource.

* Python 3.11 or later.

* **Foundry User** role on the project.

* **Reader** role or **Monitoring Reader** role on the connected Application Insights resource to view traces.

  <Callout type="important">
    The Foundry RBAC roles were recently renamed. **Foundry User**, **Foundry Owner**, **Foundry Account Owner**, and **Foundry Project Manager** were previously named Azure AI User, Azure AI Owner, Azure AI Account Owner, and Azure AI Project Manager. You might still see the previous names in some places while the rename rolls out. The role IDs and core permissions are unchanged by the rename.
  </Callout>

* `DefaultAzureCredential` configured. Sign in with `az login` or set up a managed identity or service principal.

* *(For evaluation only)* An Azure OpenAI deployment with a GPT model that supports chat completion (for example, `gpt-5-mini`).

## Instrument the external agent with OpenTelemetry

Before you register the agent in Foundry, configure it to export OpenTelemetry spans to the Application Insights resource connected to your Foundry project. Each span must carry the `gen_ai.agent.id` attribute so Foundry can attribute the span to the correct agent registration.

### Install the Microsoft OpenTelemetry package

```bash
pip install "microsoft-opentelemetry[langchain]"
```

### Configure the exporter

Run this code once during agent startup, before any framework imports that should be instrumented:

```python
import os

os.environ.setdefault("AZURE_EXPERIMENTAL_ENABLE_GENAI_TRACING", "true")
os.environ.setdefault("OTEL_SEMCONV_STABILITY_OPT_IN", "gen_ai_latest_experimental")
os.environ.setdefault("OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT", "SPAN_AND_EVENT")

from microsoft.opentelemetry import use_microsoft_opentelemetry

# Human-readable name for the agent
AGENT_NAME = os.environ.get("AGENT_NAME", "weather-agent")
# Unique ID emitted as gen_ai.agent.id on every span.
# Foundry matches traces to registrations by this value.
OTEL_AGENT_ID = os.environ.get("OTEL_AGENT_ID", f"{AGENT_NAME}-v1")

use_microsoft_opentelemetry(
    enable_azure_monitor=True,
    azure_monitor_connection_string=os.environ["APPLICATIONINSIGHTS_CONNECTION_STRING"],
    sampling_ratio=1.0,
    instrumentation_options={
        "fastapi": {"enabled": False},
        "langchain": {
            "enabled": True,
            "agent_id": OTEL_AGENT_ID,
            "agent_name": AGENT_NAME,
        },
    },
)
```

Set the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable on the host where the agent runs. Use the connection string from the Application Insights resource linked to your Foundry project. To find the connection string, open the [Foundry portal](https://ai.azure.com), navigate to your project, and select **Management** > **Connected resources**. Select the Application Insights resource to view its connection string. Alternatively, open the Application Insights resource directly in the Azure portal and copy the connection string from the **Overview** page.

After configuration, subsequent OpenTelemetry spans from your agent framework automatically flow to Application Insights. Each span must set the `gen_ai.agent.id` attribute to the value you choose as `otel_agent_id` during registration.

If your agent framework doesn't set this attribute automatically, add it manually:

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("agent-run") as span:
    span.set_attribute("gen_ai.agent.id", "travel-planner-agent-v1")
    # ... your agent logic ...
```

<Callout type="tip">
  For framework-specific auto-instrumentation (LangChain, LangGraph), the [Microsoft OpenTelemetry distro for Python](https://github.com/microsoft/opentelemetry-distro-python) can set `gen_ai.agent.id` automatically via `instrumentation_options`. For .NET and JavaScript, see the [.NET distro](https://github.com/microsoft/opentelemetry-distro-dotnet) and [JavaScript distro](https://github.com/microsoft/opentelemetry-distro-javascript). For general guidance, see [Configure tracing for AI agent frameworks](../../observability/how-to/trace-agent-framework).
</Callout>

## Register the external agent in Foundry

After the agent emits spans to Application Insights, register it in Foundry so those spans appear in the Foundry trace view scoped to the agent. Registering creates a named record in Foundry that links incoming traces (matched by `gen_ai.agent.id`) to the Foundry agent experience. Without this registration, traces still flow into Application Insights but don't appear in the Foundry agent trace view, and you can't run trace-based evaluations scoped to the agent.

### Install the SDK

```bash
pip install azure-ai-projects>=2.3.0 azure-identity>=1.17.0
```

### Create the registration

<Tabs>
  <Tab title="Foundry portal">
    You can create a registration in the [Foundry portal](https://ai.azure.com) by:

    1. Opening your project and selecting **Build** > **Agents** > **New agent**.

    2. Selecting **Link external agent**.

    3. In the window that appears, entering the agent name, description, and the OpenTelemetry ID.

       ![Screenshot showing the button to link an external agent.](https://learn.microsoft.com/azure/foundry/agents/media/register-external/foundry-button.png)
  </Tab>

  <Tab title="Python SDK">
    Set the `FOUNDRY_PROJECT_ENDPOINT` environment variable to your project endpoint. You can find this value on the project's **Overview** page in the Foundry portal.

    ```python
    import os
    from azure.ai.projects import AIProjectClient
    from azure.ai.projects.models import ExternalAgentDefinition
    from azure.identity import DefaultAzureCredential

    endpoint = os.environ["FOUNDRY_PROJECT_ENDPOINT"]

    # Create the project client with preview features enabled.
    project = AIProjectClient(
        endpoint=endpoint,
        credential=DefaultAzureCredential(),
        allow_preview=True,
    )

    # Register the externally hosted agent.
    agent = project.agents.create_version(
        agent_name="travel-planner-agent",
        description="Travel planning agent hosted externally.",
        definition=ExternalAgentDefinition(
            # Set explicitly when the running agent emits a gen_ai.agent.id
            # value that differs from the Foundry agent name.
            otel_agent_id="travel-planner-agent-v1",
        ),
    )

    print(f"Registered external agent: {agent.name}")
    print(f"Resolved otel_agent_id: {agent.versions.latest.definition.otel_agent_id}")
    ```

    ```output
    Registered external agent: travel-planner-agent
    Resolved otel_agent_id: travel-planner-agent-v1
    ```

    <Callout type="note">
      The `otel_agent_id` parameter is optional and defaults to the agent `name`. Set it explicitly only when the running agent already emits a stable `gen_ai.agent.id` value that differs from the Foundry agent name.
    </Callout>

    The `create_version()` method atomically creates the agent record and its first registration revision when called with a new name. External agents are versionless from the user's perspective. Edits to `otel_agent_id` create a new internal revision under the same name.
  </Tab>
</Tabs>

## Verify traces in the Foundry portal

After the agent sends traffic and spans ingest into Application Insights (typically 2–5 minutes), verify that traces appear in the Foundry portal:

1. Open the [Foundry portal](https://ai.azure.com).

2. Navigate to your project.

3. Select **Agents** from the left pane.

4. Select the external agent name (for example, **travel-planner-agent**).

5. Select the **Traces** tab to view spans attributed to this agent.

Traces are matched by `gen_ai.agent.id = <otel_agent_id>` from the Application Insights resource connected to the project. You can view inputs, outputs, tool calls, and latency for each span.

## Run a trace-based evaluation

After traces flow into Application Insights, you can run evaluations directly over those traces. No separate dataset construction is required. Foundry resolves traces by matching `(project, agent_id)` over a lookback window.

<Callout type="note">
  Trace-based evaluations use the OpenAI-compatible `evals` API (`project.get_openai_client().evals`). The native `project.evaluations` surface doesn't yet support trace-based evaluation.
</Callout>

### Resolve the agent's otel\_agent\_id

To get the agent's ID for traces, use the following:

```python
# Retrieve the registered agent and its resolved otel_agent_id.
agent = project.agents.get(agent_name="travel-planner-agent")
otel_agent_id = agent.versions.latest.definition.otel_agent_id
```

### Create and run the evaluation

Use the `otel_agent_id` to run a trace evaluation over the agent's collected telemetry. For the full walkthrough, including how to create an eval group, configure testing criteria, and interpret results, see [Trace evaluation (preview)](../../how-to/develop/cloud-evaluation#trace-evaluation-preview).

## Manage external agents

Use the same SDK methods to list, retrieve, and delete external agents.

### List external agents

```python
agents = project.agents.list(kind="external")
for a in agents:
    print(a.name)
```

### Delete an external agent

```python
# Delete the registration. This does not affect the running agent.
# force=True removes all internal revisions of the agent atomically.
project.agents.delete(agent_name="travel-planner-agent", force=True)
```

Deleting the registration removes the agent from the Foundry portal and stops traces from appearing in the Foundry agent trace view. The spans remain in Application Insights, and the running agent is not affected.

## Troubleshooting

### Troubleshoot missing traces

If you don't see traces, check the following items:

* The Application Insights resource is connected to the Foundry project where you registered the agent.
* The `otel_agent_id` on the registration matches the `gen_ai.agent.id` attribute on the spans.
* The agent process has `APPLICATIONINSIGHTS_CONNECTION_STRING` set to the correct Application Insights resource.
* Spans comply with [OpenTelemetry semantic conventions for generative AI](https://opentelemetry.io/docs/specs/semconv/gen-ai/).

For more troubleshooting guidance, see [Troubleshoot evaluation and observability issues](../../observability/how-to/troubleshooting).

### Troubleshoot registration errors

If `create_version()` fails, check the following items:

* You constructed `AIProjectClient` with `allow_preview=True`. Without this flag, external agent requests are rejected.
* Your identity has the **Foundry User** role (or higher) on the project.
* The `agent_name` value uses only alphanumeric characters, hyphens, and underscores.
* No existing agent with the same name and a different kind already exists. Use `project.agents.get()` to check.

## Current limitations

The following Foundry features aren't currently supported for external agents:

* [Human evaluation](../../observability/how-to/human-evaluation) — Manual review workflows aren't available for externally registered agents.
* [Convert agent traces into evaluation datasets](../../observability/how-to/traces-to-dataset) — Trace-to-dataset conversion isn't supported for external agents.
* [AI red teaming](../../concepts/ai-red-teaming-agent) — Red teaming scans can't target external agents.

## Related content

* [Agent tracing overview](../../observability/concepts/trace-agent-concept)
* [Set up tracing in Microsoft Foundry](../../observability/how-to/trace-agent-setup)
* [Configure tracing for AI agent frameworks](../../observability/how-to/trace-agent-framework)
* [Evaluate your AI agents](../../observability/how-to/evaluate-agent)
* [Register and manage custom agents (Control Plane)](../../control-plane/register-custom-agent)
* [Built-in evaluators](../../concepts/evaluation-evaluators/general-purpose-evaluators)
* [Azure Monitor OpenTelemetry overview](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opentelemetry-enable)
* [Run cloud evaluations](../../how-to/develop/cloud-evaluation#prerequisites)

<Callout type="important">
  Items marked (preview) in this article are currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
</Callout>

Production traces are the most representative source of how your agent behaves with real users. This article shows you how to use data generation in Microsoft Foundry to turn the traces your agent already emits into a curated, versioned dataset you can evaluate against. Then run an evaluation on the result. When you select traces, Foundry uses intelligent sampling to autoselect a representative set, so you get a high-value dataset without manual cleanup.

Converting traces into a dataset closes the observability loop: the production behavior you capture through tracing becomes the test set you use to measure and improve quality. The same job can also produce fine-tuning data.

Trace-based and synthetic generation are complementary: production traces reflect real user behavior, while synthetic generation covers prelaunch scenarios and edge cases. If your agent doesn't have production traces yet, or you want to extend coverage beyond what production traffic exercises, see [Generate a synthetic evaluation dataset](evaluation-dataset-synthetic).

## Intelligent sampling

When you select a time range of traces, the service doesn't just randomly sample from that window. It autoselects a representative set by using intelligent sampling, which curates a high-value set of traces from raw, noisy production data. You don't configure individual filter stages; the service handles selection for you. Intelligent sampling does the following tasks:

* **Filters out uninteresting traces** such as single-character messages and other low-intent traffic that add no evaluation signal.
* **Selects a diverse, representative sample** by using MinHash so the result covers the range of your agent's scenarios rather than overindexing on frequent, near-identical prompts.
* **Handles sensitive content** including personal data.

This process matters because evaluations are expensive and most raw traces add little signal. Recent research shows that careful selection can reach the same evaluation quality with a small fraction of the original traces. A representative set produces better signal at lower cost than evaluating everything. Intelligent sampling is the mechanism that makes trace selection practical at production scale, so you get evaluation-ready datasets without writing custom filtering or deduplication code.

Intelligent sampling uses the same trace-selection algorithm across three experiences in Foundry:

* **Creating a dataset from traces** - covered in this article.
* **Creating a trace-based evaluation** - evaluate against existing traces with a representative sample from the selected time range.
* **Generating a rubric evaluator from production traces** - the same sampling algorithm selects traces used as input.

In the trace-based dataset flow, the **Intelligent sampling** option appears in the time-range UI and is on by default.

## Prerequisites

* Python SDK version `2.2.0` or later: `pip install "azure-ai-projects>=2.2.0" azure-identity` (SDK path only)
* A Microsoft Foundry project endpoint URL in the format `https://<your-resource>.services.ai.azure.com/api/projects/<your-project>`
* Foundry User role or higher on the project.
* Set up tracing for a deployed agent that emits traces. Foundry agents emit traces automatically, and OpenTelemetry-instrumented third-party agents are also supported. For setup steps, see [Set up tracing for your agent](trace-agent-setup).

## Supported regions for traces to dataset generation

Traces to dataset generation is supported in the following regions:

* UAE North
* West US 3
* North Central US
* East US
* West Europe
* South Central US
* Switzerland North
* Sweden Central
* East US 2
* West US
* France Central
* South Africa North
* Australia East
* Japan East
* UK South
* Norway East
* Poland Central
* South India
* Germany West Central
* Italy North

## Generate an evaluation dataset from traces (portal)

You can create a dataset from traces directly in the portal without writing code. This method is the quickest way to turn recent production traffic into an evaluation dataset.

1. In the portal, open the **Data Generation** tab. Select **Create dataset** > **From traces**.

2. In the **Create dataset** dialog, confirm the subtitle **Curate a dataset from production traces for evaluation or fine-tuning.** Then configure the dataset:

   * **Dataset usage**: Set to **Evaluation**.
   * **Name**: Enter a dataset name.
   * **Agent**: Select the deployed agent whose traces you want to use.
   * **Date range**: Choose the window to pull traces from, such as the last day or last seven days.
   * **Maximum samples**: Set the cap on rows in the dataset. Use at least 15 samples.

   ![Screenshot of the Create dataset from traces dialog showing Dataset usage, Name, Agent, Date range, and Maximum samples.](https://learn.microsoft.com/azure/foundry/media/observability/data-generation-from-traces.png)

3. Select **Create** to submit the job. Dataset generation runs as a background job. You can track its status on the **Data Generation** tab.

4. When the job finishes, go to the **Data** tab and select the dataset to preview the generated rows, including the description, query, and response for each. From there you can download or delete the dataset.

5. Use the dataset. Finished generation jobs link directly to the next step: evaluation jobs link to starting an evaluation run, and fine-tuning jobs link to starting a fine-tuning job.

## Generate an evaluation dataset from traces (SDK)

Drive your deployed agent with realistic traffic, and then use those conversations to build an evaluation dataset. The flow is: define a time window, point at your agent, set a cap on rows, and submit the job.

First, create an `AIProjectClient` by using your project endpoint and `DefaultAzureCredential`. You can find all data generation operations under `project_client.beta.datasets`.

```python
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

credential = DefaultAzureCredential()
project_client = AIProjectClient(
    endpoint="https://<your-resource>.services.ai.azure.com/api/projects/<your-project>",
    credential=credential,
)
```

<Callout type="note">
  Application Insights takes 30–90 seconds to ingest spans. If you submit the job too quickly after capturing traffic, the job runs against an empty window and produces no samples.
</Callout>

```python
import time
from datetime import datetime, timedelta, timezone

from azure.ai.projects.models import (
    DataGenerationJob,
    DataGenerationJobInputs,
    DataGenerationJobOutputOptions,
    DataGenerationJobScenario,
    DatasetDataGenerationJobOutput,
    JobStatus,
    TracesDataGenerationJobOptions,
    TracesDataGenerationJobSource,
)

AGENT_NAME = "retail-agent"
TERMINAL_STATUSES = {JobStatus.SUCCEEDED, JobStatus.FAILED, JobStatus.CANCELLED}

# 1. Record the window around your traffic.
end_time = datetime.now(tz=timezone.utc)
start_time = end_time - timedelta(days=7)

# 2. Define the job. Note the EVALUATION scenario.
job = DataGenerationJob(
    inputs=DataGenerationJobInputs(
        name="retail-agent-eval-set",
        scenario=DataGenerationJobScenario.EVALUATION,
        sources=[
            TracesDataGenerationJobSource(
                description="Application Insights conversation traces for the Foundry agent.",
                agent_name=AGENT_NAME,
                start_time=start_time,
                end_time=end_time,
                # agent_version="3",   # pin to a specific version (recommended)
            ),
        ],
        options=TracesDataGenerationJobOptions(
            # Service requires max_samples to be between 15 and 1000.
            max_samples=100,
        ),
        output_options=DataGenerationJobOutputOptions(name="retail-agent-eval-set"),
    ),
)

# 3. Submit and poll until complete.
job = project_client.beta.datasets.create_generation_job(job=job)
print(f"Submitted {job.id} (status: {job.status})")

while job.status not in TERMINAL_STATUSES:
    time.sleep(10)
    job = project_client.beta.datasets.get_generation_job(job_id=job.id)
    print(f"  status: {job.status}")

if job.status != JobStatus.SUCCEEDED:
    message = job.error.message if job.error is not None else "<no error message>"
    raise RuntimeError(f"Job ended in {job.status}: {message}")

# 4. Resolve the generated dataset.
output_name = ""
output_version = ""
for output in (job.result.outputs if job.result is not None else None) or []:
    if isinstance(output, DatasetDataGenerationJobOutput):
        output_name = output.name or ""
        output_version = output.version or ""
        break

dataset = project_client.datasets.get(name=output_name, version=output_version)
print(f"Generated dataset: {dataset.name} v{dataset.version} (id: {dataset.id})")
if job.result is not None and job.result.generated_samples is not None:
    print(f"Generated samples: {job.result.generated_samples}")
```

The job produces a versioned dataset registered in your project. The number of rows is capped by `max_samples` but might be lower if the window doesn't contain enough distinct, high-quality traces after intelligent sampling.

Whether you created the dataset from the portal or the SDK, you can preview it on the **Data** tab to inspect the generated rows before evaluating. You can also download or delete it from there.

## Run an evaluation against the generated dataset

After the dataset exists, evaluate your agent against it. The generated dataset uses the standard query-response schema, so it works directly with the evaluation APIs. Pass the dataset's `name` and `version` (or its `id`) to your evaluation run.

For the full evaluation flow, including selecting evaluators and reviewing results, see [Run cloud evaluations](../../how-to/develop/cloud-evaluation).

## Manage data generation jobs

Use `project_client.beta.datasets` APIs to list, inspect, cancel, and delete data generation jobs.

```python
from azure.ai.projects.models import DataGenerationJobScenario

# List recent evaluation jobs.
for job in project_client.beta.datasets.list_generation_jobs(
    limit=20,
    order="desc",
    scenario=DataGenerationJobScenario.EVALUATION,
):
    print(f"{job.id}  {job.status:<12}  {job.inputs.name}")

# Cancel a running job.
project_client.beta.datasets.cancel_generation_job(job_id="job_...")

# Delete a job record (produced datasets are not deleted).
project_client.beta.datasets.delete_generation_job(job_id="job_...")
```

## Limitations

* The Application Insights resource connected to your Foundry project must allow public network access so the service can query Application Insights data. If Application Insights is behind an Azure Monitor Private Link Scope, make sure public network query access is enabled.
* If your Foundry project is connected to your own storage account, public network access must be enabled on that storage account for successful dataset creation.

## Best practices

* **Pin `agent_version` for trace jobs.** Without it, the job mixes spans from every active version, which can include stale behavior and weaken your evaluation signal.
* **Check `generated_samples` after every job.** `max_samples` is a ceiling, not a guarantee. Intelligent sampling removes duplicates and low-quality traces, so you can get fewer rows than the cap.
* **Use a representative time window.** A seven-day window usually captures enough variety. Narrow windows around a known incident are useful for building targeted regression sets.

## Related content

* [Generate a synthetic evaluation dataset](evaluation-dataset-synthetic)—bootstrap an evaluation dataset without production traces.
* [Agent tracing in Microsoft Foundry](../concepts/trace-agent-concept)
* [Run cloud evaluations](../../how-to/develop/cloud-evaluation)

<Callout type="important">
  Items marked (preview) in this article are currently in public preview. This preview is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
</Callout>

Add thumbs up or thumbs down annotations to traces in Microsoft Foundry to capture human quality signals on individual agent interactions. Trace annotations let you mark whether an agent response was helpful or unhelpful, and they appear inline on the trace detail page so you can quickly identify patterns in agent behavior.

Trace annotations support two workflows:

* **Builder annotations:** Builders and domain experts annotate traces from the Foundry portal while reviewing agent interactions. These annotations are automatically tagged with a source of `builder`.
* **End user feedback:** Log annotations programmatically from your application when end users provide thumbs up or thumbs down feedback. These annotations carry a source of `end_user` and appear on the trace page alongside builder annotations. For details on logging end user feedback, see [Log end user feedback](log-end-user-feedback).

All annotations are **appended** to the trace—adding a builder annotation never overwrites or replaces existing end-user feedback, and vice versa. Each annotation carries a source attribute so the signals remain independently queryable and filterable.

## Prerequisites

* A Foundry project with an [Application Insights resource](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) connected. See [Set up tracing](trace-agent-setup).

* OpenTelemetry instrumentation configured in your application. See [Set up tracing in Microsoft Foundry](trace-agent-setup) for setup instructions.

* For programmatic annotations: the `azure-ai-projects` and `azure-monitor-opentelemetry` packages installed.

  ```bash
  pip install "azure-ai-projects>=2.0.0" azure-monitor-opentelemetry python-dotenv
  ```

## Default scoring template

Every Foundry project is preseeded with a default thumbs up/down scoring template that is immediately available with no additional setup. You can start annotating traces on day one. The default template uses binary pass/fail scoring:

* **Thumbs up** = score `1.0`, label `pass`
* **Thumbs down** = score `0.0`, label `fail`

Each scoring template requires a `gen_ai.evaluation.name attribute` to have value `task_completion` so every annotation is attributable to a specific evaluation dimension. `task_completion` supports thumbs up and down.

## Annotate traces in the Foundry portal

Add annotations directly from the trace detail page to record your assessment of agent responses.

1. Open your Foundry project and navigate to **Tracing** in the left navigation.
2. Select a trace to open the trace detail view.
3. On the trace detail page, select the **Annotate** button in the upper-right corner.
4. Select **Thumbs up** or **Thumbs down** to submit your score. Optionally add a free-text explanation.
5. The annotation saves immediately and appears on the trace.

![Screenshot of the Annotations tab on the trace detail page in the Foundry portal.](https://learn.microsoft.com/azure/foundry/media/observability/trace-annotations.png)

Annotations you add from the portal are automatically tagged with:

* `microsoft.gen_ai.human_evaluation.source` = `"builder"`
* Records will be with `microsoft.gen_ai.evaluation.actor.type` as `"human"`

### Score editing

Each user can annotate multiple times, however:

* Multiple users can each have their own annotation of the same type on the same trace.
* Prior annotations are never deleted in Application Insights, new annotations are appended, and the portal displays all annotations in *Annotation History* section of annotation panel.

## Log end user feedback as trace annotations

When end users provide thumbs up or thumbs down feedback in your application, you can log that feedback so it appears as annotations on the corresponding trace. This approach uses the `gen_ai.evaluation.result` OpenTelemetry event, with the feedback automatically correlated to the originating trace.

### Annotation attribute schema

Use the following attributes when you emit a thumbs up or thumbs down annotation:

| Attribute                                  | Value                                    | Description                                                                                                |
| ------------------------------------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `gen_ai.evaluation.name`                   | `task_completion`                        | Evaluation metric name                                                                                     |
| `gen_ai.evaluation.score.value`            | `1.0` (thumbs up) or `0.0` (thumbs down) | Numeric score                                                                                              |
| `gen_ai.evaluation.score.label`            | `"pass"` or `"fail"`                     | Categorical label                                                                                          |
| `gen_ai.evaluation.explanation`            | Optional free-text comment               | Reviewer explanation                                                                                       |
| `gen_ai.response.id`                       | For example, `"chatcmpl-123"`            | AI response ID used to correlate the annotation with the traced response                                   |
| `microsoft.gen_ai.human_evaluation.source` | `"end_user"` or `"builder"`              | Feedback provider type                                                                                     |
| `microsoft.gen_ai.evaluation.actor.type`   | `"human"`                                | Indicates the annotation was submitted by a human reviewer, distinguishing it from automated evaluations   |
| `operation_Id`                             | `trace_Id`                               | Links the annotation to the original trace request in Application Insights                                 |
| `operation_ParentId`                       | `span_Id`                                | Includes span ID of the specific span within the trace being annotated                                     |
| `gen_ai.agent.id`                          | Agent resource identifier string         | Unique identifier of the agent that produced the response being annotated                                  |
| `gen_ai.agent.name`                        | Agent display name string                | Display name of the agent that produced the response being annotated                                       |
| `gen_ai.agent.version`                     | Version string `1`, `2`, or `3`          | Located inside `internal_properties`, version of the agent at the time the annotated response was produced |

You must emit the evaluation event within the same trace context (using the same trace ID and span ID) as the agent interaction it annotates. This correlation ensures the annotation appears on the correct trace in the portal.

For a complete runnable example, see [sample\_human\_evaluations.py](https://github.com/Azure/azure-sdk-for-python/blob/main/sdk/ai/azure-ai-projects/samples/evaluations/sample_human_evaluations.py).

## View annotations on the trace page

After you add annotations (from the portal or programmatically), they appear on the trace detail page.

1. Open your Foundry project and go to **Tracing**.
2. Select a trace that has annotations.
3. On the trace detail page, annotation icons appear next to the annotated spans. A thumbs up icon indicates positive feedback and a thumbs down icon indicates negative feedback.
4. Hover over an annotation to see metadata, including the source (`builder` or `end_user`), evaluation name, and timestamp.

In the trace list view, annotations display with a compact treatment: only the most recent annotation shows inline, and when multiple annotations exist on a trace, a "+X more" indicator signals additional annotations are available. Select the trace to see all annotations.

### Filter traces by annotation

You can filter the trace list by:

* **Evaluation type** (`gen_ai.evaluation.name`): value is `"task_completion"`.
* **Score value or label** (`gen_ai.evaluation.score.value`, `gen_ai.evaluation.score.label`): for example, show only traces with a thumbs-down rating.
* **Source** (`microsoft.gen_ai.human_evaluation.source`): show only builder annotations or only end-user feedback.

These filter dimensions appear alongside existing trace filters (time range, agent, status, model).

## Query annotations in Application Insights

All annotations are published to Azure Monitor / Application Insights and attached to the original trace. You can query annotations by using Kusto Query Language (KQL) to analyze feedback patterns, build dashboards, or set up alerts.

### Summarize feedback by source and day

```kusto
customEvents
| where name == "gen_ai.evaluation.result"
| extend
    eval_name = tostring(customDimensions["task_completion"]),
    score = todouble(customDimensions["gen_ai.evaluation.score.value"]),
    label = tostring(customDimensions["gen_ai.evaluation.score.label"]),
    eval_source = tostring(customDimensions["microsoft.gen_ai.human_evaluation.source"]),
    trace_id = tostring(customDimensions["trace_id"])
| where eval_source in ("builder", "end_user")
| summarize
    thumbs_up = countif(score == 1.0),
    thumbs_down = countif(score == 0.0),
    total = count()
  by eval_source, bin(timestamp, 1d)
| order by timestamp desc
```

### Find traces with negative feedback

```kusto
customEvents
| where name == "gen_ai.evaluation.result"
| extend
    eval_name = tostring(customDimensions["task_completion"]),
    score = todouble(customDimensions["gen_ai.evaluation.score.value"]),
    eval_source = tostring(customDimensions["microsoft.gen_ai.human_evaluation.source"]),
    explanation = tostring(customDimensions["gen_ai.evaluation.explanation"]),
    trace_id = tostring(customDimensions["trace_id"])
| where score == 0.0
| project timestamp, trace_id, eval_name, eval_source, explanation
| order by timestamp desc
```

## Related content

* [Log end user feedback](log-end-user-feedback)
* [Set up tracing in Microsoft Foundry](trace-agent-setup)
* [Review agent interactions with Trace Replay](trace-agent-replay)
* [Monitor agents with the Agent Monitoring Dashboard](how-to-monitor-agents-dashboard)

Foundry tracing is an observability capability in Microsoft Foundry that captures Customer Data from AI agents. It helps developers and operators understand system behavior, debug problems, and optimize performance.

Tracing records information such as:

* User inputs and prompts
* Agent and model inputs and outputs
* Tool calls and intermediate steps
* Execution metadata (timestamps, latency, token usage, errors, etc.)

This data might include user-generated content and operational telemetry.

This data is used to provide visibility into how agents run, enabling troubleshooting and performance improvements across agent workflows. Foundry uses OpenTelemetry standards and stores trace data in connected telemetry systems Azure Monitor Application Insights.

<Callout type="important">
  When you enable AppInsights for a project, AppInsights logs traces to help monitor and evaluate user-level interactions with agents. Project members with the Log Analytics Reader role in AppInsights can view trace data, which might contain personal data and customer content. If the underlying Log Analytics tables are [protected](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/protected-tables-configure) (their protection level is set to **Protected**), members need the [Privileged Monitoring Data Reader](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#privileged-monitoring-data-reader) role to view that trace data. Review what trace data is collected and who can view and use this data. More information is in the following section.

  Default state:

  * **Tracing is off by default.**
  * No trace data is collected or stored unless explicitly enabled by Foundry Account Owner or Foundry Owner.

  Additional [Azure Monitor App Insights pricing](https://azure.microsoft.com/pricing/details/monitor/) might apply.
</Callout>

This ensures customers retain control over when data collection begins.

## Enable tracing

Tracing is enabled when a project is connected to an Azure Monitor Application Insights resource. Common enablement flows include:

* Creating or connecting an Application Insights resource during project creation.
* Creating or connecting an Application Insights resource to an existing project without a connected Application Insights resource.

When you enable tracing:

* Trace data begins to be collected and stored for all agents within the project.
* To view traces in the Foundry Tracing UI, users need access to the Foundry project and read permission on the connected Application Insights or Log Analytics workspace. For example, roles such as Log Analytics Reader, Monitoring Reader, or Reader at the Application Insights resource, Log Analytics workspace, or an appropriate parent scope can grant this access. If the underlying Log Analytics tables are [protected](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/protected-tables-configure), assignees also need the [Privileged Monitoring Data Reader](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#privileged-monitoring-data-reader) role to read that data.

## Disable tracing

Disable tracing by:

* Disconnecting or removing the Application Insights resource.

After you disable tracing:

* No new trace data is collected on agents in that project.
* Previously collected data remains subject to retention policies of the Application Insights.

<Callout type="note">
  Exact steps on how to disable tracing depend on the UI or SDK surface and should align with product documentation.
</Callout>

## Where data is stored

* The Application Insights resource connected to the Foundry project stores trace data.
* Your Application Insights and Log Analytics configuration governs data retention and storage. For more information, see [Manage data retention in a Log Analytics workspace](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-retention-configure).

## Data sharing considerations

* Trace data may be accessible to users with appropriate permissions on the connected telemetry resource.
* Depending on the configuration, users within the same project or tenant might see data.
* To view traces in the Foundry Tracing UI, users need access to the Foundry project and read permission on the connected Application Insights or Log Analytics workspace. For example, roles such as Log Analytics Reader, Monitoring Reader, or Reader at the Application Insights resource, Log Analytics workspace, or an appropriate parent scope can grant this access. If the underlying Log Analytics tables are [protected](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/protected-tables-configure), assignees also need the [Privileged Monitoring Data Reader](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#privileged-monitoring-data-reader) role to read that data.
* For additional considerations and important information specific to hosted agents, review [hosted agents](../../agents/concepts/hosted-agents) and [hosted agent's platform-injected environment variables](../../agents/how-to/deploy-hosted-agent#platform-injected-environment-variables).

Customers are responsible for configuring access controls and ensuring compliance with their organizational policies.

## Privacy

Tracing can capture personal data including:

* User prompts and responses
* Application-specific content

### Best practices

* Avoid logging secrets, credentials, or tokens.
* Redact or minimize personal data before it is logged.
* Apply access controls and retention policies to trace data.

### Data protection controls

* Personal data redaction: Redact personal data, such as email addresses and phone numbers.
* Restrict access to trace data by carefully managing which users are granted the RBAC **Log Analytics Reader** role. When the underlying Log Analytics tables are [protected](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/protected-tables-configure), also manage who has the [Privileged Monitoring Data Reader](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/manage-access?tabs=portal#privileged-monitoring-data-reader) role, because it grants read access to protected tables.
* Configurable policies: Control what data is captured and visible.

These controls help you manage risk and comply with privacy requirements.

### Customer responsibilities

When you enable tracing, you're responsible for:

* Informing end users about data collection, including the types of data being collected, the purpose, who has visibility, their options, and other information needed for them to make reasonable choices (where applicable).
* Ensuring compliance with privacy, legal, and regulatory requirements.
* Configuring appropriate access controls and data retention policies.

## Summary

Foundry Tracing is a powerful observability feature that enables debugging, monitoring, and optimization of AI agents. It is:

* Off by default.
* Explicitly enabled by connecting telemetry resources.
* Designed with customer control over data collection and handling.

## Related content

* [Agent tracing overview](trace-agent-concept)
* [Set up tracing](../how-to/trace-agent-setup)
* [Configure tracing for AI agent frameworks](../how-to/trace-agent-framework)
