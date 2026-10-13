import React from 'react';
import { AlertTriangle, ShieldCheck, Cpu, RefreshCw, PhoneCall } from 'lucide-react';

export function Header({ onReset, isAnalyzing }) {
  return (
    <header className="site-header" id="header-nav">
      {/* Critical Emergency 000 Banner */}
      <div className="emergency-banner" id="emergency-banner-000">
        <div className="emergency-banner-content">
          <span className="danger-beacon-dot"></span>
          <AlertTriangle className="icon-alert" size={18} />
          <strong>EMERGENCY WARNING:</strong> If you or the patient is unconscious, experiencing chest crushing pain, severe breathing difficulty, or uncontrolled bleeding, immediately call{' '}
          <a href="tel:000" className="call-000-link" id="call-000-button">
            <PhoneCall size={14} /> 000 (Triple Zero)
          </a>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="nav-bar">
        <div className="nav-brand">
          <div className="brand-logo pulse-beacon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V22M2 12H22" stroke="#10b981" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-title">
              Zeroth Responder <span className="ai-badge">AI</span>
            </div>
            <div className="brand-subtitle">Intelligent Australian Healthcare Triage &amp; Routing</div>
          </div>
        </div>

        <div className="nav-meta">
          <div className="meta-badge model-badge" title="Multi-provider LLM gateway connected">
            <Cpu size={14} className="badge-icon-cyan" />
            <span>LiteLLM Gateway Active</span>
          </div>
          <div className="meta-badge privacy-badge" title="No PII or national ID stored">
            <ShieldCheck size={14} className="badge-icon-emerald" />
            <span>Ephemeral Guest Session</span>
          </div>
          <button 
            type="button" 
            className="btn-reset" 
            onClick={onReset} 
            disabled={isAnalyzing}
            id="reset-triage-button"
            title="Start a new triage session"
          >
            <RefreshCw size={15} />
            <span>New Triage</span>
          </button>
        </div>
      </div>
    </header>
  );
}
