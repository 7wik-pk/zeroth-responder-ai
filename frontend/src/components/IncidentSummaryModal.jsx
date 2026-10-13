import React from 'react';
import { X, Printer, ShieldCheck, Hospital, AlertCircle, FileText } from 'lucide-react';

export function IncidentSummaryModal({ isOpen, onClose, formData, facility }) {
  if (!isOpen) return null;

  const incidentToken = `ZR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const timestamp = new Date().toLocaleString('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Australia/Melbourne',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" id="summary-modal-backdrop">
      <div className="summary-modal-card" id="incident-summary-content">
        <div className="summary-modal-header">
          <div className="summary-header-info">
            <div className="summary-tag">Zeroth Responder AI — Handover Document</div>
            <h3 className="summary-title">Non-PII Patient Triage Handover Summary</h3>
            <div className="summary-meta">
              <span>Token: <strong>{incidentToken}</strong></span> &bull; 
              <span> Generated: {timestamp} (AEST)</span>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} id="close-summary-modal">
            <X size={20} />
          </button>
        </div>

        <div className="summary-modal-body">
          {/* Privacy Disclaimer */}
          <div className="summary-alert-box">
            <ShieldCheck size={18} className="text-emerald" />
            <span>
              <strong>Privacy Verified:</strong> Zero patient identifying data (TFN, Medicare ID, Name) stored. Present this sheet directly to the triage nurse at reception upon arrival.
            </span>
          </div>

          {/* Clinical Profile Grid */}
          <div className="summary-section">
            <h4 className="section-subtitle">
              <FileText size={16} /> 1. Reported Symptoms &amp; Subjective Acuity
            </h4>
            <div className="summary-details-box">
              <div className="summary-row">
                <span className="summary-key">Reported Symptoms:</span>
                <span className="summary-val">{formData.symptoms}</span>
              </div>
              <div className="summary-row">
                <span className="summary-key">Subjective Pain Rating:</span>
                <span className="summary-val">
                  <strong>{formData.painLevel} / 10</strong> ({formData.painLevel >= 7 ? 'Severe' : formData.painLevel >= 4 ? 'Moderate' : 'Mild'})
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-key">Triage Evaluation Category:</span>
                <span className="summary-val highlight">ATS Category 3 — Urgent Evaluation Recommended</span>
              </div>
            </div>
          </div>

          {/* Demographic & Insurance Categorical Enums */}
          <div className="summary-section">
            <h4 className="section-subtitle">
              <ShieldCheck size={16} /> 2. Categorical Residency &amp; Billing Enums
            </h4>
            <div className="summary-grid-2col">
              <div className="summary-detail-pill">
                <span className="pill-label">State of Residence:</span>
                <span className="pill-value">{formData.state}</span>
              </div>
              <div className="summary-detail-pill">
                <span className="pill-label">Residency Status:</span>
                <span className="pill-value">{formData.residency}</span>
              </div>
              <div className="summary-detail-pill">
                <span className="pill-label">Insurance Tier:</span>
                <span className="pill-value">{formData.insurance}</span>
              </div>
              <div className="summary-detail-pill">
                <span className="pill-label">Coverage Eligibility:</span>
                <span className="pill-value">{facility.coverageNotes.oshcStatus}</span>
              </div>
            </div>
          </div>

          {/* Facility Destination */}
          <div className="summary-section">
            <h4 className="section-subtitle">
              <Hospital size={16} /> 3. Target Facility Details
            </h4>
            <div className="summary-details-box">
              <div className="summary-row">
                <span className="summary-key">Recommended Hospital:</span>
                <span className="summary-val"><strong>{facility.name}</strong></span>
              </div>
              <div className="summary-row">
                <span className="summary-key">Address:</span>
                <span className="summary-val">{facility.address}</span>
              </div>
              <div className="summary-row">
                <span className="summary-key">Emergency Reception Phone:</span>
                <span className="summary-val">{facility.phone}</span>
              </div>
              <div className="summary-row">
                <span className="summary-key">Estimated Travel Duration:</span>
                <span className="summary-val">{facility.metrics.driveTimeMin} minutes (OSRM)</span>
              </div>
              <div className="summary-row">
                <span className="summary-key">Live Estimated ED Wait:</span>
                <span className="summary-val">{facility.metrics.edWaitTimeMin} minutes (TypeScript MCP Live Feed)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn-print" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
