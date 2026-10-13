| Component | Technology Stack | Core Responsibility & Deployment Mode | Handling Guest & Residency Logic (Australia-specific) |
| :--- | :--- | :--- | :--- |
| **Frontend** | React (Vite) | Light UI, manages state/sessions, capture triage, geocoords, and basic personal parameters. | Collects Categorical Inputs (e.g., Guest Session bypass, Medicare eligibility, Visa Enum, State). Avoids processing identifying data (No TFN/Medicare card numbers). |
| **Orchestrator Backend** | Golang | Manages APIs, session tokens, parallel tool execution, and in-process embedding. | Orchestrates triage decisions, mapping residency and state (e.g., VIC vs. QLD ambulance fee policies) to verify coverage. Generates temporary IDs for Guest sessions. |
| **LLM Gateway** | LiteLLM (`ghcr.io/berriai/litellm`) | Multi-provider AI proxy gateway (OpenAI-compatible). Standardizes API calls and routes agentic triage requests across Anthropic (Claude), OpenAI (GPT-4o/Codex), Google Gemini, Azure OpenAI, etc. | Enforces stateless, zero-data-retention routing and unified function-calling schemas across all upstream model providers without passing identifying patient data. |
| **Relational Database** | PostgreSQL | Holds session IDs, transient client demographics, guest metadata, and logs. | Saves active guest metrics (e.g. `is_guest: true`) and state configurations, maintaining session continuity for the visits without login friction. |
| **Embedding Engine** | Go In-Process (`fastembed-go`) | In-memory text chunk vectorization using `BAAI/bge-small-en-v1.5`. Runs via embedded ONNX runtime. | Converts unstructured symptom logs and policy queries into semantic vector representations in-process, bypassing the latency of network calls. |
| **Vector Database** | Qdrant | Storage and semantic filtering of hospital profiles, billing matrices, and T&Cs. | Multi-tenancy filtering based on the user's `residency_status` and state (e.g., checking if the venue accepts Overseas Student Health Cover - OSHC). |
| **Clinical Availability** | TypeScript (MCP) | Custom microservice generating synthetic live facility loads, wait times, and rosters. | Generates mocking patient throughput, nurse rosters, and ER status, indicating which doctors or sub-specialists can support the patient's immediate triage state. |
| **Routing / Maps Engine**| OSRM or Azure Maps | Geographic distance and traffic calculation, routing, and ETA estimations. | Calculates physical drive/ambulances routes. Leverages the state/address to identify transport borders, checking local coverage models. |

use: langsmith for observability
experiment w graphRAG (neo4j), agenticRAG (langraph), hybrid (vanilla - Qdrant)

consider:

- CRAG (corrective, as failsafe) to avoid hallucinations when data of a particular kind is missing from the vector store docs, 
- have guardrails in place to protect sensitive data of patients, doctors, etc.
