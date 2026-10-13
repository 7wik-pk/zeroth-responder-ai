Healthcare Triage & Routing RAG System: Implementation Plan

This document outlines the architecture, data structures, and deployment strategy for building the distributed healthcare routing system. It is designed to be model-agnostic, rely on in-process embeddings for the Go backend, and safely handle Australian healthcare parameters.

1. System Architecture & Component Roles

The pipeline is split into purpose-built microservices:

Go Orchestrator (Backend API): The central nervous system. It handles incoming triage requests, manages the LLM agent's tool execution, and runs embedding models directly in memory.

LiteLLM Proxy (AI Gateway): A model-agnostic proxy gateway providing a unified OpenAI-compatible endpoint. It abstracts upstream LLM providers (Anthropic Claude, OpenAI GPT-4o/Codex, Google Gemini, Azure OpenAI), standardizing tool-calling schemas, rate limiting, and API key management while allowing provider switching without backend code modifications.

React Client (Frontend): A lightweight Single Page Application (SPA) for capturing patient symptoms and demographic state without requiring mandatory authentication.

TypeScript MCP Server: A dedicated Node/Express service exposing synthetic live clinical data (hospital capacity, doctor rosters) via the Model Context Protocol.

Qdrant (Vector Database): Stores the vectorized institutional policies, hospital terms and conditions, and insurance documents.

PostgreSQL (Relational Database): Stores ephemeral guest sessions, user profiles, and triage interaction history.

2. In-Process Embeddings (Golang)

Instead of standing up a dedicated Docker container for embeddings, the Go orchestrator uses the fastembed-go library (a Go implementation of Qdrant's FastEmbed). This runs quantized models locally via the ONNX runtime.   Implementation Details:

Library: [github.com/anush008/fastembed-go](https://github.com/anush008/fastembed-go)

Model: BAAI/bge-small-en-v1.5 (default). It is highly optimized for CPU inference and keeps the container memory footprint small.

Mechanism: When the Go backend receives a user query or a new policy document, it calls model.Embed() within a goroutine. The resulting vector is passed directly to Qdrant without a network hop.

3. Handling Australian Healthcare & Identity ConstraintsTo navigate Australian healthcare rules (Medicare, Reciprocal Health Care Agreements, state-based ambulance laws) without handling highly regulated identity data, the system relies strictly on categorical enums.

Database Schema (Postgres users / guest_sessions table):

session_id (UUID)
state_of_residence (Enum: VIC, NSW, QLD, WA, SA, TAS, ACT, NT)
residency_status (Enum: Citizen, Permanent Resident, RHCA Visitor, Student Visa, Other Temporary)
insurance_tier (Enum: None, Basic, Comprehensive, OSHC)

Crucial Security Constraint:

The system is explicitly designed never to request, parse, or store sensitive identification numbers. Your frontend forms and backend validators must reject inputs resembling Tax File Numbers (TFN), Medicare numbers, Individual Healthcare Identifiers (IHI), or Centrelink CRNs. The RAG pipeline reasons about a patient's financial routing based purely on the categorical enums above (e.g., matching Student Visa to OSHC network hospitals) rather than individual identity verification.

4. The Agentic Data Flow (Step-by-Step)

Ingestion & State Creation:
User submits symptoms, location (lat/long), and residency enums via the React frontend.

Go backend generates an ephemeral session_id, saves the state to Postgres, and constructs the LLM context payload.

Context Enrichment (Vector Search):
The Go backend uses fastembed-go to embed the user's intent.

Go queries Qdrant to retrieve the top-K policy documents matching the symptoms and residency enums (e.g., retrieving the billing policy for an RHCA visitor with suspected appendicitis).

Parallel Tool Execution (LLM Dispatch):

The Go orchestrator sends the context to the LiteLLM proxy gateway, dispatching to the configured upstream LLM provider (e.g., Anthropic Claude, OpenAI GPT-4o/Codex, Google Gemini, Azure OpenAI) configured with two tools using standard OpenAI-compatible function calling.

Tool A (TypeScript MCP): The LLM requests real-time capacity and wait times for nearby emergency rooms based on synthetic Synthea/Faker data.

Tool B (OSM/OSRM API): The LLM calculates exact drive times from the patient's coordinates to the filtered facilities.

Synthesis & Output:

The LLM evaluates the results, prioritizing the facility with the lowest combined travel and wait time that aligns with the patient's insurance tier.

The Go backend streams the final formatted recommendation back to the React client.

5. Deployment & Infrastructure Strategy

The infrastructure is split into local development and cloud production environments.

Local Development (Docker Compose)

A single docker-compose.yml file is sufficient to spin up the local environment. Because embeddings run in-process within the Go app, you only need four containers:

qdrant (qdrant/qdrant:latest)
postgres (postgres:15-alpine)
ts-mcp-server (Custom Node image)
litellm (ghcr.io/berriai/litellm:main-latest) - proxying calls to upstream models (Anthropic, OpenAI, Codex, Gemini, etc.) via litellm/config.yaml

(The Go backend runs directly on your host machine during development for easier debugging, connecting to the exposed ports of the containers).

Azure Production (Terraform)

Your Terraform (main.tf) will provision the following Azure resources:

Azure Container Apps (ACA): Hosts the containerized Go backend, TypeScript MCP server, and LiteLLM proxy gateway. ACA is ideal because it scales down to zero when idle, keeping hobby project costs low.

Azure Database for PostgreSQL (Flexible Server): A managed Postgres instance for session state.

Qdrant Cloud (or Qdrant on ACA): Use Qdrant's managed free tier or deploy a Qdrant container alongside your apps in ACA.

Upstream LLM Providers: Enterprise endpoints accessed through LiteLLM (e.g., Azure OpenAI Service, Anthropic, OpenAI, Google Gemini) with strict zero-data-retention policies to process triage queries.
