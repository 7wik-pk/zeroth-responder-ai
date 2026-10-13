import React from 'react';
import { 
  Activity, 
  MapPin, 
  ShieldCheck, 
  Sliders, 
  FileText, 
  Sparkles, 
  Info,
  Clock
} from 'lucide-react';
import { 
  AUSTRALIAN_STATES, 
  RESIDENCY_STATUSES, 
  INSURANCE_TIERS, 
  SYMPTOM_PRESETS 
} from '../data/mockData';

export function TriageForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  isAnalyzing, 
  onSelectPreset 
}) {
  const selectedStateObj = AUSTRALIAN_STATES.find(s => s.value === formData.state) || AUSTRALIAN_STATES[0];
  const selectedResidencyObj = RESIDENCY_STATUSES.find(r => r.value === formData.residency) || RESIDENCY_STATUSES[0];

  const getPainColor = (val) => {
    if (val <= 3) return '#10b981';
    if (val <= 6) return '#f59e0b';
    return '#f43f5e';
  };

  const getPainLabel = (val) => {
    if (val <= 2) return 'Mild Discomfort';
    if (val <= 4) return 'Moderate Pain';
    if (val <= 6) return 'Distressing / Severe';
    if (val <= 8) return 'Intense / Very Severe';
    return 'Excruciating / Maximum';
  };

  return (
    <div className="triage-form-container">
      {/* Quick Scenario Preset Chips */}
      <div className="presets-bar">
        <div className="presets-label">
          <Sparkles size={14} className="icon-sparkle" />
          <span>Quick Scenario Presets:</span>
        </div>
        <div className="presets-chips">
          {SYMPTOM_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`preset-chip ${formData.presetId === preset.id ? 'active' : ''}`}
              onClick={() => onSelectPreset(preset)}
              id={`preset-${preset.id}`}
            >
              {preset.title.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="triage-grid" id="triage-intake-form">
        {/* Left Column: Symptoms, Pain & Location */}
        <div className="form-card left-card">
          <div className="card-header">
            <Activity className="header-icon cyan" size={20} />
            <div>
              <h2 className="card-title">1. Patient Symptoms &amp; Location</h2>
              <p className="card-desc">Describe clinical observations and current urgency</p>
            </div>
          </div>

          {/* Symptom Input */}
          <div className="form-group">
            <label htmlFor="symptoms-input" className="form-label">
              <span>Symptom Narrative</span>
              <span className="required-tag">Required</span>
            </label>
            <textarea
              id="symptoms-input"
              rows={4}
              className="form-textarea"
              placeholder="e.g., Progressive sharp pain in lower right abdomen for 6 hours, feeling nauseous and slight chills. Worse with walking..."
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              required
            />
            <div className="form-hint">
              Be as specific as possible regarding onset duration, pain type, and mobility.
            </div>
          </div>

          {/* Pain Scale Slider */}
          <div className="form-group">
            <div className="pain-label-row">
              <label htmlFor="pain-slider" className="form-label">
                <Sliders size={16} /> Pain Scale (1–10)
              </label>
              <span 
                className="pain-badge"
                style={{ 
                  backgroundColor: `${getPainColor(formData.painLevel)}20`,
                  color: getPainColor(formData.painLevel),
                  borderColor: `${getPainColor(formData.painLevel)}40`
                }}
              >
                Level {formData.painLevel} — {getPainLabel(formData.painLevel)}
              </span>
            </div>
            <div className="pain-slider-wrapper">
              <input
                type="range"
                id="pain-slider"
                min="1"
                max="10"
                step="1"
                className="pain-range-input"
                value={formData.painLevel}
                onChange={(e) => setFormData({ ...formData, painLevel: parseInt(e.target.value, 10) })}
              />
              <div className="pain-ticks">
                <span>1 (Mild)</span>
                <span>5 (Moderate)</span>
                <span>10 (Worst)</span>
              </div>
            </div>
          </div>

          {/* Location Anchor */}
          <div className="form-group">
            <label className="form-label">
              <MapPin size={16} /> Current Patient Location (For Drive Time)
            </label>
            <div className="location-box">
              <div className="location-pin-icon">
                <MapPin size={18} />
              </div>
              <div className="location-details">
                <div className="location-name">{formData.locationAddress}</div>
                <div className="location-coords">
                  Lat: {formData.lat.toFixed(4)}, Long: {formData.lng.toFixed(4)} (Auto-detected via GPS)
                </div>
              </div>
              <span className="location-live-tag">OSRM Geocoded</span>
            </div>
          </div>
        </div>

        {/* Right Column: Australian Healthcare & Coverage Categorical Enums */}
        <div className="form-card right-card">
          <div className="card-header">
            <FileText className="header-icon emerald" size={20} />
            <div>
              <h2 className="card-title">2. Australian Healthcare &amp; Residency</h2>
              <p className="card-desc">Categorical parameters for facility billing &amp; eligibility</p>
            </div>
          </div>

          {/* State of Residence */}
          <div className="form-group">
            <label htmlFor="state-select" className="form-label">
              State of Residence (Ambulance Policy Routing)
            </label>
            <select
              id="state-select"
              className="form-select"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            >
              {AUSTRALIAN_STATES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
            <div className="state-note-banner">
              <Info size={14} />
              <span>{selectedStateObj.ambulanceNote}</span>
            </div>
          </div>

          {/* Residency Status */}
          <div className="form-group">
            <label htmlFor="residency-select" className="form-label">
              Residency / Visa Status
            </label>
            <select
              id="residency-select"
              className="form-select"
              value={formData.residency}
              onChange={(e) => setFormData({ ...formData, residency: e.target.value })}
            >
              {RESIDENCY_STATUSES.map((res) => (
                <option key={res.value} value={res.value}>
                  {res.label}
                </option>
              ))}
            </select>
            <div className="residency-hint">
              {selectedResidencyObj.description}
            </div>
          </div>

          {/* Insurance Tier */}
          <div className="form-group">
            <label htmlFor="insurance-select" className="form-label">
              Insurance Tier
            </label>
            <select
              id="insurance-select"
              className="form-select"
              value={formData.insurance}
              onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
            >
              {INSURANCE_TIERS.map((ins) => (
                <option key={ins.value} value={ins.value}>
                  {ins.label}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy Trust Badge */}
          <div className="privacy-trust-card">
            <ShieldCheck size={22} className="privacy-icon" />
            <div>
              <div className="privacy-title">Privacy-By-Design Architecture</div>
              <div className="privacy-desc">
                This system intentionally rejects Medicare numbers, Tax File Numbers (TFN), and national IDs. Routing is resolved via categorical enums to guarantee zero patient data persistence.
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="btn-submit"
            disabled={isAnalyzing || !formData.symptoms.trim()}
            id="triage-submit-button"
          >
            {isAnalyzing ? (
              <>
                <Clock className="spin-icon" size={18} />
                <span>Orchestrating Parallel Triage...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Analyze &amp; Find Optimal Care Facility</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
