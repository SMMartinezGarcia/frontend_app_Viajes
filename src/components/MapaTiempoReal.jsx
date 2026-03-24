// MapaTiempoReal.jsx — Leaflet con ruta de vuelo animada
import { useEffect, useRef } from 'react';

// Coordenadas de aeropuertos conocidos
const AIRPORT_COORDS = {
  'CDMX': { lat: 19.4363, lng: -99.0721, nombre: 'Ciudad de México' },
  'MEX':  { lat: 19.4363, lng: -99.0721, nombre: 'Ciudad de México' },
  'CUN':  { lat: 21.0365, lng: -86.8771, nombre: 'Cancún' },
  'GDL':  { lat: 20.5218, lng: -103.311, nombre: 'Guadalajara' },
  'MTY':  { lat: 25.7785, lng: -100.107, nombre: 'Monterrey' },
  'TIJ':  { lat: 32.5411, lng: -116.970, nombre: 'Tijuana' },
  'MID':  { lat: 20.9370, lng: -89.6577, nombre: 'Mérida' },
  'VER':  { lat: 19.1459, lng: -96.1873, nombre: 'Veracruz' },
  'OAX':  { lat: 17.0000, lng: -96.7266, nombre: 'Oaxaca' },
  'PVR':  { lat: 20.6800, lng: -105.254, nombre: 'Puerto Vallarta' },
};

function getAirportCoords(code) {
  if (!code) return null;
  const upper = code.toUpperCase().trim();
  return AIRPORT_COORDS[upper] || null;
}

// Genera puntos intermedios curvos para simular ruta de vuelo (arco bezier)
function generateFlightArc(lat1, lng1, lat2, lng2, steps = 60) {
  const points = [];
  // Punto de control para la curva (elevado hacia el norte/ecuador)
  const midLat = (lat1 + lat2) / 2 + Math.abs(lat2 - lat1) * 0.4;
  const midLng = (lng1 + lng2) / 2;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Curva cuadrática de Bézier
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * midLat + t * t * lat2;
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * midLng + t * t * lng2;
    points.push([lat, lng]);
  }
  return points;
}

export const MapaTiempoReal = ({ lat, lng, vuelo }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    // Cargar Leaflet dinámicamente
    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
      updateMapLayers();
    }
  }, [lat, lng, vuelo]);

  const initMap = () => {
    if (!mapRef.current || mapInstance.current) return;
    const L = window.L;

    const centerLat = lat || 19.4;
    const centerLng = lng || -99.1;

    const map = L.map(mapRef.current, {
      center: [centerLat, centerLng],
      zoom: lat && vuelo ? 5 : 12,
      zoomControl: true,
    });

    // Tile oscuro (CartoDB Dark)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;
    updateMapLayers();
  };

  const updateMapLayers = () => {
    const L = window.L;
    if (!L || !mapInstance.current) return;

    // Limpiar capas anteriores
    layersRef.current.forEach(l => mapInstance.current.removeLayer(l));
    layersRef.current = [];

    const map = mapInstance.current;

    // Marcador de posición actual del usuario
    if (lat && lng) {
      const userIcon = L.divIcon({
        html: `<div style="
          width:16px; height:16px;
          background:#3b82f6;
          border:3px solid white;
          border-radius:50%;
          box-shadow:0 0 0 4px rgba(59,130,246,0.3), 0 0 20px rgba(59,130,246,0.5);
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        className: '',
      });
      const userMarker = L.marker([lat, lng], { icon: userIcon })
        .bindPopup('<b>Tu ubicación actual</b>')
        .addTo(map);
      layersRef.current.push(userMarker);
    }

    // Ruta del vuelo seleccionado
    if (vuelo) {
      const origen = getAirportCoords(vuelo.origen);
      const destino = getAirportCoords(vuelo.destino);

      if (origen && destino) {
        // Marcador origen
        const origenIcon = L.divIcon({
          html: `<div style="
            background:#10b981; color:white;
            padding:4px 8px; border-radius:6px;
            font-size:11px; font-weight:700;
            font-family:'Syne',sans-serif;
            white-space:nowrap;
            box-shadow:0 4px 12px rgba(16,185,129,0.4);
            border:1px solid rgba(255,255,255,0.2);
          ">${vuelo.origen}</div>`,
          iconSize: [50, 26],
          iconAnchor: [25, 13],
          className: '',
        });

        // Marcador destino
        const destinoIcon = L.divIcon({
          html: `<div style="
            background:#ef4444; color:white;
            padding:4px 8px; border-radius:6px;
            font-size:11px; font-weight:700;
            font-family:'Syne',sans-serif;
            white-space:nowrap;
            box-shadow:0 4px 12px rgba(239,68,68,0.4);
            border:1px solid rgba(255,255,255,0.2);
          ">${vuelo.destino}</div>`,
          iconSize: [50, 26],
          iconAnchor: [25, 13],
          className: '',
        });

        const mOrigen = L.marker([origen.lat, origen.lng], { icon: origenIcon })
          .bindPopup(`<b>${origen.nombre}</b><br>Aeropuerto de salida`)
          .addTo(map);

        const mDestino = L.marker([destino.lat, destino.lng], { icon: destinoIcon })
          .bindPopup(`<b>${destino.nombre}</b><br>Aeropuerto de llegada`)
          .addTo(map);

        layersRef.current.push(mOrigen, mDestino);

        // Línea punteada de fondo (sombra de ruta)
        const arcPoints = generateFlightArc(origen.lat, origen.lng, destino.lat, destino.lng);

        const shadowLine = L.polyline(arcPoints, {
          color: 'rgba(255,255,255,0.06)',
          weight: 6,
          dashArray: null,
        }).addTo(map);

        // Ruta principal con arco bezier
        const flightLine = L.polyline(arcPoints, {
          color: '#3b82f6',
          weight: 2.5,
          opacity: 0.9,
          dashArray: '8, 6',
          lineCap: 'round',
        }).addTo(map);

        layersRef.current.push(shadowLine, flightLine);

        // Ícono de avión animado en el punto medio de la ruta
        const midIndex = Math.floor(arcPoints.length / 2);
        const midPoint = arcPoints[midIndex];
        const prevPoint = arcPoints[midIndex - 1];
        
        // Calcular ángulo del avión
        const angle = Math.atan2(
          midPoint[0] - prevPoint[0],
          midPoint[1] - prevPoint[1]
        ) * (180 / Math.PI);

        const planeIcon = L.divIcon({
          html: `<div style="
            transform: rotate(${angle + 45}deg);
            font-size: 22px;
            filter: drop-shadow(0 0 8px rgba(59,130,246,0.8));
            line-height:1;
          ">✈️</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          className: '',
        });

        const planeMarker = L.marker(midPoint, { icon: planeIcon })
          .bindPopup(`<b>${vuelo.aerolinea} ${vuelo.numeroVuelo}</b><br>${vuelo.origen} → ${vuelo.destino}`)
          .addTo(map);

        layersRef.current.push(planeMarker);

        // Ajustar el mapa para mostrar toda la ruta
        const bounds = L.latLngBounds([
          [origen.lat, origen.lng],
          [destino.lat, destino.lng],
        ]);
        map.fitBounds(bounds, { padding: [60, 60] });
      }
    } else if (lat && lng) {
      // Sin vuelo seleccionado, centrar en usuario
      map.setView([lat, lng], 13);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {vuelo && (
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 1000,
          background: 'rgba(8,12,20,0.9)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: '10px', padding: '10px 14px',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Ruta del vuelo
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'white' }}>
            {vuelo.origen} <span style={{ color: '#3b82f6' }}>→</span> {vuelo.destino}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {vuelo.aerolinea} · {vuelo.numeroVuelo}
          </div>
        </div>
      )}

      {!vuelo && (
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 1000,
          background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(10px)',
          border: '1px solid var(--border)',
          borderRadius: '10px', padding: '10px 14px',
          fontSize: '0.78rem', color: 'var(--text-muted)',
        }}>
          📍 Tu ubicación actual
        </div>
      )}

      <div
        ref={mapRef}
        className="map-container"
        style={{ height: '420px' }}
      />
    </div>
  );
};