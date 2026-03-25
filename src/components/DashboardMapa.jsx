// DashboardMapa.jsx — Rediseñado
import { useState, useEffect } from 'react';
import { MapaTiempoReal } from './MapaTiempoReal';
import axios from 'axios';

export const DashboardMapa = ({ user }) => {
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por tu navegador');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError('No se pudo obtener ubicación: ' + err.message);
        setLoading(false);
      }
    );
  }, []);

  const guardarUbicacion = async () => {
    if (!coords.lat) return;
    setGuardando(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/ubicaciones`, {
        usuarioId: user.uid || user.id,
        usuarioNombre: user.displayName || user.email,
        usuarioEmail: user.email,
        lat: coords.lat,
        lng: coords.lng,
      });
      setMensaje({ texto: '¡Ubicación guardada en el historial!', tipo: 'exito' });
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
    } catch (err) {
      setMensaje({ texto: 'Error al guardar: ' + err.message, tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Obteniendo ubicación...</p>
    </div>
  );

  if (error) return (
    <div className="alert alert-error">❌ {error}</div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <MapaTiempoReal lat={coords.lat} lng={coords.lng} vuelo={null} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', padding: '0.875rem 1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Coordenadas actuales</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {coords.lat?.toFixed(6)}, {coords.lng?.toFixed(6)}
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={guardarUbicacion}
          disabled={guardando}
          style={{ width: 'auto', padding: '0.6rem 1.25rem' }}
        >
          {guardando ? '⏳ Guardando...' : '📍 Guardar en historial'}
        </button>
      </div>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo === 'exito' ? 'success' : 'error'}`}>
          {mensaje.tipo === 'exito' ? '✅' : '❌'} {mensaje.texto}
        </div>
      )}
    </div>
  );
};