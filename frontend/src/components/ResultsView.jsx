import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Navigation, 
  Phone, 
  FileDown, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { MapView } from './MapView';

export function ResultsView({ 
  formData, 
  facilities, 
  selectedFacility, 
  onSelectFacility, 
  onBack, 
  onOpenSummaryModal 
}) {
  const optimalFacility = facilities.find(f => f.isOptimal) || facilities[0];

  return (
    <div className="results-container" id="triage-results-view">
      {/* Top Triage Acuity Assessment Banner */}
      <div className="acuity-banner">
        <div className="acuity-badge">
          <span className="acuity-pulse-dot"></span>
          <span>ATS Category 3 — Urgent Evaluation Recommended</span>
        </div>
        <div className="acuity-summary">
          <strong>Decision Synthesis:</strong> Patient symptoms indicate moderate acuity requiring urgent physical examination. Evaluated 4 nearby emergency and urgent care facilities via <strong>OSRM drive times</strong> and <strong>TypeScript MCP</strong> live wait times.
        </div>
      </div>

      <div className="results-layout-grid">
        {/* Left Column: Ranked Facilities List */}
        <div className="facilities-column">
          <div className="section-title-row">
            <h2 className="section-heading">Ranked Facility Recommendations</h2>
            <button type="button" className="btn-back-text" onClick={onBack}>
              <ArrowLeft size={14} /> Edit Symptoms
            </button>
          </div>

          <div className="facilities-list">
            {facilities.map((fac, idx) => {
              const isSelected = selectedFacility && selectedFacility.id === fac.id;
              const isOptimal = fac.isOptimal;

              return (
                <div 
                  key={fac.id}
                  id={`facility-card-${fac.id}`}
                  className={`facility-card ${isOptimal ? 'optimal' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectFacility(fac)}
                >
                  {/* Card Header & Badges */}
                  <div className="card-top-bar">
                    <div className="rank-title-group">
                      <span className={`rank-number ${isOptimal ? 'optimal-rank' : ''}`}>
                        #{idx + 1}
                      </span>
                      <div>
                        <h3 className="facility-name">{fac.name}</h3>
                        <div className="facility-type">{fac.type}</div>
                      </div>
                    </div>

                    <div className="badges-group">
                      {fac.badges.map((b, i) => (
                        <span key={i} className={`badge-pill ${i === 0 && isOptimal ? 'badge-primary' : 'badge-subtle'}`}>
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="metrics-box">
                    <div className="metric-item">
                      <div className="metric-label">
                        <Navigation size={13} className="text-cyan" />
                        <span>Drive Time (OSRM)</span>
                      </div>
                      <div className="metric-val">{fac.metrics.driveTimeMin} mins</div>
                      <div className="metric-sub">{fac.metrics.driveDistanceKm} km distance</div>
                    </div>

                    <div className="metric-item">
                      <div className="metric-label">
                        <Clock size={13} className="text-amber" />
                        <span>Live ED Wait (MCP)</span>
                      </div>
                      <div className="metric-val">{fac.metrics.edWaitTimeMin} mins</div>
                      <div className="metric-sub">{fac.metrics.capacityStatus}</div>
                    </div>

                    <div className="metric-item highlight-metric">
                      <div className="metric-label">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>Total to Doctor</span>
                      </div>
                      <div className="metric-val text-emerald">
                        ~{fac.metrics.totalEtaToDoctorMin} mins
                      </div>
                      <div className="metric-sub">Fastest overall intake</div>
                    </div>
                  </div>

                  {/* Australian Policy & Coverage Rationale */}
                  <div className="coverage-rationale-box">
                    <div className="rationale-row">
                      <ShieldCheck size={15} className="text-emerald" />
                      <span><strong>Coverage:</strong> {fac.coverageNotes.oshcStatus}</span>
                    </div>
                    <div className="rationale-row">
                      <DollarSign size={15} className="text-cyan" />
                      <span><strong>Estimated Out-of-Pocket:</strong> {fac.coverageNotes.estOutOfPocket}</span>
                    </div>
                    {fac.coverageNotes.ambulanceNote && (
                      <div className="rationale-row text-muted">
                        <AlertCircle size={15} />
                        <span><strong>State Transport:</strong> {fac.coverageNotes.ambulanceNote}</span>
                      </div>
                    )}
                  </div>

                  {/* On-Call Specialists */}
                  <div className="specialists-row">
                    <span className="spec-label">On-Duty Coverage:</span>
                    <div className="spec-tags">
                      {fac.metrics.onCallSpecialists.map((spec, sIdx) => (
                        <span key={sIdx} className="spec-tag">{spec}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons Bar */}
          <div className="results-actions-bar">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.coords[0]},${selectedFacility.coords[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn btn-nav"
              id="start-navigation-button"
            >
              <ExternalLink size={16} />
              <span>Start Turn-by-Turn Navigation</span>
            </a>

            <a
              href={`tel:${selectedFacility.phone}`}
              className="action-btn btn-phone"
              id="call-facility-button"
            >
              <Phone size={16} />
              <span>Call ED Reception</span>
            </a>

            <button
              type="button"
              className="action-btn btn-summary"
              onClick={onOpenSummaryModal}
              id="export-summary-button"
            >
              <FileDown size={16} />
              <span>Export Triage Summary</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Map & Live Corridor */}
        <div className="map-column">
          <div className="map-wrapper-card">
            <div className="map-card-header">
              <div className="map-header-left">
                <Navigation size={18} className="text-cyan" />
                <div>
                  <h3 className="map-title">Real-Time Routing &amp; Transit Corridor</h3>
                  <p className="map-desc">
                    Active destination: <strong className="text-emerald">{selectedFacility.name}</strong>
                  </p>
                </div>
              </div>
              <div className="eta-badge">
                <span>ETA: {selectedFacility.metrics.driveTimeMin} min drive</span>
              </div>
            </div>

            {/* Leaflet Map with CartoDB Dark Matter */}
            <MapView
              userLocation={{
                lat: formData.lat,
                lng: formData.lng,
                address: formData.locationAddress,
              }}
              facilities={facilities}
              selectedFacility={selectedFacility}
              onSelectFacility={onSelectFacility}
            />

            <div className="map-card-footer">
              <div className="footer-metric">
                <span className="dot-pulse-green"></span>
                <span>Destination Status: {selectedFacility.metrics.capacityStatus}</span>
              </div>
              <div className="footer-metric">
                <span>Address: {selectedFacility.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
