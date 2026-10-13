# Zeroth Responder AI

Zeroth Responder is an intelligent healthcare navigation proof-of-concept. It sits right before the first responders, acting as a triage router for near-emergency medical situations. By combining Retrieval-Augmented Generation (RAG) with agentic tool calling via the Model Context Protocol (MCP), it processes patient symptoms, location, and residency status to recommend the optimal medical facility.

The system is designed to evaluate real-world constraints such as physical drive times, mock hospital wait times, and Australian healthcare routing logic (Medicare eligibility, state ambulance policies, and visa insurance requirements) without ever requesting or storing sensitive identification numbers.

## Architecture & Tech Stack

The project relies on a distributed microservice architecture designed for speed and state management:

*   **Frontend (React/Vite):** A lightweight client for guest-session symptom logging and demographic capture.
*   **Orchestrator (Golang):** The core API and LLM agent manager. It orchestrates parallel tool execution and handles session state.
*   **Vector Embeddings (Go/fastembed-go):** In-process text vectorization using `BAAI/bge-small-en-v1.5` via the ONNX runtime, bypassing the need for an external embedding container.
*   **Vector Database (Qdrant):** Stores and filters vectorized institutional policies and insurance guidelines.
*   **Relational Database (PostgreSQL):** Manages ephemeral guest session data and non-identifiable user residency parameters.
*   **Clinical Availability (TypeScript/Node):** A dedicated MCP server that synthesizes and serves mock hospital capacities, wait times, and specialist rosters.
*   **AI/LLM:** Cloud-hosted LLM (e.g., Azure OpenAI) optimized for rapid JSON tool calling and orchestration.

## Key Features

*   **Parallel Agentic Execution:** The Go orchestrator simultaneously hits geographic routing APIs (OSRM) and clinical capacity APIs (TypeScript MCP) to dramatically reduce latency.
*   **Privacy-By-Design:** Built specifically to avoid handling highly regulated data. Financial and coverage routing is resolved using broad categorical enums (e.g., State of Residence, Visa Class, Insurance Tier) rather than specific identifiers.
*   **Stateless AI:** Designed to leverage enterprise cloud LLM APIs with zero-data-retention policies, keeping patient queries out of model training pipelines.

## Project Structure

```text
zeroth-responder/
├── frontend/           # React SPA (Vite) for guest triage sessions
├── backend/            # Go Orchestrator and fastembed-go logic
├── mcp-server/         # TypeScript MCP server for mock clinical data
├── docs/               # Architecture diagrams and API schemas
├── infra/              # Terraform modules for Azure deployment
└── docker-compose.yml  # Local development environment
```

## Local Development Setup

Prerequisites: Docker, Docker Compose, and Go 1.21+.

This project uses LiteLLM as a proxy gateway. This allows the Go orchestrator to use a single standard interface while routing requests to any LLM provider (Anthropic, OpenAI, Gemini, etc.) by simply passing the target model name in the API call.

### Clone the repository:
```bash
git clone [https://github.com/yourusername/zeroth-responder.git](https://github.com/yourusername/zeroth-responder.git)
cd zeroth-responder
```

### Create an environment file:

Create a .env file in the project root and add the API keys for the models you wish to test. You only need to provide the keys for the specific providers you intend to use.

```
# Local Gateway Key (Used by Go to authenticate with LiteLLM)
LITELLM_MASTER_KEY=sk-zeroth-local-key

# Model Provider Keys
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GEMINI_API_KEY=your-google-key
```

### Start the local infrastructure (Postgres, Qdrant, and the MCP Server):

```Bash
docker-compose up -d
```

Run the Go Orchestrator:

```Bash
cd backend
go run main.go
```

Disclaimer
This is a proof-of-concept software project intended for architectural exploration of LLM tool-calling and RAG pipelines. It is not a certified medical device, does not provide verified medical advice, and should not be used for actual emergency medical triage.
