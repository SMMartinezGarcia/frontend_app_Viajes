// MisReservas.jsx — Historial de reservas del usuario
import { useState, useEffect } from 'react';
import axios from 'axios';

export const MisReservas = ({ usuario }) => {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarReservas();
  }, [usuario]);

  const cargarReservas = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/viajes/reservas`, {
        params: { usuarioId: usuario.uid || usuario.id }
      });
      setReservas(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Cargando reservas...</p>
    </div>
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Mis Reservas</h1>
      <p className="page-subtitle">
        {reservas.length} reserva{reservas.length !== 1 ? 's' : ''} encontrada{reservas.length !== 1 ? 's' : ''}
      </p>

      {reservas.length === 0 ? (
        <div className="card-modern" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈️</div>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', textTransform: 'none', letterSpacing: 'normal', fontFamily: 'DM Sans, sans-serif', fontWeight: 400 }}>
            Aún no tienes reservas.<br />
            <span style={{ color: 'var(--accent)' }}>¡Empieza a planear tu viaje!</span>
          </h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reservas.map((reserva, i) => (
            <div key={reserva._id || i} className="card-modern" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700 }}>
                      Reserva #{(reserva._id || '').slice(-6).toUpperCase()}
                    </span>
                    <span className={`status-badge ${reserva.estado}`}>
                      {reserva.estado === 'pendiente' ? '⏳' : reserva.estado === 'pagado' ? '✅' : '❌'} {reserva.estado}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {reserva.vueloSeleccionado && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <span>✈️</span>
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {reserva.vueloSeleccionado.aerolinea} {reserva.vueloSeleccionado.numeroVuelo}
                        </strong>
                        <span>{reserva.vueloSeleccionado.origen} → {reserva.vueloSeleccionado.destino}</span>
                      </div>
                    )}
                    {reserva.hotelSeleccionado && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <span>🏨</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{reserva.hotelSeleccionado.nombre}</strong>
                        <span>· {reserva.noches} noche{reserva.noches !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      📅 {new Date(reserva.fechaReserva).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)' }}>
                    ${(reserva.total || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>MXN total</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};