// TablaHstorial.jsx — Rediseñado con estilos premium
import { useState, useEffect } from 'react';
import axios from 'axios';

export const TablaHistorial = ({ usuarioId }) => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => { cargarHistorial(); }, [usuarioId]);

  const cargarHistorial = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/ubicaciones?usuarioId=${usuarioId}`);
      setUbicaciones(res.data);
    } catch {
      setMensaje('Error al cargar historial');
    } finally {
      setCargando(false);
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta ubicación?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/ubicaciones/${id}?usuarioId=${usuarioId}`);
      cargarHistorial();
      setMensaje('Ubicación eliminada');
      setTimeout(() => setMensaje(''), 3000);
    } catch {
      setMensaje('Error al eliminar');
    }
  };

  if (cargando) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Cargando historial...</p>
    </div>
  );

  return (
    <div>
      {mensaje && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>✅ {mensaje}</div>
      )}

      {ubicaciones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📍</div>
          <p>No hay ubicaciones guardadas aún</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Latitud</th>
                <th>Longitud</th>
                <th>Lugar</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {ubicaciones.map(u => (
                <tr key={u._id}>
                  <td>{new Date(u.fecha).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{u.lat?.toFixed(5)}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{u.lng?.toFixed(5)}</td>
                  <td>{u.lugar || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                  <td>
                    <button className="btn-delete" onClick={() => eliminar(u._id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};