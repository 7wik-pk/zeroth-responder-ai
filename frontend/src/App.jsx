import React, { useState } from 'react';
import { Header } from './components/Header';
import { TriageForm } from './components/TriageForm';
import { ResultsView } from './components/ResultsView';
import { AgenticThinkingModal } from './components/AgenticThinkingModal';
import { IncidentSummaryModal } from './components/IncidentSummaryModal';
import { 
  MOCK_FACILITIES, 
  DEFAULT_USER_LOCATION, 
  SYMPTOM_PRESETS 
} from './data/mockData';
import './App.css';

export default function App() {
  const [step, setStep] = useState('form'); // 'form' | 'results'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isThinkingModalOpen, setIsThinkingModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    symptoms: SYMPTOM_PRESETS[0].symptoms,
    painLevel: SYMPTOM_PRESETS[0].painLevel,
    lat: DEFAULT_USER_LOCATION.lat,
    lng: DEFAULT_USER_LOCATION.lng,
    locationAddress: DEFAULT_USER_LOCATION.address,
    state: SYMPTOM_PRESETS[0].state,
    residency: SYMPTOM_PRESETS[0].residency,
    insurance: SYMPTOM_PRESETS[0].insurance,
    presetId: SYMPTOM_PRESETS[0].id,
  });

  const [facilities, setFacilities] = useState(MOCK_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState(MOCK_FACILITIES[0]);

  // Handle preset scenario selection
  const handleSelectPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: preset.symptoms,
      painLevel: preset.painLevel,
      state: preset.state,
      residency: preset.residency,
      insurance: preset.insurance,
      presetId: preset.id,
    }));
  };

  // Trigger parallel agentic triage dispatch
  const handleSubmitTriage = (e) => {
    e.preventDefault();
    if (!formData.symptoms.trim()) return;

    setIsAnalyzing(true);
    setIsThinkingModalOpen(true);
  };

  // Called when simulated parallel agentic tools finish
  const handleAnalysisComplete = () => {
    setIsThinkingModalOpen(false);
    setIsAnalyzing(false);
    setStep('results');
    setSelectedFacility(facilities.find(f => f.isOptimal) || facilities[0]);
  };

  // Reset triage
  const handleReset = () => {
    setStep('form');
    setFormData({
      symptoms: '',
      painLevel: 5,
      lat: DEFAULT_USER_LOCATION.lat,
      lng: DEFAULT_USER_LOCATION.lng,
      locationAddress: DEFAULT_USER_LOCATION.address,
      state: 'VIC',
      residency: 'Citizen',
      insurance: 'Medicare',
      presetId: null,
    });
  };

  return (
    <div className="app-layout">
      {/* Universal Header with 000 Safety Alert */}
      <Header onReset={handleReset} isAnalyzing={isAnalyzing} />

      {/* Main Content Area */}
      <main className="main-content" id="main-content-area">
        {step === 'form' ? (
          <TriageForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmitTriage}
            isAnalyzing={isAnalyzing}
            onSelectPreset={handleSelectPreset}
          />
        ) : (
          <ResultsView
            formData={formData}
            facilities={facilities}
            selectedFacility={selectedFacility}
            onSelectFacility={setSelectedFacility}
            onBack={() => setStep('form')}
            onOpenSummaryModal={() => setIsSummaryModalOpen(true)}
          />
        )}
      </main>

      {/* Agentic Orchestrator Thinking Modal */}
      <AgenticThinkingModal
        isOpen={isThinkingModalOpen}
        onComplete={handleAnalysisComplete}
      />

      {/* Printable / Non-PII Incident Handover Summary */}
      <IncidentSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        formData={formData}
        facility={selectedFacility}
      />

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <span>Zeroth Responder AI &bull; Architectural Proof-of-Concept</span>
          <span className="footer-divider">&bull;</span>
          <span>Powered by LiteLLM &bull; fastembed-go &bull; Qdrant &bull; TypeScript MCP &bull; CartoDB</span>
        </div>
      </footer>
    </div>
  );
}
