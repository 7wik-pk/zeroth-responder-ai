import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Clock, Shield, Hospital } from 'lucide-react';

// Custom Map Controller to smoothly re-center or fit bounds when facility changes
function MapViewUpdater({ center, routeCoordinates }) {
  const map = useMap();

  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      const bounds = L.latLngBounds(routeCoordinates);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    } else if (center) {
      map.setView(center, 13, { animate: true });
    }
  }, [center, routeCoordinates, map]);

  return null;
}

export function MapView({ 
  userLocation, 
  facilities, 
  selectedFacility, 
  onSelectFacility 
}) {
  const defaultCenter = [userLocation.lat, userLocation.lng];

  // Custom marker for Patient Location
  const patientIcon = L.divIcon({
    className: 'custom-patient-icon',
    html: `<div class="patient-marker-pin" title="Your Location (${userLocation.address})"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  // Custom marker generator for Hospitals
  const createHospitalIcon = (facility, isSelected) => {
    const isOptimal = facility.isOptimal;
    return L.divIcon({
      className: 'custom-hospital-icon',
      html: `
        <div class="hospital-marker-pin ${isOptimal ? 'optimal' : ''} ${isSelected ? 'selected' : ''}" style="${isSelected ? 'transform: scale(1.2); box-shadow: 0 0 20px #06b6d4;' : ''}">
          <span>✚</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  return (
    <div className="map-view-container" id="map-interactive-container">
      <div className="map-overlay-badge">
        <span className="dot-live"></span>
        <span>OSRM Live Transit &amp; CartoDB Dark Matter</span>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="leaflet-map-element"
      >
        {/* CartoDB Dark Matter Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
          subdomains="abcd"
        />

        {/* View bounds auto-adjuster */}
        <MapViewUpdater 
          center={defaultCenter} 
          routeCoordinates={selectedFacility ? selectedFacility.routeCoordinates : null} 
        />

        {/* Patient Location Marker */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={patientIcon}>
          <Popup>
            <div className="map-popup-card">
              <strong style={{ color: '#06b6d4' }}>Your Current Location</strong>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#cbd5e1' }}>
                {userLocation.address}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Hospital Markers */}
        {facilities.map((fac) => {
          const isSelected = selectedFacility && selectedFacility.id === fac.id;
          return (
            <Marker
              key={fac.id}
              position={fac.coords}
              icon={createHospitalIcon(fac, isSelected)}
              eventHandlers={{
                click: () => onSelectFacility(fac),
              }}
            >
              <Popup>
                <div className="map-popup-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Hospital size={16} color={fac.isOptimal ? '#10b981' : '#f8fafc'} />
                    <strong style={{ color: fac.isOptimal ? '#34d399' : '#f8fafc' }}>
                      {fac.name}
                    </strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
                    <div>🚗 Drive: <strong>{fac.metrics.driveTimeMin} mins</strong> ({fac.metrics.driveDistanceKm} km)</div>
                    <div>🏥 ED Wait: <strong>{fac.metrics.edWaitTimeMin} mins</strong> (MCP)</div>
                    <div style={{ color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
                      ⏱ Total to Doctor: ~{fac.metrics.totalEtaToDoctorMin} mins
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Active Route Polyline from patient to selected hospital */}
        {selectedFacility && selectedFacility.routeCoordinates && (
          <>
            {/* Glow backing */}
            <Polyline
              positions={selectedFacility.routeCoordinates}
              pathOptions={{
                color: selectedFacility.isOptimal ? '#10b981' : '#06b6d4',
                weight: 8,
                opacity: 0.35,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
            {/* Crisp foreground line */}
            <Polyline
              positions={selectedFacility.routeCoordinates}
              pathOptions={{
                color: selectedFacility.isOptimal ? '#34d399' : '#22d3ee',
                weight: 4,
                opacity: 0.95,
                dashArray: '8, 8',
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}
