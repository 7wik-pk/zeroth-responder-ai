import React, { useEffect, useState } from 'react';
import { 
  Cpu, 
  Database, 
  Navigation, 
  Hospital, 
  Sparkles, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

export function AgenticThinkingModal({ isOpen, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 1,
      name: 'In-Process Semantic Vectorization',
      tech: 'Go / fastembed-go (BAAI/bge-small-en-v1.5)',
      detail: 'Embedding symptom text into 384-dim vector in-memory via ONNX runtime (0 network hops)...',
      icon: Cpu,
      color: '#06b6d4',
    },
    {
      id: 2,
      name: 'Policy & T&C Retrieval',
      tech: 'Qdrant Vector DB (Cosine Distance)',
      detail: 'Filtering Australian hospital billing matrices, reciprocal Medicare & OSHC acceptance rules...',
      icon: Database,
      color: '#8b5cf6',
    },
    {
      id: 3,
      name: 'Geospatial Transit Calculation',
      tech: 'OSRM Engine / Road Network API',
      detail: 'Simulating driving duration and turn-by-turn distance across Melbourne medical corridors...',
      icon: Navigation,
      color: '#3b82f6',
    },
    {
      id: 4,
      name: 'Clinical Availability & Wait Time',
      tech: 'TypeScript MCP Server (Model Context Protocol)',
      detail: 'Querying synthetic live ER rosters, bed occupancy, and acute specialist availability...',
      icon: Hospital,
      color: '#10b981',
    },
    {
      id: 5,
      name: 'Multi-Provider Decision Synthesis',
      tech: 'LiteLLM Proxy (OpenAI / Anthropic / Gemini)',
      detail: 'Weighting travel time against ED wait times to generate optimal care recommendation...',
      icon: Sparkles,
      color: '#f59e0b',
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const intervals = [500, 600, 600, 500, 700];
    let stepIndex = 0;

    const timer = setInterval(() => {
      stepIndex += 1;
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);
      } else {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, intervals[stepIndex] || 600);

    return () => clearInterval(timer);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="agentic-modal-card">
        <div className="agentic-modal-header">
          <div className="pulse-indicator-circle">
            <span className="pulse-ring"></span>
            <span className="pulse-dot"></span>
          </div>
          <div>
            <h3 className="agentic-modal-title">Agentic Orchestrator Dispatch</h3>
            <p className="agentic-modal-sub">
              Executing parallel tool calling across geographic routing and TypeScript MCP clinical APIs
            </p>
          </div>
        </div>

        <div className="agentic-steps-list">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div 
                key={step.id} 
                className={`agentic-step-row ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
              >
                <div 
                  className="step-icon-bubble"
                  style={{ 
                    backgroundColor: isCurrent ? `${step.color}25` : isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    borderColor: isCurrent ? step.color : isCompleted ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                    color: isCurrent ? step.color : isCompleted ? '#10b981' : '#64748b'
                  }}
                >
                  <Icon size={18} />
                </div>

                <div className="step-info">
                  <div className="step-top-line">
                    <span className="step-name">{step.name}</span>
                    <span className="step-tech-tag">{step.tech}</span>
                  </div>
                  <div className="step-detail-line">
                    {step.detail}
                  </div>
                </div>

                <div className="step-status">
                  {isCompleted && <CheckCircle2 size={18} className="text-emerald" />}
                  {isCurrent && <Loader2 size={18} className="spin-icon text-cyan" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
